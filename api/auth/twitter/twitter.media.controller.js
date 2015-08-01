/*
 * Este módulo se encarga de obtener el contenido de Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var config = require('../../../config');
var logger = require('../../../config/logger');
var twitterOAuthHelper = require('./twitter.auth.helper');
var moment = require('moment');

// modelos
var Contact = require('../../contact/contact.model');

// constantes
var USER_MEDIA_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
var TWITTER_DATE_FORMAT = 'dd MMM DD HH:mm:ss ZZ YYYY';
var TWITTER_STATUS_URL = 'https://twitter.com/statuses/';

module.exports.getMedia = function(access_token, twitterId, callback) {

  var qs = {
    //cursor: cursor,
    user_id: twitterId,
    // La cantidad máxima de usuarios por request permitida por la API de Twitter
    // https://dev.twitter.com/rest/reference/get/statuses/user_timeline
    count: 50
  };

  logger.debug('URL: ' + USER_MEDIA_URL + 'qs=' + JSON.stringify(qs));
  request.get({ url: USER_MEDIA_URL, oauth: twitterOAuthHelper.getOauthParam(access_token), qs: qs, json: true }, function(err, response) {
    if (err) {
      callback(err, null);
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
  var type = 'text';
  var hasMedia = tweet.entities.media !== undefined;
  if (hasMedia) {
    type = tweet.entities.media.type === 'photo' ? 'image' : 'video';
  }

  var mappedMedia = {
    provider: 'twitter',
    id: tweet.id_str || '',
    type: type,
    created_time: moment(tweet.created_at, TWITTER_DATE_FORMAT, 'en').unix() || '',
    link: TWITTER_STATUS_URL + tweet.id_str || '',
    likes: tweet.favorite_count || 0,
    text: tweet.text || '',
    user_has_liked: tweet.favorited || false
  };

  if (hasMedia) {
    mappedMedia.media_url = tweet.entities.media.media_url;
  }

  callback(null, mappedMedia);
};