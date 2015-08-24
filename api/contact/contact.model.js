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

module.exports = mongoose.model('Contact', contactSchema);