/*
 * Este módulo se encarga de manejar las páginas de Facebook del usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var _ = require('lodash');
var logger = require('../../../config/logger');
var errors = require('../../../config/errors');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');

// Aquí iremos almacenando las páginas que nos devuelva el servicio paginado de Facebook
var pages = [];

// Devuelve las páginas de Facebook del usuario loggeado
module.exports.getPages = function(access_token, facebookId, callback) {

  var url = util.format('%s/%s/likes?access_token=%s&limit=1000', facebookUtils.getBaseURL(), facebookId, access_token);

  getFacebookData(url, function(err, facebookPages) {
    if (err) {
      callback(null, err);
    }
    else {
      // Mapeamos las páginas para que tengan la misma estructura que los amigos de facebook
      async.map(facebookPages, mapPage, function(err, mappedPages) {
        // Filtramos las páginas duplicadas
        var filteredMappedPages = _.uniq(mappedPages, function(mappedUser) {
          return mappedUser.id;
        });
        var result = {
          list: filteredMappedPages,
          count: filteredMappedPages.length
        };
        logger.info('Facebook Pages: ' + JSON.stringify(result));
        callback(err, result);
      });
    }
  });
};

// Le pega a la API de Facebook y en el response, si fue exitoso, van a estar las páginas que le gustan al usuario
// forma paginada, por lo que será recursiva hasta que ya no haya paginado
var getFacebookData = function(url, callback) {

  logger.info('URL: ' + url);
  request.get({ url: url, json: true }, function(err, response) {

    var result = facebookErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error, null);
    }
    else if (response.body.data.length === 0) {
      callback(null, pages);
    }
    // Si hay un paginado, vuelvo a llamar a la función
    else if (response.body.paging.next) {
      pages.push.apply(pages, response.body.data);
      getFacebookData(response.body.paging.next, callback);
    }
    // Sino, ya tengo las páginas y los devuelvo en el callback
    else {
      pages.push.apply(pages, response.body.data);
      callback(null, pages);
    }
  });
};

// Recibe un objeto de página de Facebook y devuelve la misma estructura que los amigos de facebook
var mapPage = function(facebookPage, callback) {
  var page = {
    id: facebookPage.id,
    name: facebookPage.name,
    picture: facebookUtils.getFacebookPicture(facebookPage.id)
  };
  callback(null, page);
};