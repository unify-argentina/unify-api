/*
 * Este módulo se encarga de manejar los amigos de Facebook del usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');

// constantes
var GRAPH_FRIENDS_URL = 'https://graph.facebook.com/v2.3/%s/friends?access_token=%s';

// Devuelve los amigos de Facebook del usuario loggeado
module.exports.getFriends = function (accessToken, facebookId, callback) {
  // TODO chequear que si viene un paging, se haga
  // Le pega a la API de Facebook y en el response, si fue exitoso, van a estar los amigos
  request.get(util.format(GRAPH_FRIENDS_URL, facebookId, accessToken), function(err, response) {
    // Parseamos el body para tener un JSON, y después lo mapeamos para que sea homogéneo
    // a las 3 redes sociales
    async.map(JSON.parse(response.body).data, mapUser, function(err, results) {
      callback(err, results);
    });
  });
};

// Recibe un objeto de usuario de Facebook y devuelve uno homogéneo a las 3 redes sociales
var mapUser = function(facebookUser, callback) {
  var user = {
    id: facebookUser.id,
    name: facebookUser.name,
    picture: getFacebookPicture(facebookUser.id)
  };
  callback(null, user);
};

// Devuelve la url de la imagen del perfil del usuario con id = profileId
var getFacebookPicture = function(profileId) {
  return 'https://graph.facebook.com/v2.3/' + profileId + '/picture?type=large';
};