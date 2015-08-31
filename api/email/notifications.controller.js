/*
 * Este módulo se encarga manejar la configuración de los mails y el envío de los mismos
 * @author Joel Márquez
 * */
'use strict';

// requires
var nodemailer = require('nodemailer');
var config = require('../../config');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'unify.argentina@gmail.com',
    pass: 'UnifyProyecto2015'
  }
});

module.exports.sendSignupEmailToUser = function(user) {
  var mailOptions = {
    //from: 'Unify <login@unifyme.io>',
    to: user.email,
    subject: 'Bienvenido a Unify',
    text: 'Bienvenido a Unify',
    html: '<b>Bienvenido a Unify</b>'
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
};