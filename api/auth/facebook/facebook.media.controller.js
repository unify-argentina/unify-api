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

// Se encarga de llamar a los módulos de fotos, videos y estados y luego devuelve los resultados
module.exports.getMedia = function(access_token, facebook, facebookId, callback) {

  async.parallel({
    uploadedPhotos: function(callback) {
      facebookPhotos.getPhotos(access_token, facebook, facebookId, true, callback);
    },
    taggedPhotos: function(callback) {
      facebookPhotos.getPhotos(access_token, facebook, facebookId, false, callback);
    },
    videos: function(callback) {
      facebookVideos.getVideos(access_token, facebook, facebookId, callback);
    },
    statuses: function(callback) {
      facebookStatuses.getStatuses(access_token, facebook, facebookId, callback);
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

    result.totalResults.push.apply(result.totalResults, photos);

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

    // Filtramos los contenidos duplicados dentro de Facebook, priorizando las fotos por sobre los estados
    // (Al estar primero las fotos y después los estados, si encuentra alguno duplicado se va a quedar con la foto)
    result.totalResults = _.uniq(result.totalResults, function(media) {
      return media.created_time;
    });

    callback(null, result);
  });
};

// Esta función hace un post con un like a un contenido de Facebook
module.exports.toggleLike = function(access_token, facebookMediaId, toggleLike, callback) {

  var qs = { access_token: access_token };

  var url = facebookUtils.getUserLikeURL(facebookMediaId);
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  if (toggleLike) {
    request.post({ url: url, qs: qs, json: true }, function(err, response) {
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
    request.del({ url: url, qs: qs, json: true }, function(err, response) {
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

// Publica el contenido a Facebook
module.exports.publishContent = function(access_token, file, text, callback) {

  // Si es solo texto, lo publicamos como un estado
  if (file) {
    // Video
    if (file.mimetype.indexOf('image') < 0) {
      facebookVideos.publishVideo(access_token, text, file);
      callback(null);
    }
    // Foto
    else {
      facebookPhotos.publishPhoto(access_token, text, file, function(err) {
        callback(err);
      });
    }
  }
  else {
    facebookStatuses.publishStatus(access_token, text, function(err) {
      callback(err);
    });
  }
};