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
  ancestors: [{ type: ObjectId, ref: 'Circle', index: true }]
});

// TODO cascading
circleSchema.pre('remove', function(next) {
  var circle = this;
  next();
});

circleSchema.methods.hasAncestor = function(ancestor) {
  for (var i = 0; i < this.ancestors.length; i++) {
    if (this.ancestors[i].equals(ancestor._id)) {
      return true;
    }
  }
  return false;
};

circleSchema.methods.toString = function() {
  return 'Name: ' + this.name + ' parent: ' + this.parent;
};

module.exports = mongoose.model('Circle', circleSchema);