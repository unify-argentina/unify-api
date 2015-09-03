/*
 * Este módulo se encarga de manejar las rutas de verificacion de cuenta
 * @author Joel Márquez
 * */
'use strict';

// requires
var uuid = require('node-uuid');
var logger = require('../../../config/logger');
var jwt = require('../util/jwt');

// modelos
var VerifyToken = require('./verify-token.model');
var User = require('../../user/user.model');

// Verifica que el token pasado por parámetro sea válido
module.exports.verifyToken = function (req, res) {

  process.nextTick(function () {

    if (typeof req.params.token !== 'string') {
      logger.warn('No SQL injection - token: ' + req.params.token);
      return res.status(400).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
    }
    // Si el token es un string, lo buscamos en la tabla
    else {
      VerifyToken.findOne({ token: req.params.token }, function(err, verifyToken) {
        if (err || !verifyToken) {
          logger.warn('Token not found: ' + req.params.token);
          return res.status(400).send({ errors: [{ msg: 'Token not found' }] });
        }
        else {
          User.findOne({ _id: verifyToken.user }, function (err, user) {
            if (err || !user) {
              logger.warn('User not found: ' + req.user);
              return res.status(400).send({errors: [{msg: 'User not found'}]});
            }
            else {
              user.verified = true;
              user.save(function(err) {
                if (err) {
                  logger.error('Error saving on DB: ' + err);
                  return res.status(400).send({ errors: [{ msg: 'Error saving on DB: ' + err }] });
                }
                else {
                  verifyToken.remove();
                  user.password = undefined;
                  return jwt.createJWT(res, user);
                }
              });
            }
          });
        }
      });
    }
  });
};

// Crea un token de verificación de cuenta
module.exports.createVerificationToken = function(user, callback) {
  var verify = new VerifyToken();
  verify.token = uuid.v4();
  verify.user = user._id;
  verify.save(function(err) {
    logger.info('Verification token created: ' + verify);
    callback(err, verify);
  });
};