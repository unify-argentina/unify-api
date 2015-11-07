/*
 * Dentro de este módulo hay utilidades de la API de Instagram
 * @author Joel Márquez
 * */
'use strict';

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
module.exports.getUserMediaURL = function() {
  return this.getBaseURL() + '/users/%s/media/recent';
};

// Devuelve la URL para obtener los seguidores de Instagram
module.exports.getUserFollowsURL = function() {
  return this.getBaseURL() + '/users/%s/follows';
};