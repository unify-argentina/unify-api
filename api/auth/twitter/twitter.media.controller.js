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
var fse = require('fs-extra');
var config = require('../../../config');
var logger = require('../../../config/logger');
var twitterUtils = require('./twitter.utils');
var twitterErrors = require('./twitter.errors');

// modelos
var Contact = require('../../contact/contact.model');

// Devuelve los tweets conteniendo sólo texto, foto o video del usuario pasado por parámetro
module.exports.getMedia = function(access_token, twitterId, callback) {

  var qs = {
    user_id: twitterId,
    count: config.TWITTER_MAX_MEDIA_COUNT
  };
  var url = twitterUtils.getUserMediaURL();
  logger.info('URL: ' + url + 'qs=' + JSON.stringify(qs));

  request.get({ url: url, oauth: twitterUtils.getOauthParam(access_token), qs: qs, json: true }, function(err, response) {
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
    created_time: moment(tweet.created_at, twitterUtils.getDateFormat(), 'en').unix() || '',
    link: twitterUtils.getTwitterStatusURL() + tweet.id_str || '',
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

  var qs = { id: twitterMediaId };
  var url = toggleLike ? twitterUtils.getUserFavURL() : twitterUtils.getUserUnfavURL();
  logger.info('URL: ' + url + 'qs=' + JSON.stringify(qs));

  request.post({ url: url, oauth: twitterUtils.getOauthParam(access_token), qs: qs, json: true }, function(err, response) {

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
      doPublishVideoTweet(access_token, text, file);
      callback(null);
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

  var qs = {};
  if (text) {
    qs.status = text;
  }
  if (mediaId) {
    qs.media_ids = mediaId;
  }
  var url = twitterUtils.getUserPublishContentURL();
  logger.info('URL: ' + url + 'qs=' + JSON.stringify(qs));

  request.post({ url: url, oauth: twitterUtils.getOauthParam(access_token), qs: qs, json: true }, function(err, response) {

    var result = twitterErrors.hasError(err, response);
    if (result.hasError) {
      if (callback) {
        callback(result.error);
      }
    }
    else if (callback) {
      callback(null);
    }
  });
};

// Primero sube la foto y luego publica el tweet con ese media id
var doPublishPhotoTweet = function(access_token, text, file, callback) {

  var url = twitterUtils.getUserUploadMediaURL();
  logger.info('URL: ' + url);

  var rawFile = fs.createReadStream(file.path);

  var formData = {
    media: rawFile
  };

  var oauth = twitterUtils.getOauthParam(access_token);

  request.post({ url: url, formData: formData, oauth: oauth, json: true }, function(err, response) {

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
var doPublishVideoTweet = function(access_token, text, file) {

  var stats = fs.statSync(file.path);

  var formData = {
    command: 'INIT',
    media_type: file.mimetype,
    total_bytes: stats.size
  };

  logger.info('URL: ' + twitterUtils.getUserUploadMediaURL());
  logger.debug('Twitter form data: ' + JSON.stringify(formData));

  // Primer paso, enviamos el tamaño del video
  request.post({ url: twitterUtils.getUserUploadMediaURL(), oauth: twitterUtils.getOauthParam(access_token),
    form: formData, json: true }, function(err, response, body) {
    if (!err) {
      // Con lo que nos responde, comenzamos a hacer la transferencia del video
      transferProcess(0, body.media_id_string, file, stats.size, access_token, function(err) {
        if (!err) {

          var formData = {
            command: 'FINALIZE',
            media_id: body.media_id_string
          };

          logger.debug('Twitter form data: ' + JSON.stringify(formData));

          // Una vez que terminó la transferencia, publicamos el video
          request.post({ url: twitterUtils.getUserUploadMediaURL(), oauth: twitterUtils.getOauthParam(access_token),
            form: formData, json: true }, function(err, response, body) {
            if (!err && !body.error) {
              doPublishTweet(access_token, text, body.media_id_string, null);
            }
          });
        }
      });
    }
  });
};

// Va procesando cada parte del video a subir hasta que termina
var transferProcess = function(index, mediaId, file, fileSize, access_token, callback) {

  var copyFileName = file.path + '-twitter';
  fse.copySync(file.path, copyFileName);

  var fd = fs.openSync(copyFileName, 'r');

  var bytesRead, data, bufferLength = 268435456;
  var buffer = new Buffer(1000000000);

  var startOffset = index * bufferLength;
  var length = startOffset + bufferLength > fileSize ? fileSize - startOffset : bufferLength;

  logger.debug('File size: ' + fileSize + ' startOffset: ' + startOffset + ' length: ' + length);

  bytesRead = fs.readSync(fd, buffer, startOffset, length, null);
  var completed  = bytesRead < bufferLength;
  data = completed ? buffer.slice(0, bytesRead) : buffer;

  var chunkFileName = copyFileName + '-chunked-' + index;
  logger.debug('Uploading chunk: ' + chunkFileName);

  // Creamos el archivo para luego leerlo y enviarlo
  fs.writeFile(chunkFileName, data, function(err) {
    if (err) {
      callback(err);
    }
    else {

      var formData = {
        command: 'APPEND',
        media_id: mediaId,
        segment_index: index
      };

      logger.debug('Twitter form data: ' + JSON.stringify(formData));

      formData.media = fs.createReadStream(chunkFileName);

      request.post({ url: twitterUtils.getUserUploadMediaURL(), oauth: twitterUtils.getOauthParam(access_token),
        formData: formData, json: true }, function (err, response) {
        if (err) {
          callback(err);
        }
        else if (completed) {
          callback(null);
        }
        else {
          transferProcess(index + 1, mediaId, file, fileSize, access_token, callback);
        }
      });
    }
  });
};