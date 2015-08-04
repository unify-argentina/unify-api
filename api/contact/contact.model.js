/*
 * Este es el modelo de un contacto de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var contactSchema = mongoose.Schema({

  name: { type: String, required: true },
  picture: { type: String, required: true },

  facebook: {
    id: String,
    display_name: String
  },

  twitter: {
    id: String,
    username: String
  },

  instagram: {
    id: String,
    username: String
  },

  google: {
    id: String,
    email: String
  },

  // Un contacto puede estar en más de un círculo, entonces creamos tiene que tener una referencia a cada
  // uno de sus padres y a sus ancestros
  parents: [{
    circle: { type: ObjectId, required: true, ref: 'Circle' },
    ancestors: [{ type: ObjectId, ref: 'Circle', index: true }]
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
  ' user: ' + this.user +
  ' picture: ' + this.picture;
};

// Chequea que el contacto efectivamente tenga la cuenta asociada
contactSchema.methods.hasLinkedAccount = function(account) {
  return typeof this[account].id === 'string';
};

module.exports = mongoose.model('Contact', contactSchema);