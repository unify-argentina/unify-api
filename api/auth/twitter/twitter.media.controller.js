/*
 * Este módulo se encarga de obtener el contenido de Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var moment = require('moment');
var config = require('../../../config');
var logger = require('../../../config/logger');
var twitterOAuthHelper = require('./twitter.auth.helper');
var twitterErrors = require('./twitter.errors');

// modelos
var Contact = require('../../contact/contact.model');

// constantes
var USER_LIKE_URL = 'https://api.twitter.com/1.1/favorites/create.json?id=%s';
var USER_MEDIA_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
var TWITTER_DATE_FORMAT = 'dd MMM DD HH:mm:ss ZZ YYYY';
var TWITTER_STATUS_URL = 'https://twitter.com/statuses/';

// Devuelve los tweets conteniendo sólo texto, foto o video del usuario pasado por parámetro
module.exports.getMedia = function(access_token, twitterId, callback) {

  var qs = {
    //cursor: cursor,
    user_id: twitterId,
    count: 100
  };

  logger.info('URL: ' + USER_MEDIA_URL + 'qs=' + JSON.stringify(qs));
  request.get({ url: USER_MEDIA_URL, oauth: twitterOAuthHelper.getOauthParam(access_token), qs: qs, json: true }, function(err, response) {
    var result = twitterErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    // Si no hubo error, tenemos que mapear el response
    else {
      async.map(response.body, mapMedia, function(err, mappedMedia) {
        logger.debug('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};

var mapMedia = function(tweet, callback) {

  var mappedMedia = {
    provider: 'twitter',
    id: tweet.id_str || '',
    created_time: moment(tweet.created_at, TWITTER_DATE_FORMAT, 'en').unix() || '',
    link: TWITTER_STATUS_URL + tweet.id_str || '',
    likes: tweet.favorite_count,
    text: tweet.text,
    user_has_liked: tweet.favorited
  };

  if (tweet.extended_entities) {
    mapTweetMedia(mappedMedia, tweet.extended_entities.media[0]);
  }
  else {
    mappedMedia.type = 'text';
  }

  callback(null, mappedMedia);
};

// Mapea o una imagen o un video de Twitter al formato unificado
var mapTweetMedia = function(mappedMedia, tweetMedia) {

  var type = tweetMedia.type;
  if (type === 'video') {
    mapTweetVideo(mappedMedia, tweetMedia.video_info.variants);
  }
  else {
    mappedMedia.media_url = tweetMedia.media_url;
  }
  mappedMedia.type = type;
};

// Mapea un video de Twitter
var mapTweetVideo = function(mappedMedia, videoInfoArray) {

  videoInfoArray.forEach(function(videoInfo) {
    if (videoInfo.content_type === 'video/mp4') {
      mappedMedia.media_url = videoInfo.url;
    }
  });
};

// Esta función hace un post con un like a un contenido de Twitter
module.exports.postLike = function(access_token, twitterMediaId, callback) {

  var url = util.format(USER_LIKE_URL, twitterMediaId);
  logger.info('URL: ' + url);

  request.post({ url: url, oauth: twitterOAuthHelper.getOauthParam(access_token), json: true }, function(err, response) {
    var result = twitterErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error);
    }
    else {
      callback(null);
    }
  });
};