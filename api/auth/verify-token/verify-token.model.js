/*
 * Este es el modelo de la verificacion de cuenta de Unify, la cual cuenta con un
 * token, fecha de creacion y id del usuario a verificar
 * @author Joel Márquez
 * */
'use strict';

// requires
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var verifyTokenSchema = mongoose.Schema({

  token: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now, expires: '4h' },
  user: { type: ObjectId, ref: 'User' }
});

verifyTokenSchema.methods.toString = function() {
  return 'Token: ' + this.token + ', created_at: ' + this.created_at + ', user: ' + this.user;
};

module.exports = mongoose.model('VerifyToken', verifyTokenSchema);