/*
 * Este módulo se encarga de obtener un access token para poder realizar
 * un pedido a la API de Google teniendo el refresh_token
 * @author Joel Márquez
 * */
'use strict';

// requires
var request = require('request');
var config = require('../../../config');
var logger = require('../../../config/logger');
var googleErrors = require('./google.errors');

// constantes
var REFRESH_TOKEN_URL = 'https://www.googleapis.com/oauth2/v3/token';

// Obtiene un access token de Google en base al refresh token guardado
module.exports.getAccessToken = function(refresh_token, callback) {

  var qs = getRefreshTokenParams(refresh_token);

  // Le pegamos a la API para pedir un nuevo access token
  request.post(REFRESH_TOKEN_URL, { json: true, form: qs }, function(err, response, token) {

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

var getRefreshTokenParams = function(refresh_token) {
  return {
    client_id: config.GOOGLE_ID,
    client_secret: config.GOOGLE_SECRET,
    refresh_token: refresh_token,
    grant_type: 'refresh_token'
  };
};