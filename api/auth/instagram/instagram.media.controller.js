/*
 * Este módulo se encarga de obtener el contenido de Instagram
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var logger = require('../../../config/logger');
var config = require('../../../config');
var instagramErrors = require('./instagram.errors');
var instagramUtils = require('./instagram.utils');

// modelos
var Contact = require('../../contact/contact.model');

// Devuelve las fotos y los videos del usuario pasado por parámetro
module.exports.getMedia = function(access_token, instagram, instagramId, callback) {

  var qs = {
    count: config.INSTAGRAM_MAX_MEDIA_COUNT,
    access_token: access_token
  };

  var lastMedia = instagram.last_content_date;
  if (lastMedia) {
    qs.max_timestamp = lastMedia;
  }

  var url = instagramUtils.getUserMediaURL(instagramId);
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  request.get({ url: url, qs: qs, json: true }, function(err, response) {

    var result = instagramErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    else {
      // Si no hubo error, tenemos que mapear el response
      async.map(response.body.data, instagramUtils.mapMedia, function(err, mappedMedia) {
        logger.debug('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};

// Esta función hace un post con un like a un contenido de Instagram
module.exports.toggleLike = function(access_token, instagramMediaId, toggleLike, callback) {

  var qs = {
    access_token: access_token
  };

  var url = instagramUtils.getUserLikeURL(instagramMediaId);
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  if (toggleLike) {
    request.post({ url: url, qs: qs, json: true }, function(err, response) {
      var result = instagramErrors.hasError(err, response);
      if (result.hasError) {
        callback(result.error);
      }
      else {
        callback(null);
      }
    });
  }
  else {
    request.del({ url: url, qs: qs, json: true }, function(err, response) {
      var result = instagramErrors.hasError(err, response);
      if (result.hasError) {
        callback(result.error);
      }
      else {
        callback(null);
      }
    });
  }
};

