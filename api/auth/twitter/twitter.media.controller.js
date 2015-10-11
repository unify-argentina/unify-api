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
var fs = require('fs');
var qs = require('querystring');
var config = require('../../../config');
var logger = require('../../../config/logger');
var twitterOAuthHelper = require('./twitter.auth.helper');
var twitterErrors = require('./twitter.errors');

// modelos
var Contact = require('../../contact/contact.model');

// constantes
var USER_FAV_URL = 'https://api.twitter.com/1.1/favorites/create.json?id=%s';
var USER_UNFAV_URL = 'https://api.twitter.com/1.1/favorites/destroy.json?id=%s';
var USER_MEDIA_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
var USER_PUBLISH_CONTENT_URL = 'https://api.twitter.com/1.1/statuses/update.json?%s';
var USER_UPLOAD_MEDIA_URL = 'https://upload.twitter.com/1.1/media/upload.json';

var TWITTER_DATE_FORMAT = 'dd MMM DD HH:mm:ss ZZ YYYY';
var TWITTER_STATUS_URL = 'https://twitter.com/statuses/';

// Devuelve los tweets conteniendo sólo texto, foto o video del usuario pasado por parámetro
module.exports.getMedia = function(access_token, twitterId, callback) {

  var qs = {
    //cursor: cursor,
    user_id: twitterId,
    count: config.TWITTER_MAX_MEDIA_COUNT
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

  // Si es un retweet, tenemos que agarrar el texto original del tweet porque puede llegar a truncarse
  var text = '';
  if (tweet.retweeted_status) {
    var retweet = tweet.retweeted_status;
    text = 'RT @' + retweet.user.screen_name + ': ' + retweet.text;
  }
  else {
    text = tweet.text;
  }

  var mappedMedia = {
    provider: 'twitter',
    id: tweet.id_str || '',
    created_time: moment(tweet.created_at, TWITTER_DATE_FORMAT, 'en').unix() || '',
    link: TWITTER_STATUS_URL + tweet.id_str || '',
    likes: tweet.favorite_count,
    text: text,
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
module.exports.toggleLike = function(access_token, twitterMediaId, toggleLike, callback) {

  var url = util.format(toggleLike ? USER_FAV_URL : USER_UNFAV_URL, twitterMediaId);
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

// Publica un Tweet
module.exports.publishContent = function(access_token, file, text, callback) {

  // Si es solo texto, lo publicamos como un tweet sólo con texto
  if (file) {
    // Video
    if (file.mimetype.indexOf('image') < 0) {
      doPublishVideoTweet(access_token, text, file, function(err) {
        callback(err);
      });
    }
    // Foto
    else {
      doPublishPhotoTweet(access_token, text, file, function(err) {
        callback(err);
      });
    }
  }
  else {
    doPublishTweet(access_token, text, undefined, function(err) {
      callback(err);
    });
  }
};

// Pubica el tweet a Twitter
var doPublishTweet = function(access_token, text, mediaId, callback) {

  var query = {};
  if (text) {
    query.status = text;
  }
  if (mediaId) {
    query.media_ids = mediaId;
  }
  var url = util.format(USER_PUBLISH_CONTENT_URL, qs.stringify(query));
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

// Primero sube la foto y luego publica el tweet con ese media id
var doPublishPhotoTweet = function(access_token, text, file, callback) {

  var url = USER_UPLOAD_MEDIA_URL;
  logger.info('URL: ' + url);

  var rawFile = fs.createReadStream(file.path);

  var formData = {
    media_data: new Buffer(rawFile).toString('base64'),
    media: rawFile
  };

  request.post({ url: url, formData: formData, oauth: twitterOAuthHelper.getOauthParam(access_token), json: true }, function(err, response) {

    var result = twitterErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error);
    }
    else {
      doPublishTweet(access_token, text, response.body.media_id_string, function(err) {
        callback(err);
      });
    }
  });
};

// Primero sube el video y luego publica el tweet con ese media id
var doPublishVideoTweet = function(access_token, text, file, callback) {
  callback(null);
};