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
var bignum = require('bignum');
var config = require('../../../config');
var logger = require('../../../config/logger');
var twitterUtils = require('./twitter.utils');
var twitterErrors = require('./twitter.errors');

// modelos
var Contact = require('../../contact/contact.model');

// Devuelve los tweets conteniendo sólo texto, foto o video del usuario pasado por parámetro
module.exports.getMedia = function(access_token, twitter, twitterId, callback) {

  var qs = {
    user_id: twitterId,
    count: config.TWITTER_MAX_MEDIA_COUNT
  };

  var lastTweetId = twitter.last_content_id;
  if (lastTweetId) {
    // https://dev.twitter.com/rest/public/timelines
    qs.max_id = bignum(lastTweetId).sub('1').toString();
  }

  var url = twitterUtils.getUserMediaURL();
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  request.get({ url: url, oauth: twitterUtils.getOauthParam(access_token), qs: qs, json: true }, function(err, response) {
    var result = twitterErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    // Si no hubo error, tenemos que mapear el response
    else {
      async.map(response.body, twitterUtils.mapMedia, function(err, mappedMedia) {
        logger.debug('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};

// Esta función hace un post con un like a un contenido de Twitter
module.exports.toggleLike = function(access_token, twitterMediaId, toggleLike, callback) {

  var qs = { id: twitterMediaId };
  var url = toggleLike ? twitterUtils.getUserFavURL() : twitterUtils.getUserUnfavURL();
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

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
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

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

  // Primero generamos una copia del archivo para que sea independiente a la original ya que
  // puede tener problemas al abrirlo si es que el controller de facebook también lo abre
  var copyFileName = file.path + '-twitter';
  fse.copySync(file.path, copyFileName);

  // Una vez que tenemos la copia, la abrimos
  var fd = fs.openSync(copyFileName, 'r');

  var bytesRead, data, bufferLength = 268435456;
  var buffer = new Buffer(1000000000);

  var startOffset = index * bufferLength;
  var length = startOffset + bufferLength > fileSize ? fileSize - startOffset : bufferLength;

  logger.debug('File size: ' + fileSize + ' startOffset: ' + startOffset + ' length: ' + length);

  // Leemos la cantidad de bytes especificada desde startOffset hasta length
  bytesRead = fs.readSync(fd, buffer, startOffset, length, null);

  // El completed nos va a servir para saber si se está transfiriendo la última parte o no
  var completed  = bytesRead < bufferLength;
  data = completed ? buffer.slice(0, bytesRead) : buffer;

  // Generamos un archivo con los datos leídos recientemente, y con un nombre de tipo archivooriginal-chunked-0
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

      // Una vez que tenemos el archivo escrito, lo subimos
      request.post({ url: twitterUtils.getUserUploadMediaURL(), oauth: twitterUtils.getOauthParam(access_token),
        formData: formData, json: true }, function (err, response) {
        // Si hubo error o la lectura del archivo se completó, volvemos al proceso inicial para finalizar la subida
        if (err) {
          callback(err);
        }
        else if (completed) {
          callback(null);
        }
        // Sino, debemos continuar leyendo el archivo, incrementando el índice de lectura
        else {
          transferProcess(index + 1, mediaId, file, fileSize, access_token, callback);
        }
      });
    }
  });
};