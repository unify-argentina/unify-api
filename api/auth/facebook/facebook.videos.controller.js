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
var fs = require('fs');
var logger = require('../../../config/logger');
var config = require('../../../config');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');

// constantes
var USER_VIDEOS_URL = facebookUtils.getBaseURL() + '/%s/videos?type=uploaded&fields=id,description,length,source,picture,created_time,likes.limit(0).summary(true),comments.limit(0).summary(true)&limit=%s&access_token=%s';
var USER_PUBLISH_VIDEO_URL = facebookUtils.getBasePublishVideoURL() + '/me/videos';

// Devuelve los videos del usuario pasado por parámetro
module.exports.getVideos = function(access_token, facebookId, callback) {

  var url = util.format(USER_VIDEOS_URL, facebookId, config.FACEBOOK_VIDEOS_MAX_MEDIA_COUNT, access_token);
  logger.info('URL: ' + url);

  request.get({ url: url, json: true }, function(err, response) {

    var result = facebookErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    else {
      // Si no hubo error, tenemos que mapear el response
      async.map(response.body.data,

        // Recibe un objeto de tipo video y devuelve uno homogéneo a las 3 redes sociales
        function(facebookMedia, callback) {

          var mappedMedia = {
            provider: 'facebook',
            id: facebookMedia.id || '',
            type: 'video',
            created_time: moment(facebookMedia.created_time, facebookUtils.getFacebookDateFormat(), 'en').unix() || '',
            link: facebookUtils.getFacebookURL() + facebookId + '_' + facebookMedia.id,
            likes: facebookMedia.likes.summary.total_count || 0,
            media_url: facebookMedia.source,
            text: facebookMedia.description || ''
          };

          callback(null, mappedMedia);
        },
        function(err, mappedMedia) {
          logger.debug('Media: ' + JSON.stringify(mappedMedia));
          callback(err, mappedMedia);
      });
    }
  });
};

// Publica el video en partes a Facebook hasta que termina
module.exports.publishVideo = function(access_token, text, file, callback) {

  callback(null);

  /*fs.stat(file.path, function(err, stats) {

    if (err) {
      callback(err);
    }
    else {

      var formData = {
        access_token: access_token,
        upload_phase: 'start',
        file_size: stats.size
      };

      var url = USER_PUBLISH_VIDEO_URL;
      logger.info('URL: ' + url + ' qs=' + formData);

      request.post({ url: url, form: formData, json: true }, function(err, response, body) {

        if (err) {
          callback(err);
        }
        else {
          fs.open(file.path, 'r', function(err, fd) {
            var bytesRead, data, offset = 0, bufferLength = 10000000;
            var buffer = new Buffer(bufferLength);

            bytesRead = fs.readSync(fd, buffer, body.start_offset, body.end_offset, null);
            data = bytesRead < bufferLength ? buffer.slice(0, bytesRead) : buffer;

            var formData = {
              video_file_chunk: '@' + new Buffer(data).toString('base64')
            };

            var qs = {
              access_token: access_token,
              upload_phase: 'transfer',
              start_offset: body.start_offset,
              upload_session_id: body.upload_session_id
            };

            request.post({ url: url, qs: qs, form: formData, json: true }, function(err, response, body) {
              callback(null);
            });
          });
        }
      });
    }
  });*/
};