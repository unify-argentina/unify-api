/*
 * Este módulo se encarga de manejar los amigos de Facebook del usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var _ = require('lodash');
var logger = require('../../../config/logger');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');

// Devuelve los amigos de Facebook del usuario loggeado
module.exports.getFriends = function(access_token, facebookId, callback) {

  var url = util.format('%s/%s/friends?access_token=%s&limit=1000', facebookUtils.getBaseURL(), facebookId, access_token);

  // Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Facebook
  var friends = [];

  getFacebookData(url, friends, function(err, facebookUsers) {
    if (err) {
      callback(null, err);
    }
    else {
      // Mapeamos los usuarios para que sean homogéneos a las 4 cuentas
      async.map(facebookUsers, mapUser, function(err, mappedUsers) {

        // Una vez que tenemos los amigos, los ordenamos alfabeticamente por el nombre
        async.sortBy(mappedUsers, function(friend, callback) {

          callback(null, friend.name);

        }, function(err, sortedFriends) {

          // Una vez que los ordenamos, los enviamos
          var result = {
            list: sortedFriends,
            count: sortedFriends.length
          };
          logger.debug('Facebook Friends: ' + JSON.stringify(result));
          callback(null, result);
        });
      });
    }
  });
};

// Le pega a la API de Facebook y en el response, si fue exitoso, van a estar los amigos del usuario
// forma paginada, por lo que será recursiva hasta que ya no haya paginado
var getFacebookData = function(url, friends, callback) {

  logger.info('URL: ' + url);
  request.get({ url: url, json: true }, function(err, response) {

    var result = facebookErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error, null);
    }
    else if (response.body.data.length === 0) {
      callback(null, friends);
    }
    // Si hay un paginado, vuelvo a llamar a la función
    else if (response.body.paging.next) {
      friends.push.apply(friends, response.body.data);
      getFacebookData(response.body.paging.next, friends, callback);
    }
    // Sino, ya tengo los usuarios y los devuelvo en el callback
    else {
      friends.push.apply(friends, response.body.data);
      callback(null, friends);
    }
  });
};

// Recibe un objeto de usuario de Facebook y devuelve uno homogéneo a las 3 redes sociales
var mapUser = function(facebookUser, callback) {
  var user = {
    id: facebookUser.id,
    name: facebookUser.name,
    picture: facebookUtils.getFacebookPicture(facebookUser.id)
  };
  callback(null, user);
};