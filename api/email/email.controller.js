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

  User.findOne({ _id: req.user }, User.socialFields())
    .populate('main_circle')
    .exec(function (err, user) {
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
    return res.send({
      emails: {
        count: sortedEmails.length,
        list: sortedEmails
      },
      errors: emailResults.errors
    });
  });
};

// TODO
module.exports.getById = function (req, res) {

  process.nextTick(function () {
    return res.sendStatus(200);
  });
};

// TODO
module.exports.create = function (req, res) {

  process.nextTick(function () {
    return res.sendStatus(200);
  });
};

// TODO
module.exports.delete = function (req, res) {

  process.nextTick(function () {
    return res.sendStatus(200);
  });
};