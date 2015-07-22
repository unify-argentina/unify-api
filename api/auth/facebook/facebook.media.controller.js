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

module.exports.getMedia = function(accessToken, facebookId, callback) {

  async.parallel({
    photos: function(callback) {
      facebookPhotos.getPhotos(accessToken, facebookId, callback);
    },

    videos: function(callback) {
      facebookVideos.getVideos(accessToken, facebookId, callback);
    },

    statuses: function(callback) {
      facebookStatuses.getStatuses(accessToken, facebookId, callback);
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