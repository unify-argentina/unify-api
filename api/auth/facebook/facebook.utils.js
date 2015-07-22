/*
 * Dentro de este módulo hay utilidades de la API de Facebook
 * @author Joel Márquez
 * */
'use strict';

// Devuelve la URL Base de la API de Facebook
module.exports.getBaseURL = function() {
  return 'https://graph.facebook.com/v2.3';
};

// Devuelve la URL principal de Facebook
module.exports.getFacebookURL = function() {
  return 'https://www.facebook.com';
};

// Devuelve la url de la imagen del perfil del usuario con id = profileId
module.exports.getFacebookPicture = function(profileId) {
  return module.exports.getBaseURL() + '/' + profileId + '/picture?type=large';
};

// Devuelve el formato de fecha de Facebook
module.exports.getFacebookDateFormat = function() {
  return 'YYYY-MM-DD[T]HH:mm:ssZZ';
};