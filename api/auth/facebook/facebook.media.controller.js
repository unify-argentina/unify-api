/*
 * Este módulo se encarga de obtener el contenido de Facebook
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var logger = require('../../../config/logger');
var _ = require('lodash');

var facebookPhotos = require('./facebook.photos.controller');
var facebookVideos = require('./facebook.videos.controller');
var facebookStatuses = require('./facebook.statuses.controller');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');

// constantes
var USER_LIKE_URL = facebookUtils.getBaseURL() + '/%s/likes?access_token=%s';

// Se encarga de llamar a los módulos de fotos, videos y estados y luego devuelve los resultados
module.exports.getMedia = function(access_token, facebookId, callback) {

  async.parallel({
    uploadedPhotos: function(callback) {
      facebookPhotos.getPhotos(access_token, facebookId, true, callback);
    },
    taggedPhotos: function(callback) {
      facebookPhotos.getPhotos(access_token, facebookId, false, callback);
    },
    videos: function(callback) {
      facebookVideos.getVideos(access_token, facebookId, callback);
    },
    statuses: function(callback) {
      facebookStatuses.getStatuses(access_token, facebookId, callback);
    }
  },

  function(err, mediaResults) {

    var result = {};
    result.totalResults = [];

    var photos = [];

    if (mediaResults.uploadedPhotos) {
      if (mediaResults.uploadedPhotos.constructor === Array) {
        photos.push.apply(photos, mediaResults.uploadedPhotos);
      }
      // Error en photos
      else {
        result.photos = mediaResults.uploadedPhotos;
      }
    }

    if (mediaResults.taggedPhotos) {
      if (mediaResults.taggedPhotos.constructor === Array) {
        photos.push.apply(photos, mediaResults.taggedPhotos);
      }
      // Error en photos
      else {
        result.photos = mediaResults.taggedPhotos;
      }
    }

    if (photos.length > 0) {
      var uniquePhotos = _.uniq(photos, function(photo) {
        return photo.id;
      });
      result.totalResults.push.apply(result.totalResults, uniquePhotos);
    }

    if (mediaResults.videos) {
      if (mediaResults.videos.constructor === Array) {
        result.totalResults.push.apply(result.totalResults, mediaResults.videos);
      }
      // Error en videos
      else {
        result.videos = mediaResults.videos;
      }
    }

    if (mediaResults.statuses) {
      if (mediaResults.statuses.constructor === Array) {
        result.totalResults.push.apply(result.totalResults, mediaResults.statuses);
      }
      // Error en statuses
      else {
        result.statuses = mediaResults.statuses;
      }
    }

    callback(null, result);
  });
};

// Esta función hace un post con un like a un contenido de Facebook
module.exports.toggleLike = function(access_token, facebookMediaId, toggleLike, callback) {

  var url = util.format(USER_LIKE_URL, facebookMediaId, access_token);
  logger.info('URL: ' + url);

  if (toggleLike) {
    request.post({url: url, json: true}, function (err, response) {
      var result = facebookErrors.hasError(err, response);
      if (result.hasError) {
        callback(result.error);
      }
      else {
        callback(null);
      }
    });
  }
  else {
    request.del({ url: url, json: true }, function(err, response) {
      var result = facebookErrors.hasError(err, response);
      if (result.hasError) {
        callback(result.error);
      }
      else {
        callback(null);
      }
    });
  }
};