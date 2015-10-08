/*
 * Dentro de este módulo hay utilidades de la API de Facebook
 * @author Joel Márquez
 * */
'use strict';

// Devuelve la versión actual soportada de la API de Facebook
module.exports.getVersion = function() {
  return 'v2.3';
};

// Devuelve la URL Base de la API de Facebook
module.exports.getBaseURL = function() {
  return 'https://graph.facebook.com/' + this.getVersion();
};

// Devuelve la URL Base de la API para subir videos de Facebook
module.exports.getBasePublishVideoURL = function() {
  return 'https://graph-video.facebook.com/' + this.getVersion();
};

// Devuelve la URL principal de Facebook
module.exports.getFacebookURL = function() {
  return 'https://www.facebook.com/';
};

// Devuelve la url de la imagen del perfil del usuario con id = profileId
module.exports.getFacebookPicture = function(profileId) {
  return module.exports.getBaseURL() + '/' + profileId + '/picture?type=large';
};

// Devuelve el formato de fecha de Facebook
module.exports.getFacebookDateFormat = function() {
  return 'YYYY-MM-DD[T]HH:mm:ssZZ';
};