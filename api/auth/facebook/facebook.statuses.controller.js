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

// constantes
var USER_STATUSES_URL = facebookUtils.getBaseURL() + '/%s/statuses?access_token=%s';

module.exports.getStatuses = function(accessToken, facebookId, callback) {

  var url = util.format(USER_STATUSES_URL, facebookId, accessToken);
  logger.debug('URL: ' + url);

  request.get({ url: url, json: true }, function(err, response) {
    if (err) {
      callback(err, null);
    }
    else {
      // Si no hubo error, tenemos que mapear el response
      async.map(response.body.data, mapStatus, function(err, mappedMedia) {
        logger.debug('Media: ' + JSON.stringify(mappedMedia));
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
    type: 'image',
    created_time: moment(facebookMedia.updated_time, facebookUtils.getFacebookDateFormat(), 'en').unix() || '',
    //likes: facebookMedia.favorite_count || 0,
    text: facebookMedia.message || ''
    //user_has_liked: facebookMedia.favorited || false
  };

  callback(null, mappedMedia);
};