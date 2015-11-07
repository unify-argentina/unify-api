/*
 * Dentro de este módulo hay utilidades de la API de Google
 * @author Joel Márquez
 * */
'use strict';

// requires
var request = require('request');
var config = require('../../../config');
var logger = require('../../../config/logger');
var googleErrors = require('./google.errors');

// Obtiene un access token de Google en base al refresh token guardado
module.exports.getAccessToken = function(refresh_token, callback) {

  var qs = getRefreshTokenParams(refresh_token);

  // Le pegamos a la API para pedir un nuevo access token
  request.post(this.getRefreshTokenURL(), { json: true, form: qs }, function(err, response, token) {

    var oauthError = googleErrors.hasError(err, response);
    if (oauthError.hasError) {
      logger.error('Google oauth error: ' + JSON.stringify(oauthError.error));
      callback({ errors: [ oauthError.error ] }, null);
    }
    else {
      logger.debug('Google access token ok: ' + token.access_token);
      callback(null, token.access_token);
    }
  });
};

// Devuelve los parámetros necesarios para solicitar el refresh_token
var getRefreshTokenParams = function(refresh_token) {
  return {
    client_id: config.GOOGLE_ID,
    client_secret: config.GOOGLE_SECRET,
    refresh_token: refresh_token,
    grant_type: 'refresh_token'
  };
};

// Devuelve los parámetros necesarios para el intercambio del access_token
module.exports.getAccessTokenParams = function(req) {
  return {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
};

// Devuelve la URL para obtener un refresh token de Google
module.exports.getRefreshTokenURL = function() {
  return 'https://www.googleapis.com/oauth2/v3/token';
};

// Devuelve la URL para intercambiar el access token de Google
module.exports.getOauthURL = function() {
  return 'https://accounts.google.com/o/oauth2/token';
};

// Devuelve la URL para obtener la información del perfil de Google
module.exports.getUserProfileURL = function() {
  return 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
};

// Devuelve la URL para obtener los contactos de Google
module.exports.getContactsURL = function() {
  return 'https://www.google.com/m8/feeds/contacts/default/full';
};

// Listado de emails
module.exports.getUserEmailGenericListURL = function() {
  return 'https://www.googleapis.com/gmail/v1/users/me/messages';
};

// Detalle de un email
module.exports.getUserEmailDetailURL = function() {
  return 'https://www.googleapis.com/gmail/v1/users/me/messages/%s';
};

// Detalle de un label
module.exports.getUserEmailLabelsURL = function() {
  return 'https://www.googleapis.com/gmail/v1/users/me/labels/%s';
};

// Envío de email
module.exports.getUserEmailSendURL = function() {
  return 'https://www.googleapis.com/gmail/v1/users/me/messages/send';
};

// Marcar como visto un email
module.exports.getUserEmailModifyURL = function() {
  return 'https://www.googleapis.com/gmail/v1/users/me/messages/%s/modify';
};

// Borra un email
module.exports.getUserEmailDeleteURL = function() {
  return 'https://www.googleapis.com/gmail/v1/users/me/messages/%s';
};

// Formato de fecha de gmail
module.exports.getGmailDateFormat = function() {
  return 'dd[,] DD MMM YYYY HH:mm:ss ZZ';
};

// Mimetypes
module.exports.MIMETYPES = {
  TEXT: 'text/plain',
  HTML: 'text/html'
};

// Inbox
module.exports.getInboxName = function() {
  return 'INBOX';
};

// Sent
module.exports.getSentName = function() {
  return 'SENT';
};

// Draft
module.exports.getDraftName = function() {
  return 'DRAFT';
};

// Trash
module.exports.getTrashName = function() {
  return 'TRASH';
};