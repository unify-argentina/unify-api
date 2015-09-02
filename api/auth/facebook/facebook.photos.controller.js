/*
 * Este módulo se encarga de obtener las fotos de Facebook
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
var USER_PHOTOS_URL = facebookUtils.getBaseURL() + '/%s/photos?%sfields=id,name,created_time,album,images,link,likes.limit(0).summary(true),comments.limit(0).summary(true)&access_token=%s';

// Devuelve las fotos del usuario pasado por parámetro
module.exports.getPhotos = function(access_token, facebookId, uploaded, callback) {

  var uploadedString = uploaded ? 'type=uploaded&' : '';
  var url = util.format(USER_PHOTOS_URL, facebookId, uploadedString, access_token);
  logger.info('URL: ' + url);

  request.get({ url: url, json: true }, function(err, response) {

    var result = facebookErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    else {
      // Si no hubo error, tenemos que mapear el response
      async.map(response.body.data, mapPhoto, function(err, mappedMedia) {
        logger.debug('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};

// Recibe un objeto de tipo imagen y devuelve uno homogéneo a las 3 redes sociales
var mapPhoto = function(facebookMedia, callback) {

  var mappedMedia = {
    provider: 'facebook',
    id: facebookMedia.id || '',
    type: 'image',
    created_time: moment(facebookMedia.created_time, facebookUtils.getFacebookDateFormat(), 'en').unix() || '',
    link: facebookMedia.link || '',
    likes: facebookMedia.likes.summary.total_count || 0,
    media_url: facebookMedia.images[0].source,
    text: facebookMedia.name || ''
    //user_has_liked: facebookMedia.favorited || false
  };

  callback(null, mappedMedia);
};