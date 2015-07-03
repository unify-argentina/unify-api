/*
 * Este módulo se encarga de manejar las personas a las que sigue en Twitter el usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var request = require('request');
var async = require('async');
var config = require('../../../config');

// Devuelve las personas a las que sigue en Instagram el usuario loggeado
module.exports.getFriends = function(accessToken, twitterId, callback) {
  // TODO chequear que si viene un paging, se haga
  // Le pega a la API de Twitter y en el response, si fue exitoso, van a estar las personas a las que sigue

  var oauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: accessToken.token,
      token_secret: accessToken.tokenSecret
    },
    url = 'https://api.twitter.com/1.1/friends/list.json',
    qs = {
      cursor: -1,
      user_id: twitterId,
      skip_status: true,
      include_user_entities: false
    };

  request.get({ url: url, oauth: oauth, qs: qs, json: true }, function(err, response) {
    // Parseamos el body para tener un JSON, y después lo mapeamos para que sea homogéneo
    // a las 3 redes sociales
    async.map(response.body.users, mapUser, function(err, results) {
      callback(err, results);
    });
  });
};

// Recibe un objeto de usuario de Twitter y devuelve uno homogéneo a las 3 redes sociales
var mapUser = function(twitterUser, callback) {
  var user = {
    id: twitterUser.id_str,
    name: twitterUser.name,
    picture: twitterUser.profile_image_url,
    username: twitterUser.screen_name
  };
  callback(null, user);
};
