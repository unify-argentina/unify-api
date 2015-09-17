/*
 * Este módulo se encarga manejar la configuración de los mails y el envío de los mismos
 * @author Joel Márquez
 * */
'use strict';

// requires
var nodemailer = require('nodemailer');
var randomstring = require('randomstring');
var config = require('../../config');
var logger = require('../../config/logger');
var verifyTokenController = require('../auth/verify-token/verify-token.controller');
var recoveryPasswordController = require('../auth/recovery-password/recovery-password.controller');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.EMAIL_USERNAME,
    pass: config.EMAIL_PASSWORD
  }
});

module.exports.sendSignupEmailToUser = function(user) {

  verifyTokenController.createVerificationToken(user, function(err, verifyToken) {
    if (!err && verifyToken) {

      var mailOptions = {
        //from: 'Unify <login@unifyme.io>',
        to: user.email,
        subject: 'Bienvenido a Unify',
        text: 'Bienvenido a Unify',
        html: 'http://localhost:8080/auth/verify/' + verifyToken.token
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return logger.error('Error sending signup email to user ' + user + ': ' + error);
        }
        else {
          logger.info('Signup email sent to user ' + user + ': ' + info.response);
        }
      });
    }
    else {
      logger.error('Error creating signup verify token for user: ' + user + ': ' + err);
    }
  });
};

module.exports.sendRecoveryPasswordEmailToUser = function(user) {

  var password = randomstring.generate(10);
  user.password = password;
  user.save(function(err) {
    if (err) {
      logger.error('Error reseting password for user: ' + user + ': ' + err);
    }
    else {
      var mailOptions = {
        to: user.email,
        subject: 'Se ha reseteado tu contraseña',
        text: 'Se ha reseteado tu contraseña',
        html: 'Tu nueva contraseña es ' + password + '. Por favor cámbiala cuando ingreses nuevamente a Unify por alguna que recuerdes'
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return logger.error('Error sending recovery password email to user ' + user + ': ' + error);
        }
        else {
          logger.info('Recovery password email sent to user ' + user + ': ' + info.response);
        }
      });
    }
  });
};