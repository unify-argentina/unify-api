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

var facebookPhotos = require('./facebook.photos.controller');
var facebookVideos = require('./facebook.videos.controller');
var facebookStatuses = require('./facebook.statuses.controller');

// Se encarga de llamar a los módulos de fotos, videos y estados y luego devuelve los resultados
module.exports.getMedia = function(access_token, facebookId, callback) {

  async.parallel({
    photos: function(callback) {
      facebookPhotos.getPhotos(access_token, facebookId, callback);
    },

    videos: function(callback) {
      facebookVideos.getVideos(access_token, facebookId, callback);
    },

    statuses: function(callback) {
      facebookStatuses.getStatuses(access_token, facebookId, callback);
    }
  },

  function(err, results) {
    var totalResults = [];
    totalResults.push.apply(totalResults, results.photos);
    totalResults.push.apply(totalResults, results.videos);
    totalResults.push.apply(totalResults, results.statuses);
    callback(null, totalResults);
  });
};