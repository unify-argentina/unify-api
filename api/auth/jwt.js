/*
* Este módulo se encarga de crear un JSON Web Token, para cuando el usuario realiza
* el login, y a partir de ahí comienza a utilizar este token como modo de autenticación
* @author Joel Márquez
* */
'use strict';

// requires
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../../config/config');

// Este método crea un JSON Web Token
module.exports.createJWT = function (user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

// Este método verifica que en el request haya un JSON Web Token no vencido, si no lo hay
// o ya venció, devuelve un error
module.exports.ensureAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ errors: [{ msg: 'Please make sure your request has an Authorization header' }] });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ errors: [{ msg: err.message }] });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ errors: [{ msg: 'Token has expired' }] });
  }
  req.user = payload.sub;
  next();
};