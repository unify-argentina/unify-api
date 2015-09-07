/*
 * Este es el modelo de un contacto de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var _ = require('lodash');
var logger = require('../../config/logger');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var contactSchema = mongoose.Schema({

  name: { type: String, required: true },
  picture: { type: String, required: true },

  facebook: {
    id: String,
    display_name: String,
    valid: { type: Boolean, default: true }
  },

  twitter: {
    id: String,
    username: String,
    valid: { type: Boolean, default: true }
  },

  instagram: {
    id: String,
    username: String,
    valid: { type: Boolean, default: true }
  },

  google: {
    id: String,
    email: String,
    valid: { type: Boolean, default: true }
  },

  // Un contacto puede estar en más de un círculo, entonces creamos tiene que tener una referencia a cada
  // uno de sus padres y a sus ancestros
  parents: [{
    circle: { type: ObjectId, required: true, ref: 'Circle' },
    ancestors: [{ type: ObjectId, required: true, ref: 'Circle', index: true }]
  }],
  user: { type: ObjectId, required: true, ref: 'User' },

  created_at: { type: Date, select: false },
  updated_at: { type: Date, select: false }
});

// Actualiza la fecha de update y la de creación en caso de ser la primera vez
contactSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

contactSchema.methods.toString = function() {
  return 'id: ' + this._id + ' name: ' + this.name +
  ' user: ' + this.user + ' picture: ' + this.picture +
    ' parents: ' + this.parents;
};

// Chequea que el contacto efectivamente tenga la cuenta asociada
contactSchema.methods.hasLinkedAccount = function(account) {
  return this[account] !== undefined && typeof this[account].id === 'string';
};

contactSchema.methods.hasValidAccount = function(account) {
  return this[account] !== undefined && this[account].valid;
};

// Habilita/deshabilita la cuenta social vinculada del contacto
contactSchema.methods.toggleAccount = function(account, toggle) {
  if (this.hasLinkedAccount(account)) {
    this[account].valid = toggle;
  }
};

// Le genera los parents del contacto en base al círculo
contactSchema.methods.getContactParentsFromCircle = function(circle) {

  var newParents = [];
  // Nos quedamos solamente con los parents cuyos ancestros contengan al círculo
  // filteredParents es un array de parents
  logger.debug('Old parents: ' + JSON.stringify(this.parents));
  var filteredParents = _.filter(this.parents, { ancestors: [circle._id] });
  // Por cada filteredParents, debemos iterar en sus ancestros e ir agregándolos al array de
  // newParents. Una vez que encontramos al círculo buscado, nos detenemos y le agregamos
  // los ancestros del circulo
  if (filteredParents && filteredParents.length > 0) {
    for (var i = 0; i < filteredParents.length; i++) {
      var newParent = {};
      newParent.circle = filteredParents[i].circle;
      newParent.ancestors = [];
      var oldAncestors = filteredParents[i].ancestors;
      // Recorremos los viejos ancestros hasta encontrar el círculo buscado, luego cortamos ese ciclo,
      // agregamos el círculo y después lo ancestros del mismo ya que van a diferir de los del contacto
      if (oldAncestors && oldAncestors.length > 0) {
        for (var j = 0; j < oldAncestors.length; j++) {
          var ancestor = oldAncestors[j];
          if (!ancestor.equals(circle._id)) {
            newParent.ancestors.push(ancestor);
          }
          else {
            break;
          }
        }
        // Una vez encontrado el círculo, lo agregamos y agregamos los ancestros de ese círculo
        newParent.ancestors.push(circle._id);
        newParent.ancestors.push.apply(newParent.ancestors, circle.ancestors);
      }
      newParents.push(newParent);
    }
  }

  // Por último agregamos aquellos parents en los que no se encontraba el círculo a modificar, por
  // lo que tienen que quedar intactos
  var notContainingCircleParents = _.reject(this.parents, { ancestors: [circle._id] });
  newParents.push.apply(newParents, notContainingCircleParents);

  this.parents = newParents;
  logger.debug('New parents: ' + JSON.stringify(this.parents));
};

// Elimina los parents que tengan como ancestor el id del circulo,
// Si no queda ningún parent, entonces el contacto puede ser eliminado
contactSchema.methods.shouldRemoveFromCircle = function(circleId) {

  // rejectedParents son los parents que no tienen como ancestor el circleId
  var rejectedParents = _.reject(this.parents, { ancestors: [circleId] });
  this.parents = rejectedParents;
  return rejectedParents.length === 0;
};

// Este método genera los ancestros de un contacto (el círculo en el cual fue creado más los ancestros del círculo)
contactSchema.statics.getContactParentsFromCircles = function(circles) {
  var parents = [];

  circles.forEach(function(circle) {
    var contactAncestors = [circle._id];
    contactAncestors.push.apply(contactAncestors, circle.ancestors);
    parents.push({
      circle: circle._id,
      ancestors: contactAncestors
    });
  });

  return parents;
};

module.exports = mongoose.model('Contact', contactSchema);