/*
 * Este módulo se encarga manejar la configuración de los mails y el envío de los mismos
 * @author Joel Márquez
 * */
'use strict';

// requires
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var randomstring = require('randomstring');
var util = require('util');
var config = require('../../config');
var logger = require('../../config/logger');
var verifyTokenController = require('../auth/verify-token/verify-token.controller');

var transporter = null;
if (config.EMAIL_SERVICE === 'Gmail') {
  transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD
    }
  });
}
else {
  transporter = nodemailer.createTransport(mandrillTransport({ auth: { apiKey: config.EMAIL_PASSWORD } }));
}


module.exports.sendSignupEmailToUser = function(user) {

  verifyTokenController.createVerificationToken(user, function(err, verifyToken) {
    if (!err && verifyToken) {

      var html = util.format('<a href="%s/#/auth/verify/%s">Verificar cuenta</a>', config.BASE_CLI_URL, verifyToken.token);
      logger.debug('Verify token HTML: ' + html);
      var mailOptions = {
        from: 'Unify <unify.argentina@gmail.com>',
        to: user.email,
        subject: 'Bienvenido a Unify',
        text: 'Bienvenido a Unify',
        html: html
      };

      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          logger.error('Error sending signup email to user ' + user + ': ' + JSON.stringify(err));
        }
        else {
          logger.info('Signup email sent to user ' + user + ': ' + info.response);
        }
      });
    }
    else {
      logger.error('Error creating signup verify token for user: ' + user + ': ' + JSON.stringify(err));
    }
  });
};


module.exports.sendVerifyEmailToUser = function(user) {

  verifyTokenController.createVerificationToken(user, function(err, verifyToken) {
    if (!err && verifyToken) {

      var html = util.format('<a href="%s/#/auth/verify/%s">Verificar cuenta</a>', config.BASE_CLI_URL, verifyToken.token);
      logger.debug('Verify token HTML: ' + html);
      var mailOptions = {
        from: 'Unify <unify.argentina@gmail.com>',
        to: user.email,
        subject: 'Verifica tu email',
        text: 'Verifica tu email',
        html: html
      };

      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          logger.error('Error sending verify email to user ' + user + ': ' + JSON.stringify(err));
        }
        else {
          logger.info('Verify email sent to user ' + user + ': ' + info.response);
        }
      });
    }
    else {
      logger.error('Error creating verify token for user: ' + user + ': ' + JSON.stringify(err));
    }
  });
};

module.exports.sendRecoveryPasswordEmailToUser = function(user) {

  var password = randomstring.generate(10);
  user.password = password;
  user.save(function(err) {
    if (err) {
      logger.error('Error reseting password for user: ' + user + ': ' + JSON.stringify(err));
    }
    else {
      var mailOptions = {
        to: user.email,
        subject: 'Se ha reseteado tu contraseña',
        text: 'Se ha reseteado tu contraseña',
        html: 'Tu nueva contraseña es ' + password + '. Por favor cámbiala cuando ingreses nuevamente a Unify por alguna que recuerdes'
      };

      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          logger.error('Error sending recovery password email to user ' + user + ': ' + JSON.stringify(err));
        }
        else {
          logger.info('Recovery password email sent to user ' + user + ': ' + info.response);
        }
      });
    }
  });
};