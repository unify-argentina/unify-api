/*
 * Este módulo se encarga de manejar los emails de Google del usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var logger = require('../../../config/logger');
var googleErrors = require('./google.errors');

// constantes
var USER_EMAIL_GENERIC_LIST_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages?labelIds=%s';
var USER_EMAIL_INBOX_LIST_URL = util.format(USER_EMAIL_GENERIC_LIST_URL, 'INBOX');
var USER_EMAIL_SENT_LIST_URL = util.format(USER_EMAIL_GENERIC_LIST_URL, 'SENT');
var USER_EMAIL_DRAFT_LIST_URL = util.format(USER_EMAIL_GENERIC_LIST_URL, 'DRAFT');
var USER_EMAIL_TRASH_LIST_URL = util.format(USER_EMAIL_GENERIC_LIST_URL, 'TRASH');

var USER_EMAIL_DETAIL_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/%s';

// formato de fecha de gmail
var GMAIL_DATE_FORMAT = 'dd[,] DD MMM YYYY HH:mm:ss ZZ';

// mimetypes
var MIMETYPES = {
  TEXT: 'text/plain',
  HTML: 'text/html'
};

// Lista los mensajes de la bandeja de entrada
module.exports.listInbox = function(access_token, callback) {

  list(access_token, USER_EMAIL_INBOX_LIST_URL, callback);
};

// Lista los mensajes enviados
module.exports.listSent = function(access_token, callback) {

  list(access_token, USER_EMAIL_SENT_LIST_URL, callback);
};

// Lista los mensajes borradores
module.exports.listDraft = function(access_token, callback) {

  list(access_token, USER_EMAIL_DRAFT_LIST_URL, callback);
};

// Lista los mensajes de la papelera de reciclaje
module.exports.listTrash = function(access_token, callback) {

  list(access_token, USER_EMAIL_TRASH_LIST_URL, callback);
};

// Devuelve los emails de la cuenta de google del usuario loggeado
var list = function(access_token, url, callback) {

  // Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Google
  var emails = [];

  getGoogleData(url, access_token, emails, function(err, googleEmails) {
    if (err) {
      callback(null, err);
    }
    else {

      async.map(googleEmails, function(email, mapCallback) {

        var url = util.format(USER_EMAIL_DETAIL_URL, email.id);

        var headers = { Authorization: 'Bearer ' + access_token };

        request.get({ url: url, headers: headers, json: true }, function(err, response) {
          var result = googleErrors.hasError(err, response);
          if (result.hasError) {
            mapCallback(result.error, null);
          }
          else {
            mapCallback(null, mapEmail(response.body));
          }
        });

      }, function(err, googleDetailedEmails) {

        logger.debug('Google emails: ' + JSON.stringify(googleDetailedEmails));
        callback(err, googleDetailedEmails);
      });
    }
  });
};

// Le pega a la API de Google y en el response, si fue exitoso, van a estar los emails del usuario
var getGoogleData = function(url, access_token, emails, callback) {

  logger.info('URL: ' + url);

  var headers = { Authorization: 'Bearer ' + access_token };

  request.get({ url: url, headers: headers, json: true }, function(err, response) {

    var result = googleErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error, null);
    }
    else if (!response.body.messages || response.body.messages.length === 0) {
      callback(null, emails);
    }
    // Ya tengo los emails y los devuelvo en el callback
    else {
      emails.push.apply(emails, response.body.messages);
      callback(null, emails);
    }
  });
};

// Recibe un objeto de email de Google y devuelve uno mas simple
var mapEmail = function(googleEmail) {

  var emailValues = getValuesFromPayload(googleEmail);
  var bodyValues = getBodyFromPayload(googleEmail);
  
  return {
    id: googleEmail.id,
    threadId: googleEmail.threadId,
    snippet: googleEmail.snippet,
    provider: 'google',
    date: emailValues.date,
    from: emailValues.from,
    to: emailValues.to,
    cc: emailValues.cc,
    cco: emailValues.cco,
    subject: emailValues.subject,
    text: bodyValues.text,
    html: bodyValues.html
  };
};

// Obtiene el valor pedido dentro del array de headers
var getValuesFromPayload = function(googleEmail, name) {

  var result = {
    date: '',
    from: '',
    to: '',
    cc: [],
    cco: [],
    subject: ''
  };
  var payload = googleEmail.payload;

  if (payload) {
    var headers = payload.headers;
    if (headers && headers.length > 0) {

      var date = ensureValue(headers, 'Date');
      result.date = moment(date, GMAIL_DATE_FORMAT, 'en').unix();
      result.from = ensureValue(headers, 'From');
      result.to = ensureValue(headers, 'To');
      result.cc = ensureArrayValue(headers, 'Cc');
      result.cco = ensureArrayValue(headers, 'Cco');
      result.subject = ensureValue(headers, 'Subject');
    }
  }

  return result;
};

// Se asegura de devolver un valor vacío o el valor del header a buscar
var ensureValue = function(headers, name) {
  var header = _.find(headers, { name: name });
  return header ? header.value : '';
};

// Se asegura de devolver un array vacío o el array del header a buscar
var ensureArrayValue = function(headers, name) {
  var header = _.find(headers, { name: name });
  return header ? header.value.split(', ') : [];
};

// Obtiene el cuerpo del mail, en formato texto y html
var getBodyFromPayload = function(googleEmail, contentType) {

  var result = {
    text: '',
    html: ''
  };

  var payload = googleEmail.payload;

  if (payload) {
    if (payload.body.size === 0) {
      var parts = payload.parts;

      if (parts && parts.length > 0) {
        result.text = findPartValue(parts, MIMETYPES.TEXT);
        result.html = findPartValue(parts, MIMETYPES.HTML);
      }
    }
    else if (payload.mimeType === MIMETYPES.HTML) {
      result.html = payload.body.data;
    }
  }

  return result;
};

// Encuentra recursivamente el valor del part pasado como parámetro en mimeType
var findPartValue = function(parts, mimeType) {

  var part = _.find(parts, { mimeType: mimeType });
  if (part && part.filename === '') {
    return part.body.data || '';
  }
  else {
    var result = '';
    for (var i = 0; result === '' && i < parts.length; i++) {
      result = findPartValue(parts[i].parts, mimeType);
    }
    return result;
  }
};