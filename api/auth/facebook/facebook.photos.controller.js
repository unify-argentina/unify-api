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
var fs = require('fs');
var logger = require('../../../config/logger');
var config = require('../../../config');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');

// Devuelve las fotos del usuario pasado por parámetro
module.exports.getPhotos = function(access_token, facebook, facebookId, uploaded, callback) {

  var qs = {
    fields: 'id,name,created_time,album,images,link,likes.limit(0).summary(true),comments.limit(0).summary(true)',
    limit: config.FACEBOOK_PHOTOS_MAX_MEDIA_COUNT,
    access_token: access_token
  };

  var lastPhoto = facebook.last_content_date_photo;
  if (lastPhoto) {
    qs.until = lastPhoto - 1;
  }

  if (uploaded) {
    qs.type = 'uploaded';
  }

  var url = util.format(facebookUtils.getUserPhotosURL(), facebookId);
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  request.get({ url: url, qs: qs, json: true }, function(err, response) {

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
  };

  callback(null, mappedMedia);
};

// Sube una foto a Facebook
module.exports.publishPhoto = function(access_token, text, file, callback) {

  var url = facebookUtils.getUserPublishPhotoURL();
  var qs = { access_token: access_token };
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  var formData = {
    caption: text ? text : '',
    source: fs.createReadStream(file.path)
  };

  request.post({ url: url, qs: qs, formData: formData, json: true }, function(err, response) {

    var result = facebookErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error);
    }
    else {
      callback(null);
    }
  });
};