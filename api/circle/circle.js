/*
 * Este es el modelo de un circulo de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var circleSchema = mongoose.Schema({

  name: String,
  parent: { type: ObjectId, ref: 'Circle', index: true },
  contacts: [{ type: ObjectId, ref: 'Contact' }]
});

module.exports = mongoose.model('Circle', circleSchema);