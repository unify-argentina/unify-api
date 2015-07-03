/*
 * Este módulo se encarga de manejar las personas a las que sigue en Instagram el usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');

// Devuelve las personas a las que sigue en Instagram el usuario loggeado
module.exports.getFriends = function(accessToken, instagramId, callback) {

  var url = util.format('https://api.instagram.com/v1/users/%s/follows', instagramId),
      qs = { access_token: accessToken };

  // TODO chequear que si viene un paging, se haga
  // Le pega a la API de Instagram y en el response, si fue exitoso, van a estar las personas a las que sigue
  request.get({ url: url, qs: qs, json: true }, function(err, response) {
    // Parseamos el body para tener un JSON, y después lo mapeamos para que sea homogéneo
    // a las 3 redes sociales
    async.map(response.body.data, mapUser, function(err, results) {
      callback(err, results);
    });
  });
};

// Recibe un objeto de usuario de Instagram y devuelve uno homogéneo a las 3 redes sociales
var mapUser = function(instagramUser, callback) {
  var user = {
    id: instagramUser.id,
    name: instagramUser.full_name,
    picture: instagramUser.profile_picture,
    username: instagramUser.username
  };
  callback(null, user);
};