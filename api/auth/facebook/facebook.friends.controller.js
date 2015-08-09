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

// Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Facebook
var users = [];

// Devuelve los amigos de Facebook del usuario loggeado
module.exports.getFriends = function(access_token, facebookId, callback) {

  var url = util.format('%s/%s/friends?access_token=%s&limit=1000', facebookUtils.getBaseURL(), facebookId, access_token);

  getFacebookData(url, function(err, facebookUsers) {
    if (err) {
      callback(err, null);
    }
    else {
      // Mapeamos los usuarios para que sean homogéneos a las 3 redes sociales
      async.map(facebookUsers, mapUser, function(err, mappedUsers) {
        // Filtramos los usuarios duplicados
        var filteredMappedUsers = _.uniq(mappedUsers, function(mappedUser) {
          return mappedUser.id;
        });
        logger.debug('Friends: ' + JSON.stringify(filteredMappedUsers));
        callback(err, filteredMappedUsers);
      });
    }
  });
};

// Le pega a la API de Facebook y en el response, si fue exitoso, van a estar los amigos del usuario
// forma paginada, por lo que será recursiva hasta que ya no haya paginado
var getFacebookData = function(url, callback) {

  logger.debug('URL: ' + url);
  request.get({ url: url, json: true }, function(err, response) {
    if (err || response.body.error) {
      logger.error('Error: ' + err ? err : response.body.error.message);
      callback(err ? err : response.body.error.message, null);
    }
    // Si hay un paginado, vuelvo a llamar a la función
    else if (response.body.paging.next) {
      users.push.apply(users, response.body.data);
      getFacebookData(response.body.paging.next, callback);
    }
    // Sino, ya tengo los usuarios y los devuelvo en el callback
    else {
      users.push.apply(users, response.body.data);
      callback(null, users);
    }
  });
};

// Recibe un objeto de usuario de Facebook y devuelve uno homogéneo a las 3 redes sociales
var mapUser = function(facebookUser, callback) {
  var user = {
    id: facebookUser.id,
    name: facebookUser.name,
    picture: facebookUtils.getFacebookPicture(facebookUser.id),
    is_friend: true
  };
  callback(null, user);
};