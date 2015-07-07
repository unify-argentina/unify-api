/*
 * Este módulo se encarga de manejar las personas a las que sigue en Instagram el usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var logger = require('../../../config/logger')(__filename);

// Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Instagram
var users = [];

// Devuelve las personas a las que sigue en Instagram el usuario loggeado
module.exports.getFriends = function(accessToken, instagramId, callback) {

  // El límite de la API de Instagram es de 100 usuarios por request. No lo dice, pero probando
  // descubrimos que es 100. https://instagram.com/developer/endpoints/
  var url = util.format('https://api.instagram.com/v1/users/%s/follows?access_token=%s&count=100', instagramId, accessToken);

  getInstagramData(url, function(err, instagramUsers) {
    if (err) {
      callback(err, null);
    }
    else {
      // Mapeamos los usuarios para que sean homogéneos a las 3 redes sociales
      async.map(instagramUsers, mapUser, function(err, mappedUsers) {
        var result = {
          count: mappedUsers.length,
          list: mappedUsers
        };
        logger.info('Friends: ' + JSON.stringify(result));
        callback(err, result);
      });
    }
  });
};

// Le pega a la API de Instagram y en el response, si fue exitoso, van a estar las personas a las que sigue de
// forma paginada, por lo que será recursiva hasta que ya no haya paginado
var getInstagramData = function(url, callback) {

  logger.info('URL: ' + url);
  request.get({ url: url, json: true }, function(err, response) {
    if (!response.body.meta) {
      logger.error('Could not get instagram friends');
      callback(new Error('Could not get instagram friends'), null);
    }

    if (err || response.body.meta.error_type) {
      logger.error('Error: ' + err ? err : response.body.meta.error_message);
      callback(err ? err : response.body.meta.error_message, null);
    }
    // Si hay un paginado, vuelvo a llamar a la función
    else if (response.body.pagination.next_url) {
      users.push.apply(users, response.body.data);
      getInstagramData(response.body.pagination.next_url, callback);
    }
    // Sino, ya tengo los usuarios y los devuelvo en el callback
    else {
      users.push.apply(users, response.body.data);
      callback(null, users);
    }
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