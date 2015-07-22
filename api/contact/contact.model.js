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
  picture: String,
  facebook_id: String,
  twitter_id: String,
  instagram_id: String,
  circle: { type: ObjectId, required: true, ref: 'Circle' },
  user: { type: ObjectId, required: true, ref: 'User' }
});

contactSchema.methods.toString = function() {
  return 'id: ' + this._id + ' name: ' + this.name +
  ' user: ' + this.user +
  ' picture: ' + this.picture +
  ' facebook_id: ' + this.facebook_id +
  ' twitter_id: ' + this.twitter_id +
  ' instagram_id: ' + this.instagram_id +
  ' circle: ' + this.circle;
};

// Chequea que el contacto efectivamente tenga la cuenta asociada
contactSchema.methods.hasLinkedAccount = function(account) {
  return typeof this[account + '_id'] === 'string';
};

module.exports = mongoose.model('Contact', contactSchema);