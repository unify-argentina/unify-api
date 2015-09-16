/*
 * Este módulo se encarga manejar la configuración de los mails y el envío de los mismos
 * @author Joel Márquez
 * */
'use strict';

// requires
var nodemailer = require('nodemailer');
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

  recoveryPasswordController.createRecoveryPassword(user, function(err, recoveryPassword) {
    if (!err && recoveryPassword) {

      var mailOptions = {
        to: user.email,
        subject: 'Recupera tu contraseña',
        text: 'Recupera tu contraseña',
        html: 'http://localhost:8080/auth/recover/' + recoveryPassword.token
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
    else {
      logger.error('Error creating recovery password for user: ' + user + ': ' + err);
    }
  });
};