/*
 * Dentro de este módulo hay utilidades de la API de Instagram
 * @author Joel Márquez
 * */
'use strict';

var util = require('util');

// Devuelve la versión actual soportada de la API de Instagram
module.exports.getVersion = function() {
  return 'v1';
};

module.exports.getAPIBaseURL = function() {
  return 'https://api.instagram.com';
};

// Devuelve la URL Base de la API de Instagram
module.exports.getBaseURL = function() {
  return this.getAPIBaseURL() + '/' + this.getVersion();
};

// Devuelve la URL de OAuth de Instagram
module.exports.getOauthURL = function() {
  return this.getAPIBaseURL() + '/oauth/access_token';
};

// Devuelve la URL para obtener el contenido de Instagram
module.exports.getUserMediaURL = function(instagramId) {
  return util.format(this.getBaseURL() + '/users/%s/media/recent', instagramId);
};

// Devuelve la URL para obtener los seguidores de Instagram
module.exports.getUserFollowsURL = function(instagramId) {
  return util.format(this.getBaseURL() + '/users/%s/follows', instagramId);
};

// Devuelve la URL para dar o quitar likes a un contenido de Instagram
module.exports.getUserLikeURL = function(instagramId) {
  return util.format(this.getBaseURL() + '/media/%s/likes', instagramId);
};

// Devuelve la URL para dar o quitar likes a un contenido de Instagram
module.exports.getSearchURL = function(tag) {
  return util.format(this.getBaseURL() + '/tags/%s/media/recent', tag);
};

// Recibe un objeto de media de Instagram y devuelve uno homogéneo a las 3 redes sociales
module.exports.mapMedia = function(instagramMedia, callback) {
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