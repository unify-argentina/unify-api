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
      return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
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
      return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener los emails' }] });
    }
    else {
      sendEmailResponseFromResults(res, results);
    }
  });
};

var getGoogleEmails = function(user, functionName, callback) {
  if (user.hasLinkedAccount('google')) {
    googleEmails[functionName](user.google.refresh_token, function(err, results) {
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

    req.assert('subject', 'Asunto válido requerido').isString();
    req.assert('text', 'Texto válido requerido').isString();
    req.assert('to', 'Destinatarios válidos requeridos').isEmailArray();
    req.assert('cc', 'Con copia válidos requeridos').optional().isEmailArray();
    req.assert('cco', 'Con copia oculta válidos requeridos').optional().isEmailArray();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }

    findUserAndThen(req, function(err, user) {
      if (err) {
        return res.status(400).send(err);
      }
      else {
        doCreateEmail(req, res, user);
      }
    });
  });
};

// Crea el mail y lo envía
var doCreateEmail = function(req, res, user) {

  googleEmails.create(user.google.refresh_token, user.google.email, req.body, function(err) {
    if (err) {
      logger.warn('There was an error creating email for user: ' + req.user);
      return res.status(400).send({ errors: [{ msg: 'Hubo un error al crear un email' }] });
    }
    else {
      logger.info('Email sent ok for user: ' + req.user);
      return res.sendStatus(200);
    }
  });
};

// Elimina el email
module.exports.delete = function (req, res) {

  process.nextTick(function () {

    findUserAndThen(req, function(err, user) {
      if (err) {
        return res.status(400).send(err);
      }
      else {
        googleEmails.delete(user.google.refresh_token, req.params.email_id, function(err) {
          return res.sendStatus(200);
        });
      }
    });
  });
};

// Marca como leído un email
module.exports.markEmailSeen = function (req, res) {

  process.nextTick(function () {

    req.assert('email_ids', 'Ids de los emails válidos requeridos').isStringArray();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }
    else {
      toggleEmailSeen(req, res, true);
    }
  });
};

// Marca como no leído un email
module.exports.markEmailUnseen = function (req, res) {

  process.nextTick(function () {

    req.assert('email_ids', 'Ids de los emails válidos requeridos').isStringArray();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }
    else {
      toggleEmailSeen(req, res, false);
    }
  });
};

// Marca como leído / no leído un email
var toggleEmailSeen = function (req, res, toggle) {

  findUserAndThen(req, function(err, user) {
    if (err) {
      return res.status(400).send(err);
    }
    else {
      googleEmails.toggleEmailSeen(user.google.refresh_token, req.body.email_ids, toggle, function(err) {
        return res.sendStatus(200);
      });
    }
  });
};

// Mueve a la papelera de reciclaje un email
module.exports.trash = function (req, res) {

  process.nextTick(function () {

    req.assert('email_ids', 'Ids de los emails válidos requeridos').isStringArray();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }
    else {
      toggleEmailTrash(req, res, true);
    }
  });
};

// Saca de la papelera de reciclaje un email
module.exports.untrash = function (req, res) {

  process.nextTick(function () {

    req.assert('email_ids', 'Ids de los emails válidos requeridos').isStringArray();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }
    else {
      toggleEmailTrash(req, res, false);
    }
  });
};

var toggleEmailTrash = function(req, res, toggle) {

  findUserAndThen(req, function(err, user) {
    if (err) {
      return res.status(400).send(err);
    }
    else {
      googleEmails.toggleEmailTrash(user.google.refresh_token, req.body.email_ids, toggle, function(err) {
        return res.sendStatus(200);
      });
    }
  });
};

// Funcion que encuentra al usuario y chequea que tenga la cuenta de Google linkeada
var findUserAndThen = function(req, callback) {
  User.findOne({ _id: req.user }, User.socialFields(), function (err, user) {
    if (err || !user) {
      logger.warn('User not found: ' + req.user);
      callback({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] }, null);
    }
    // Si no tiene la cuenta linkeada de Google no lo dejaremos enviar un correo
    else if (!user.hasLinkedAccount('google')) {
      logger.warn('User have not linked Google account: ' + req.user);
      callback({ errors: [{ msg: 'User has not linked his Google account' }] }, null);
    }
    // Si esta todo ok procedemos a crear y enviar el email
    else {
      callback(null, user);
    }
  });
};