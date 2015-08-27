/*
 * Este módulo se encarga de manejar las personas a las que sigue en Twitter el usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var request = require('request');
var async = require('async');
var _ = require('lodash');
var config = require('../../../config');
var logger = require('../../../config/logger');
var twitterOAuthHelper = require('./twitter.auth.helper');
var twitterErrors = require('./twitter.errors');

// constantes
var TWITTER_USER_FOLLOWS_URL = 'https://api.twitter.com/1.1/friends/list.json';

// Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Twitter
var users = [];

// Devuelve las personas a las que sigue en Instagram el usuario loggeado
module.exports.getFriends = function(access_token, twitterId, callback) {

  getTwitterData(TWITTER_USER_FOLLOWS_URL, -1, access_token, twitterId, function(err, twitterUsers) {
    if (err) {
      callback(null, err);
    }
    else {
      // Mapeamos los usuarios para que sean homogéneos a las 3 redes sociales
      async.map(twitterUsers, mapUser, function(err, mappedUsers) {
        // Filtramos los usuarios duplicados
        var filteredMappedUsers = _.uniq(mappedUsers, function(mappedUser) {
          return mappedUser.id;
        });
        // Una vez que tenemos los amigos, los ordenamos alfabeticamente por el
        // nombre completo si es que tiene, sino por el nombre de usuario
        async.sortBy(filteredMappedUsers, function(user, callback) {
          var criteria = (typeof user.name === 'string' && user.name !== '' ) ? user.name : user.username;
          callback(null, criteria);
          // Una vez que los ordenamos, los enviamos
        }, function(err, sortedUsers) {
          var result = {
            list: sortedUsers,
            count: sortedUsers.length
          };
          logger.debug('Twitter Friends: ' + JSON.stringify(result));
          callback(err, result);
        });
      });
    }
  });
};

// Le pega a la API de Twitter y en el response, si fue exitoso, van a estar las personas a las que sigue de
// forma paginada, por lo que será recursiva hasta que ya no haya paginado
var getTwitterData = function(url, cursor, access_token, twitterId, callback) {

  var qs = {
    cursor: cursor,
    user_id: twitterId,
    // La cantidad máxima de usuarios por request permitida por la API de Twitter
    // https://dev.twitter.com/rest/reference/get/friends/list
    count: 200,
    skip_status: true,
    include_user_entities: false
  };

  logger.info('URL: ' + url + 'qs=' + JSON.stringify(qs));
  request.get({ url: url, oauth: twitterOAuthHelper.getOauthParam(access_token), qs: qs, json: true }, function(err, response) {

    var result = twitterErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error, null);
    }
    // Si hay un paginado, vuelvo a llamar a la función
    else if (response.body.next_cursor !== 0) {
      users.push.apply(users, response.body.users);
      getTwitterData(TWITTER_USER_FOLLOWS_URL, response.body.next_cursor, access_token, twitterId, callback);
    }
    // Sino, ya tengo los usuarios y los devuelvo en el callback
    else {
      users.push.apply(users, response.body.users);
      callback(null, users);
    }
  });
};

// Recibe un objeto de usuario de Twitter y devuelve uno homogéneo a las 3 redes sociales
var mapUser = function(twitterUser, callback) {
  var user = {
    id: twitterUser.id_str,
    name: twitterUser.name,
    picture: twitterUser.profile_image_url.replace('_normal', '_bigger'),
    username: twitterUser.screen_name
  };
  callback(null, user);
};