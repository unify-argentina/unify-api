/*
 * Este módulo se encarga de obtener el contenido de Instagram
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var logger = require('../../../config/logger');
var config = require('../../../config');
var instagramErrors = require('./instagram.errors');
var instagramUtils = require('./instagram.utils');

// modelos
var Contact = require('../../contact/contact.model');

// constantes
var USER_LIKE_URL = 'https://api.instagram.com/v1/media/%s/likes/?access_token=%s';
var MEDIA_URL = 'https://api.instagram.com/v1/media/%s?access_token=%s';

// Devuelve las fotos y los videos del usuario pasado por parámetro
module.exports.getMedia = function(access_token, instagram, instagramId, callback) {

  var qs = {
    count: config.INSTAGRAM_MAX_MEDIA_COUNT,
    access_token: access_token
  };

  var lastMedia = instagram.last_content_date;
  if (lastMedia) {
    qs.max_timestamp = lastMedia;
  }

  var url = util.format(instagramUtils.getUserMediaURL(), instagramId);
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  request.get({ url: url, qs: qs, json: true }, function(err, response) {

    var result = instagramErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    else {
      // Si no hubo error, tenemos que mapear el response
      async.map(response.body.data, mapMedia, function(err, mappedMedia) {
        logger.debug('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};

// Recibe un objeto de media de Instagram y devuelve uno homogéneo a las 3 redes sociales
var mapMedia = function(instagramMedia, callback) {
  if (instagramMedia.type === 'video') {
    mapVideo(instagramMedia, function(err, mappedVideo) {
      callback(err, mappedVideo);
    });
  }
  else {
    mapImage(instagramMedia, function(mappedImage) {
      callback(null, mappedImage);
    });
  }
};

// Recibe un objeto de tipo video, pide la URL y devuelve uno homogéneo a las 3 redes sociales
var mapVideo = function(instagramVideo, callback) {
  // Si la url del video vino en el data, mapeamos de una
  if (instagramVideo.videos.standard_resolution) {
    callback(null, doMapVideo(instagramVideo, instagramVideo.videos.standard_resolution.url));
  }
  else {
    callback(null, doMapVideo(instagramVideo, ''));
  }
};

// Mapea efectivamente el video
var doMapVideo = function(instagramVideo, videoURL) {
  return {
    provider: 'instagram',
    id: instagramVideo.id + '' || '',
    type: instagramVideo.type || '',
    created_time: parseInt(instagramVideo.created_time) || '',
    link: instagramVideo.link || '',
    likes: instagramVideo.likes.count || '',
    media_url: videoURL,
    text: instagramVideo.caption ? instagramVideo.caption.text : '',
    user_has_liked: instagramVideo.user_has_liked || ''
  };
};

// Recibe un objeto de tipo imagen y devuelve uno homogéneo a las 3 redes sociales
var mapImage = function(instagramImage, callback) {
  var image = {
    provider: 'instagram',
    id: instagramImage.id + '' || '',
    type: instagramImage.type || '',
    created_time: parseInt(instagramImage.created_time) || '',
    link: instagramImage.link || '',
    likes: instagramImage.likes.count || '',
    media_url: instagramImage.images.standard_resolution.url,
    text: instagramImage.caption ? instagramImage.caption.text : '',
    user_has_liked: instagramImage.user_has_liked || ''
  };
  callback(image);
};

// Esta función hace un post con un like a un contenido de Instagram
module.exports.toggleLike = function(access_token, instagramMediaId, toggleLike, callback) {

  var url = util.format(USER_LIKE_URL, instagramMediaId, access_token);
  logger.info('URL: ' + url);

  if (toggleLike) {
    request.post({ url: url, json: true }, function(err, response) {
      var result = instagramErrors.hasError(err, response);
      if (result.hasError) {
        callback(result.error);
      }
      else {
        callback(null);
      }
    });
  }
  else {
    request.del({ url: url, json: true }, function(err, response) {
      var result = instagramErrors.hasError(err, response);
      if (result.hasError) {
        callback(result.error);
      }
      else {
        callback(null);
      }
    });
  }
};

