/*
 * Este módulo se encarga de obtener los estados de Facebook
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var moment = require('moment');
var logger = require('../../../config/logger');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');

// constantes
var USER_STATUSES_URL = facebookUtils.getBaseURL() + '/%s/statuses?fields=id,message,updated_time,likes.limit(0).summary(true),comments.limit(0).summary(true)&access_token=%s';

// Devuelve los estados del usuario pasado por parámetro
module.exports.getStatuses = function(access_token, facebookId, callback) {

  var url = util.format(USER_STATUSES_URL, facebookId, access_token);
  logger.info('URL: ' + url);

  request.get({ url: url, json: true }, function(err, response) {

    var result = facebookErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    else {
      // Si no hubo error, tenemos que mapear el response
      async.map(response.body.data, mapStatus, function(err, mappedMedia) {
        logger.info('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};

// Recibe un objeto de tipo imagen y devuelve uno homogéneo a las 3 redes sociales
var mapStatus = function(facebookMedia, callback) {

  var mappedMedia = {
    provider: 'facebook',
    id: facebookMedia.id || '',
    type: 'text',
    created_time: moment(facebookMedia.updated_time, facebookUtils.getFacebookDateFormat(), 'en').unix() || '',
    likes: facebookMedia.likes.summary.total_count || 0,
    text: facebookMedia.message || ''
    //user_has_liked: facebookMedia.favorited || false
  };

  callback(null, mappedMedia);
};