/*
 * Este módulo se encarga de manejar las personas a las que sigue en Twitter el usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var request = require('request');
var async = require('async');
var config = require('../../../config');
var logger = require('../../../config/logger');

// constantes
var TWITTER_USER_FOLLOWS_URL = 'https://api.twitter.com/1.1/friends/list.json';

// Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Twitter
var users = [];

// Devuelve las personas a las que sigue en Instagram el usuario loggeado
module.exports.getFriends = function(accessToken, twitterId, callback) {

  getTwitterData(TWITTER_USER_FOLLOWS_URL, -1, accessToken, twitterId, function(err, twitterUsers) {
    if (err) {
      callback(err, null);
    }
    else {
      // Mapeamos los usuarios para que sean homogéneos a las 3 redes sociales
      async.map(twitterUsers, mapUser, function (err, mappedUsers) {
        var result = {
          count: mappedUsers.length,
          list: mappedUsers
        };
        logger.debug('Friends: ' + JSON.stringify(result));
        callback(err, result);
      });
    }
  });
};

// Le pega a la API de Twitter y en el response, si fue exitoso, van a estar las personas a las que sigue de
// forma paginada, por lo que será recursiva hasta que ya no haya paginado
var getTwitterData = function(url, cursor, accessToken, twitterId, callback) {

  var qs = {
    cursor: cursor,
    user_id: twitterId,
    // La cantidad máxima de usuarios por request permitida por la API de Twitter
    // https://dev.twitter.com/rest/reference/get/friends/list
    count: 200,
    skip_status: true,
    include_user_entities: false
  };

  logger.debug('URL: ' + url + 'qs=' + JSON.stringify(qs));
  request.get({ url: url, oauth: getOauthParam(accessToken), qs: qs, json: true }, function(err, response) {
    if (err || (response.body.errors && response.body.errors.length > 0)) {
      logger.error('Error: ' + err ? err : response.body.errors[0].message);
      callback(err ? err : response.body.errors[0].message, null);
    }
    // Si hay un paginado, vuelvo a llamar a la función
    else if (response.body.next_cursor !== 0) {
      users.push.apply(users, response.body.users);
      getTwitterData(TWITTER_USER_FOLLOWS_URL, response.body.next_cursor, accessToken, twitterId, callback);
    }
    // Sino, ya tengo los usuarios y los devuelvo en el callback
    else {
      users.push.apply(users, response.body.users);
      callback(null, users);
    }
  });
};

// Devuelve los parámetros necesarios de OAuth para hacer el request autenticado
var getOauthParam = function(accessToken) {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    token: accessToken.token,
    token_secret: accessToken.tokenSecret
  };
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