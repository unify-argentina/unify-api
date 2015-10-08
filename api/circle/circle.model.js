/*
 * Este es el modelo de un circulo de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// modelos
var Contact = require('../contact/contact.model');

var circleSchema = mongoose.Schema({

  name: { type: String, required: true },
  picture: String,
  user: { type: ObjectId, ref: 'User', index: true, required: true },
  parent: { type: ObjectId, ref: 'Circle', index: true },
  ancestors: [{ type: ObjectId, ref: 'Circle', index: true }],

  created_at: { type: Date, select: false },
  updated_at: { type: Date, select: false },

  // El hook_enabled sirve para que el hook post save se ejecute sólamente en el círculo padre
  // y no en los subcírculos, por eso por default es false y antes de salvar el círculo padre lo ponemos en true
  hook_enabled:{ type: Boolean, required: false, default: false, select: false }
});

// Actualiza la fecha de update y la de creación en caso de ser la primera vez
circleSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  this.wasNew = this.isNew;
  next();
});

// Una vez salvado el círculo buscamos los contactos que lo tengan como ancestro para actualizarlos
circleSchema.post('save', function(circle, next) {
  var self = this;
  // Si está habilitado el hook y no es nuevo el círculo (se está haciendo un update)
  if (self.hook_enabled) {
    if (!self.wasNew) {
      async.parallel({
        circles: updateCircles.bind(null, circle, self),
        contacts: updateContacts.bind(null, circle)
      },
      function(err, results) {
        // Cuando terminamos de procesar todo, volvemos a setear el hook_enabled en false
        self.hook_enabled = false;
        self.save(function(err) {
          next();
        });
      });
    }
    else {
      // Si está habilitado y es nuevo, el círculo se creó recientemente, por lo que tenemos que deshabilitarlo y volver
      self.hook_enabled = false;
      self.save(function(err) {
        next();
      });
    }
  }
  // Por acá pasa cuando no está habilitado directamente, por lo que no tiene que hacer nada
  else {
    next();
  }
});

// Actualiza los contactos que tengan al circulo salvado como ancestro
var updateContacts = function(circle, callback) {
  Contact.find({ 'parents.ancestors': circle._id }, function(err, contacts) {
    if (err || !contacts) {
      callback(err, null);
    }
    else if (contacts.length > 0) {
      // Por cada contacto recalculamos los ancestros de ese contacto
      contacts.forEach(function(contact) {
        var count = 0;
        contact.getContactParentsFromCircle(circle);
        contact.save(function(err) {
          count++;
          if (err || count === contacts.length) {
            callback(null, null);
          }
        });
      });
    }
    else {
      callback(null, null);
    }
  });
};

// Actualiza los subcirculos del circulo recientemente guardado
var updateCircles = function(circle, self, callback) {

  // Primero buscamos los subcirculos que lo tengan como ancestro
  self.constructor.find({ ancestors: circle._id })
    .populate('ancestors')
    .exec(function(err, subcircles) {
    // Si hubo error devolvemos
    if (err || !subcircles) {
      callback(err, null);
    }
    // Si hay al menos uno, hacemos el procesamiento
    else if (subcircles.length > 0) {
      subcircles.forEach(function(subcircle) {
        var ancestors = [];
        var oldAncestors = subcircle.ancestors;
        // Recorremos los viejos ancestros hasta encontrar el círculo buscado, luego cortamos ese ciclo,
        // agregamos el círculo y después lo ancestros del mismo
        if (oldAncestors && oldAncestors.length > 0) {
          for (var i = 0; i < oldAncestors.length; i++) {
            var ancestor = oldAncestors[i];
            if (!ancestor._id.equals(circle._id)) {
              ancestors.push(ancestor);
            }
            else {
              break;
            }
          }
          // Una vez encontrado el círculo, lo agregamos y agregamos los ancestros de ese círculo
          ancestors.push(circle._id);
          ancestors.push.apply(ancestors, circle.ancestors);
        }

        // Por último le asignamos los nuevos ancestros y salvamos el círculo, si es el último volvemos
        subcircle.ancestors = ancestors;
      });

      async.forEachSeries(subcircles, function(subcircle, callback) {
        subcircle.save(callback);
      }, callback);
    }
    // Si no hubo subcírculos encontrados, volvemos
    else {
      callback(null, null);
    }
  });
};

// Una vez que se elimina un circulo, tenemos que eliminar todos los subcirculos y los
// contactos que lo tengan dentro de sus ancestros si es que se encuentran solo en ese circulo,
// si se encuentran en mas de un circulo, entonces borramos ese elemento de los parents
circleSchema.pre('remove', function(next) {
  var circleId = this._id;
  // Primero eliminamos los subcírculos y después los contactos
  this.constructor.find({ ancestors: circleId }).remove().exec(function(err) {
    Contact.find({ 'parents.ancestors': circleId }, function(err, contacts) {
      if (err || !contacts || contacts.length === 0) {
        next();
      }
      else {
        contacts.forEach(function(contact) {
          var count = 0;
          // Si el contacto tiene un solo parent, entonces lo eliminamos
          if (contact.shouldRemoveFromCircle(circleId)) {
            contact.remove(function(err) {
              count++;
              if (err || count === contacts.length) {
                next();
              }
            });
          }
          // Sino, guardamos ese contacto
          else {
            contact.save(function(err) {
              count++;
              if (err || count === contacts.length) {
                next();
              }
            });
          }
        });
      }
    });
  });
});

circleSchema.methods.toString = function() {
  return 'ID: ' + this._id + ' Name: ' + this.name + ' parent: ' + this.parent;
};

// Chequea que dentro de los ancestros se encuentre el ancestro pasado por parámetro
circleSchema.methods.hasAncestor = function(ancestor) {
  for (var i = 0; i < this.ancestors.length; i++) {
    if (this.ancestors[i].equals(ancestor._id)) {
      return true;
    }
  }
  return false;
};

module.exports = mongoose.model('Circle', circleSchema);