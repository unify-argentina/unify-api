/*
 * Este módulo maneja todo lo que es el envio de mails, recepcion de los mismos,
 * vista de carpetas y demas
 * @author Joel Márquez
 * */
'use strict';

// requires
var errorHelper = require('../auth/util/error.helper');
var googleEmails = require('../auth/google/google.email.controller');
var logger = require('../../config/logger');
var async = require('async');
var _ = require('lodash');
var validator = require('validator');

// modelos
var User = require('../user/user.model');

var EMAIL_FUNCTION_NAMES = {
  INBOX: 'listInbox',
  SENT: 'listSent',
  DRAFT: 'listDraft',
  TRASH: 'listTrash'
};

// Lista los emails de la bandeja de entrada del usuario
module.exports.listInbox = function (req, res) {

  process.nextTick(function () {
    list(req, res, EMAIL_FUNCTION_NAMES.INBOX);
  });
};

// Lista los emails enviados del usuario
module.exports.listSent = function (req, res) {

  process.nextTick(function () {
    list(req, res, EMAIL_FUNCTION_NAMES.SENT);
  });
};

// Lista los emails borradores del usuario
module.exports.listDraft = function (req, res) {

  process.nextTick(function () {
    list(req, res, EMAIL_FUNCTION_NAMES.DRAFT);
  });
};

// Lista los emails eliminados del usuario
module.exports.listTrash = function (req, res) {

  process.nextTick(function () {
    list(req, res, EMAIL_FUNCTION_NAMES.TRASH);
  });
};

// Se encarga de obtener los emails de la carpeta especificada en 'functionName'
var list = function (req, res, functionName) {

  User.findOne({ _id: req.user }, User.socialFields(), function (err, user) {
    if (err || !user) {
      logger.warn('User not found: ' + req.user);
      return res.status(400).send({ errors: [{ msg: 'User not found' }] });
    }
    else {
      doGetEmails(res, user, functionName);
    }
  });
};

// Una vez encontrado el usuario, va a buscar los emails de las cuentas que tenga asociadas
var doGetEmails = function(res, user, functionName) {

  async.parallel({
    google: getGoogleEmails.bind(null, user, functionName)
  },
  // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
  function(err, results) {
    if (err) {
      logger.warn('Error searching ' + functionName + ' emails ' + err);
      return res.status(400).send({ errors: [{ msg: 'There was an error obtaining user emails' }] });
    }
    else {
      sendEmailResponseFromResults(res, results);
    }
  });
};

var getGoogleEmails = function(user, functionName, callback) {
  if (user.hasLinkedAccount('google')) {
    googleEmails[functionName](user.google.access_token, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Google, no devolvemos nada
  else {
    callback(null, null);
  }
};

// Envía al cliente los emails del usuario
var sendEmailResponseFromResults = function(res, results) {

  var emailResults = errorHelper.checkEmailErrors(results);

  // Una vez que tenemos los emails
  async.sortBy(emailResults.emails, function(email, callback) {
    // los ordenamos por fecha (los más nuevos primero)
    callback(null, -email.date);
    // Una vez que los ordenamos, los enviamos
  }, function(err, sortedEmails) {
    var o = {
      emails: {
        total_count: emailResults.count.total_count,
        unread_count: emailResults.count.unread_count,
        count: sortedEmails.length,
        list: sortedEmails
      },
      errors: emailResults.errors
    };
    return res.send(o);
  });
};

// Envia un email con la cuenta de Google
module.exports.create = function (req, res) {

  process.nextTick(function () {

    req.assert('subject', 'Required').notEmpty();
    req.assert('subject', 'Subject must be a string').isString();
    req.assert('text', 'Required').notEmpty();
    req.assert('text', 'Text must be a string').isString();
    req.assert('to', 'To must be an email array').isEmailArray();
    req.assert('cc', 'Cc must be an email array').optional().isEmailArray();
    req.assert('cco', 'Cco must be an email array').optional().isEmailArray();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }

    User.findOne({ _id: req.user }, User.socialFields())
      .populate('main_circle')
      .exec(function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      // Si no tiene la cuenta linkeada de Google no lo dejaremos enviar un correo
      else if (!user.hasLinkedAccount('google')) {
        logger.warn('User have not linked Google account: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User has not linked his Google account' }] });
      }
      // Si esta todo ok procedemos a crear y enviar el email
      else {
        doCreateEmail(req, res, user);
      }
    });
  });
};

// Crea el mail y lo envía
var doCreateEmail = function(req, res, user) {

  googleEmails.create(user.google.access_token, user.google.email, req.body, function(err) {
    if (err) {
      logger.warn('There was an error creating email for user: ' + req.user);
      return res.status(400).send({ errors: [{ msg: 'There was an error creating email' }] });
    }
    else {
      logger.info('Email sent ok for user: ' + req.user);
      return res.sendStatus(200);
    }
  });
};

// TODO
module.exports.delete = function (req, res) {

  process.nextTick(function () {
    return res.sendStatus(200);
  });
};