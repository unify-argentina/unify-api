/*
* Este módulo se encarga de crear un JSON Web Token, para cuando el usuario realiza
* el login, y a partir de ahí comienza a utilizar este token como modo de autenticación
* @author Joel Márquez
* */
'use strict';

// requires
var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../../../config');

// Este método crea un JSON Web Token
module.exports.createJWT = function (user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };
  return jwt.sign(payload, config.TOKEN_SECRET);
};

module.exports.verify = function(token, tokenSecret) {
  return jwt.verify(token, tokenSecret);
};