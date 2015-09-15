/*
 * Este módulo se encarga de manejar las personas a las que sigue en Instagram el usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var _ = require('lodash');
var logger = require('../../../config/logger');
var instagramErrors = require('./instagram.errors');

// Devuelve las personas a las que sigue en Instagram el usuario loggeado
module.exports.getFriends = function(access_token, instagramId, callback) {

  // El límite de la API de Instagram es de 100 usuarios por request. No lo dice, pero probando
  // descubrimos que es 100. https://instagram.com/developer/endpoints/
  var url = util.format('https://api.instagram.com/v1/users/%s/follows?access_token=%s&count=100', instagramId, access_token);

  // Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Instagram
  var users = [];

  getInstagramData(url, users, function(err, instagramUsers) {
    if (err) {
      callback(null, err);
    }
    else {

      // Mapeamos los usuarios para que sean homogéneos a las 4 cuentas
      async.map(instagramUsers, mapUser, function(err, mappedUsers) {

        // Una vez que tenemos los amigos, los ordenamos alfabeticamente por el
        // nombre completo si es que tiene, sino por el nombre de usuario
        async.sortBy(mappedUsers, function(user, callback) {

          var criteria = (typeof user.name === 'string' && user.name !== '' ) ? user.name : user.username;
          callback(null, criteria);

        }, function(err, sortedUsers) {

          // Una vez que los ordenamos, los enviamos
          var result = {
            list: sortedUsers,
            count: sortedUsers.length
          };
          logger.debug('Instagram Friends: ' + JSON.stringify(result));
          callback(null, result);
        });
      });
    }
  });
};

// Le pega a la API de Instagram y en el response, si fue exitoso, van a estar las personas a las que sigue de
// forma paginada, por lo que será recursiva hasta que ya no haya paginado
var getInstagramData = function(url, users, callback) {

  logger.info('URL: ' + url);
  request.get({ url: url, json: true }, function(err, response) {

    var result = instagramErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error, null);
    }
    // Si hay un paginado, vuelvo a llamar a la función
    else if (response.body.pagination.next_url) {
      users.push.apply(users, response.body.data);
      getInstagramData(response.body.pagination.next_url, users, callback);
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