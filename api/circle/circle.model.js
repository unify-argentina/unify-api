/*
 * Este es el modelo de un circulo de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

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