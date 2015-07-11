/*
 * Este es el modelo de un contacto de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var contactSchema = mongoose.Schema({

  name: String,
  email: String,
  picture: String,
  facebookId: String,
  twitterId: String,
  instagramId: String,
  circle: { type: ObjectId, ref: 'Circle' },
  user: { type: ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Contact', contactSchema);