/*
 * Este módulo se encarga de obtener los videos de Facebook
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var async = require('async');
var moment = require('moment');
var fs = require('fs');
var logger = require('../../../config/logger');
var config = require('../../../config');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');
var request = require('request');

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

  var stats = fs.statSync(file.path);

  var formData = {
    access_token: access_token,
    upload_phase: 'start',
    file_size: stats.size
  };

  logger.info('URL: ' + USER_PUBLISH_VIDEO_URL);

  // Primer paso, enviamos el tamaño del video
  request.post({ url: USER_PUBLISH_VIDEO_URL, form: formData, json: true }, function(err, response, body) {
    if (err) {
      callback(err);
    }
    else {
      // Con lo que nos responde, comenzamos a hacer la transferencia del video
      transferProcess(undefined, file, access_token, body, function(err, currentUploadSession) {
        if (err) {
          callback(err);
        }
        else {

          var formData = {
            access_token: access_token,
            upload_phase: 'finish',
            upload_session_id: currentUploadSession,
            description: text
          };

          // Una vez que terminó la transferencia, publicamos el video
          request.post({ url: USER_PUBLISH_VIDEO_URL, form: formData, json: true }, function(err, response, body) {
            if (err || body.error) {
              callback(err ? err : body.error);
            }
            else {
              callback(null);
            }
          });
        }
      });
    }
  });
};

// Va procesando cada parte del video a subir hasta que termina
var transferProcess = function(uploadSession, file, access_token, body, callback) {

  var fd = fs.openSync(file.path, 'r');

  var bytesRead, data, bufferLength = 1000000000;
  var buffer = new Buffer(bufferLength);

  var offset = body.end_offset - body.start_offset;
  logger.debug('Start offset: ' + body.start_offset + ' End offset: ' + body.end_offset + ' Offset: ' + offset);

  bytesRead = fs.readSync(fd, buffer, body.start_offset, offset, null);
  data = bytesRead < bufferLength ? buffer.slice(0, bytesRead) : buffer;

  var parts = file.originalname.split('.');
  var chunkFileName = file.destination + '/' + parts[0] + '-chunked-' + body.start_offset + '.' + parts[1];
  logger.debug('Uploading chunk: ' + chunkFileName);

  // Creamos el archivo para luego leerlo y enviarlo
  fs.writeFile(chunkFileName, data, function(err) {
    if (err) {
      callback(err);
    }
    else {

      var currentUploadSession = uploadSession ? uploadSession : body.upload_session_id;
      var startOffset = parseInt(body.start_offset);

      var formData = {
        upload_phase: 'transfer',
        start_offset: startOffset,
        upload_session_id: currentUploadSession,
        access_token: access_token
      };

      logger.debug('Form data: ' + JSON.stringify(formData));

      formData.video_file_chunk = fs.createReadStream(chunkFileName);

      request.post({ url: USER_PUBLISH_VIDEO_URL, formData: formData, json: true }, function (err, response, body) {
        if (err || body.error) {
          callback(err ? err : body.error, null);
        }
        else if (body.start_offset === body.end_offset) {
          callback(err, currentUploadSession);
        }
        else {
          transferProcess(currentUploadSession, file, access_token, body, callback);
        }
      });
    }
  });
};