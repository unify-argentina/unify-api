/*
 * Este es el modelo de la recuperación de cuenta de Unify, la cual cuenta con un
 * token, fecha de creacion y id del usuario a recuperar
 * @author Joel Márquez
 * */
'use strict';

// requires
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var recoveryPasswordSchema = mongoose.Schema({

  token: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now, expires: '4h' },
  user: { type: ObjectId, ref: 'User' }
});

recoveryPasswordSchema.methods.toString = function() {
  return 'Token: ' + this.token + ', created_at: ' + this.created_at + ', user: ' + this.user;
};

module.exports = mongoose.model('RecoveryPassword', recoveryPasswordSchema);