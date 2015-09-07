/*
 * Este es el modelo de un circulo de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
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
  updated_at: { type: Date, select: false }
});

// Actualiza la fecha de update y la de creación en caso de ser la primera vez
circleSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

// Una vez salvado el círculo buscamos los contactos que lo tengan como ancestro para actualizarlos
circleSchema.post('save', function(circle, next) {
  Contact.find({ 'parents.ancestors': circle._id }, function(err, contacts) {
    if (err || !contacts || contacts.length === 0) {
      next();
    }
    else {
      contacts.forEach(function(contact) {
        var count = 0;
        contact.getContactParentsFromCircle(circle);
        contact.save(function(err) {
          count++;
          if (err || count === contacts.length) {
            next();
          }
        });
      });
    }
  });
});

// Una vez que se elimina un circulo, tenemos que eliminar todos los subcirculos y los
// contactos que lo tengan dentro de sus ancestros si es que se encuentran solo en ese circulo,
// si se encuentran en mas de un circulo, entonces borramos ese elemento de los parents
circleSchema.pre('remove', function(next) {
  var circleId = this._id;
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