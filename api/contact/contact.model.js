/*
 * Este es el modelo de un contacto de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var contactSchema = mongoose.Schema({

  // TODO required, select
  name: String,
  picture: String,
  facebook_id: String,
  twitter_id: String,
  instagram_id: String,
  circle: { type: ObjectId, ref: 'Circle' },
  user: { type: ObjectId, ref: 'User' }
});

contactSchema.methods.toString = function() {
  return 'name: ' + this.name +
  'user: ' + this.user +
  'picture: ' + this.picture +
  'facebook_id: ' + this.facebook_id +
  'twitter_id: ' + this.twitter_id +
  'instagram_id: ' + this.instagram_id +
  'circle: ' + this.circle;
};

module.exports = mongoose.model('Contact', contactSchema);