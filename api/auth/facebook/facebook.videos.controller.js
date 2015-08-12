/*
 * Este módulo se encarga de obtener los videos de Facebook
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
var USER_VIDEOS_URL = facebookUtils.getBaseURL() + '/%s/videos?type=uploaded&fields=id,description,length,source,picture,created_time,likes.limit(0).summary(true),comments.limit(0).summary(true)&access_token=%s';

module.exports.getVideos = function(access_token, facebookId, callback) {

  var url = util.format(USER_VIDEOS_URL, facebookId, access_token);
  logger.info('URL: ' + url);

  request.get({ url: url, json: true }, function(err, response) {
    if (err) {
      callback(err, null);
    }
    else {
      // Si no hubo error, tenemos que mapear el response
      async.map(response.body.data, mapVideo, function(err, mappedMedia) {
        logger.info('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};

// Recibe un objeto de tipo video y devuelve uno homogéneo a las 3 redes sociales
var mapVideo = function(facebookMedia, callback) {

  var mappedMedia = {
    provider: 'facebook',
    id: facebookMedia.id || '',
    type: 'video',
    created_time: moment(facebookMedia.created_time, facebookUtils.getFacebookDateFormat(), 'en').unix() || '',
    link: facebookMedia.permalink_url ? facebookUtils.getFacebookURL() + facebookMedia.permalink_url : '',
    likes: facebookMedia.likes.summary.total_count || 0,
    media_url: facebookMedia.source,
    text: facebookMedia.description || ''
    //user_has_liked: facebookMedia.favorited || false
  };

  callback(null, mappedMedia);
};