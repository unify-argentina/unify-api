/*
 * Este módulo se encarga de manejar la verificación de cuenta
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
    req.assert('token', 'Token válido requerido').isString();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
      return res.status(400).send({ errors: req.validationErrors() });
    }
    // Si el token es un string, lo buscamos en la tabla
    else {
      VerifyToken.findOne({ token: req.params.token }, function(err, verifyToken) {
        if (err || !verifyToken) {
          logger.warn('Token not found: ' + req.params.token);
          return res.status(400).send({ errors: [{ msg: 'Hubo un error al verificar la cuenta de Unify' }] });
        }
        else {
          User.findOne({ _id: verifyToken.user })
            .populate('main_circle')
            .exec(function (err, user) {
            if (err || !user) {
              logger.warn('User not found: ' + req.user_id);
              return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
            }
            else {
              user.verified = true;
              user.save(function(err) {
                if (err) {
                  logger.error('Hubo un error inesperado');
                  return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
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