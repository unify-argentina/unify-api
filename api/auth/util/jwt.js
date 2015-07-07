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
var logger = require('../../../config/logger')(__filename);

// Este método crea un JSON Web Token
module.exports.createJWT = function (user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };
  var token = jwt.sign(payload, config.TOKEN_SECRET);
  logger.info('User=' + user._id + ' token=' + token);
  return token;
};

// Este método verifica y desencripta el JSON Web Token
module.exports.verify = function(token, tokenSecret) {
  return jwt.verify(token, tokenSecret);
};

// Obtiene el token del header de autenticación
module.exports.getUnifyToken = function(req) {
  return req.headers.authorization.split(' ')[1];
};

// Este método sirve para asegurarse de que el request está autenticado
module.exports.ensureAuthenticated = function(req, res, next) {

  process.nextTick(function() {
    if (!req.headers.authorization) {
      logger.warn('Unauthorized: no token set');
      return res.status(401).send({ errors: [{ msg: 'Please make sure your request has an Authorization header' }] });
    }
    var token = module.exports.getUnifyToken(req);

    var payload = null;
    try {
      payload = jwt.verify(token, config.TOKEN_SECRET);
    }
    catch (err) {
      logger.error('Error verifying token: ' + err.message);
      return res.status(401).send({ errors: [{ msg: err.message }] });
    }

    logger.info('Token payload: ' + JSON.stringify(payload));
    if (payload.exp <= moment().unix()) {
      logger.warn('Token has expired: ' + payload.exp + ' is older than ' + moment().unix());
      return res.status(401).send({ errors: [{ msg: 'Token has expired' }] });
    }
    req.user = payload.sub;
    next();
  });
};