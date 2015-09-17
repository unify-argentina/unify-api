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