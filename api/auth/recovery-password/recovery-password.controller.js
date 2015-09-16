/*
 * Este módulo se encarga de manejar la recuperación de cuenta
 * @author Joel Márquez
 * */
'use strict';

// requires
var uuid = require('node-uuid');
var logger = require('../../../config/logger');
var jwt = require('../util/jwt');
var notificationsController = require('../../email/notifications.controller');

// modelos
var RecoveryPassword = require('./recovery-password.model');
var User = require('../../user/user.model');

module.exports.recover = function(req, res) {

	process.nextTick(function() {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }

    User.findOne({ email: req.body.email }, '+password')
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.body.email);
        return res.status(400).send({ errors: [{ msg: "User doesn't exist" }] });
      }
      // Si lo encontramos, generamos un token y se lo enviamos
      else {
        notificationsController.sendRecoveryPasswordEmailToUser(user);
        return res.sendStatus(200);
      }
    });
  });
};

module.exports.validateToken = function(req, res) {

  process.nextTick(function() {

    req.assert('token', 'Token must be a valid string').isString();
    req.assert('password', 'Password should have at least 6 characters of length').len(6, 100);
    req.assert('confirm_password', 'Required').notEmpty();
    req.assert('confirm_password', 'Confirm password must be equal to password').equals(req.body.password);

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }

    RecoveryPassword.findOne({ token: req.params.token }, function(err, recoveryPassword) {
        if (err || !recoveryPassword) {
          logger.warn('Token not found: ' + req.params.token);
          return res.status(400).send({ errors: [{ msg: 'Token not found' }] });
        }
        else {
          User.findOne({ _id: recoveryPassword.user }, function (err, user) {
            if (err || !user) {
              logger.warn('User not found: ' + req.user);
              return res.status(400).send({ errors: [{ msg: 'User not found' }] });
            }
            else {
              user.password = req.body.password;
              user.save(function(err) {
                if (err) {
                  logger.error('Error saving on DB: ' + err);
                  return res.status(400).send({ errors: [{ msg: 'Error saving on DB: ' + err }] });
                }
                else {
                  recoveryPassword.remove();
                  user.password = undefined;
                  return jwt.createJWT(res, user);
                }
              });
            }
          });
        }
      });
  }); 
};

module.exports.createRecoveryPassword = function(user, callback) {

  var recovery = new RecoveryPassword();
  recovery.token = uuid.v4();
  recovery.user = user._id;
  recovery.save(function(err) {
    logger.info('Verification token created: ' + recovery);
    callback(err, recovery);
  });
};