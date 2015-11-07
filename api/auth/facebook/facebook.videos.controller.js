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
var fse = require('fs-extra');
var logger = require('../../../config/logger');
var config = require('../../../config');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');
var request = require('request');

// Devuelve los videos del usuario pasado por parámetro
module.exports.getVideos = function(access_token, facebook, facebookId, callback) {

  var qs = {
    type: 'uploaded',
    fields: 'id,description,length,source,picture,created_time,likes.limit(0).summary(true),comments.limit(0).summary(true)',
    limit: config.FACEBOOK_VIDEOS_MAX_MEDIA_COUNT,
    access_token: access_token
  };

  var lastVideo = facebook.last_content_date_video;
  if (lastVideo) {
    qs.until = lastVideo - 1;
  }

  var url = util.format(facebookUtils.getUserVideosURL(), facebookId);
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  request.get({ url: url, qs: qs, json: true }, function(err, response) {

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
module.exports.publishVideo = function(access_token, text, file) {

  var stats = fs.statSync(file.path);

  var formData = {
    access_token: access_token,
    upload_phase: 'start',
    file_size: stats.size
  };

  var url = facebookUtils.getUserPublishVideoURL();
  logger.info('URL: ' + url);
  logger.debug('Facebook form data: ' + JSON.stringify(formData));

  // Primer paso, enviamos el tamaño del video
  request.post({ url: url, form: formData, json: true }, function(err, response, body) {
    if (!err) {
      // Con lo que nos responde, comenzamos a hacer la transferencia del video
      transferProcess(undefined, file, access_token, body, function(err, currentUploadSession) {
        if (!err) {

          var formData = {
            access_token: access_token,
            upload_phase: 'finish',
            upload_session_id: currentUploadSession,
            description: text
          };

          logger.debug('Facebook form data: ' + JSON.stringify(formData));

          // Una vez que terminó la transferencia, publicamos el video
          request.post({ url: url, form: formData, json: true });
        }
      });
    }
  });
};

// Va procesando cada parte del video a subir hasta que termina
var transferProcess = function(uploadSession, file, access_token, body, callback) {

  // Primero generamos una copia del archivo para que sea independiente a la original ya que
  // puede tener problemas al abrirlo si es que el controller de twitter también lo abre
  var copyFileName = file.path + '-facebook';
  fse.copySync(file.path, copyFileName);

  // Una vez que tenemos la copia, la abrimos
  var fd = fs.openSync(copyFileName, 'r');

  var bytesRead, data, bufferLength = 1000000000;
  var buffer = new Buffer(bufferLength);

  var length = body.end_offset - body.start_offset;
  logger.debug('Start offset: ' + body.start_offset + ' End offset: ' + body.end_offset + ' Length: ' + length);

  // Leemos la cantidad de bytes especificada desde body.start_offset hasta length
  bytesRead = fs.readSync(fd, buffer, body.start_offset, length, null);
  data = bytesRead < bufferLength ? buffer.slice(0, bytesRead) : buffer;

  // Generamos un archivo con los datos leídos recientemente, y con un nombre de tipo archivooriginal-chunked-12313123
  var chunkFileName = copyFileName + '-chunked-' + body.start_offset;
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

      logger.debug('Facebook form data: ' + JSON.stringify(formData));

      formData.video_file_chunk = fs.createReadStream(chunkFileName);

      // Una vez que tenemos el archivo escrito, lo subimos
      request.post({ url: facebookUtils.getUserPublishVideoURL(), formData: formData, json: true }, function (err, response, body) {
        // Si hubo error, devolvemos enviándolo
        if (err || body.error) {
          callback(err ? err : body.error, null);
        }
        // Si la lectura del archivo se completó, facebook nos va a enviar el body.start_offset igual que el body.end_offset,
        // si es así ya terminamos de subir todas las partes del archivo por ende volvemos
        else if (body.start_offset === body.end_offset) {
          callback(err, currentUploadSession);
        }
        // Sino, debemos continuar leyendo el archivo
        else {
          transferProcess(currentUploadSession, file, access_token, body, callback);
        }
      });
    }
  });
};