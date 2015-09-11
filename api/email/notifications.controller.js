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