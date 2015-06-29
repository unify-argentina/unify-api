/*
 * Este es el modelo de un contacto de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({

  name: String,
  email: String,
  picture: String,
  facebookId: String,
  twitterId: String,
  instagramId: String
});

module.exports = mongoose.model('Contact', contactSchema);