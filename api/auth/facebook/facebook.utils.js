/*
 * Dentro de este módulo hay utilidades de la API de Facebook
 * @author Joel Márquez
 * */
'use strict';

var util = require('util');

// Devuelve la versión actual soportada de la API de Facebook
module.exports.getVersion = function() {
  return 'v2.3';
};

// Devuelve la URL Base de la API de Facebook
module.exports.getBaseURL = function() {
  return 'https://graph.facebook.com/' + this.getVersion();
};

// Devuelve la URL principal de Facebook
module.exports.getFacebookURL = function() {
  return 'https://www.facebook.com/';
};

// Devuelve la URL de OAuth de Facebook
module.exports.getOauthURL = function() {
  return this.getBaseURL() + '/oauth/access_token';
};

// Devuelve la URL del perfil del usuario de Facebook
module.exports.getUserProfileURL = function() {
  return this.getBaseURL() + '/me';
};

// Devuelve la URL de la imagen del perfil del usuario con id = profileId
module.exports.getFacebookPicture = function(profileId) {
  return module.exports.getBaseURL() + '/' + profileId + '/picture?type=large';
};

// Devuelve el formato de fecha de Facebook
module.exports.getFacebookDateFormat = function() {
  return 'YYYY-MM-DD[T]HH:mm:ssZZ';
};

// Devuelve la URL para obtener las fotos de Facebook
module.exports.getUserPhotosURL = function(facebookId) {
  return util.format(this.getBaseURL() + '/%s/photos', facebookId);
};

// Devuelve la URL para obtener los videos de Facebook
module.exports.getUserVideosURL = function(facebookId) {
  return util.format(this.getBaseURL() + '/%s/videos', facebookId);
};

// Devuelve la URL para obtener los estados de Facebook
module.exports.getUserStatusesURL = function(facebookId) {
  return util.format(this.getBaseURL() + '/%s/statuses', facebookId);
};

// Devuelve la URL de la API para publicar fotos de Facebook
module.exports.getUserPublishPhotoURL = function() {
  return this.getBaseURL() + '/me/photos';
};

// Devuelve la URL de la API para publicar videos de Facebook
module.exports.getUserPublishVideoURL = function() {
  return 'https://graph-video.facebook.com/' + this.getVersion() + '/me/videos';
};

// Devuelve la URL de la API para publicar estados de Facebook
module.exports.getUserPublishStatusesURL = function() {
  return this.getBaseURL() + '/me/feed';
};

// Devuelve la URL de la API para dar likes de Facebook
module.exports.getUserLikeURL = function(facebookId) {
  return util.format(this.getBaseURL() + '/%s/likes', facebookId);
};

// Devuelve la URL de la API para obtener los likes de un usuario de Facebook
module.exports.getUserLikesURL = function(facebookId) {
  return util.format(this.getBaseURL() + '/%s/likes', facebookId);
};

// Devuelve la URL de la API para obtener los amigos de un usuario de Facebook
module.exports.getUserFriendsURL = function(facebookId) {
  return util.format(this.getBaseURL() + '/%s/friends', facebookId);
};