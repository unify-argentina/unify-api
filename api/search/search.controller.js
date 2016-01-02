/*
 * Este es el módulo que se encarga de controlar las acciones de busqueda
 * @author Joel Márquez
 * */
'use strict';

// requires
var instagramSearch = require('../auth/instagram/instagram.search.controller');
var twitterSearch = require('../auth/twitter/twitter.search.controller');
var logger = require('../../config/logger');
var errorHelper = require('../auth/util/error.helper');
var config = require('../../config');
var _ = require('lodash');
var async = require('async');

// modelos
var User = require('../user/user.model.js');

module.exports.search = function (req, res) {

  process.nextTick(function () {
    userSearch(req, res, false);
  });
};

module.exports.searchMore = function (req, res) {

  process.nextTick(function () {
    userSearch(req, res, true);
  });
};

var userSearch = function(req, res, shouldSearchMore) {

  if (!shouldSearchMore) {
    req.assert('providers', 'Proveedores sociales requeridos').isStringArray();
    req.assert('q', 'Consulta requerida').isString();
  }

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + req.validationErrors());
    return res.status(400).send({ errors: req.validationErrors()});
  }
  else {
    User.findOne({ _id: req.user_id }, User.socialFields(), function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({errors: [{msg: 'No pudimos encontrar el usuario que estás buscando'}]});
      }
      else {

        if (!shouldSearchMore) {
          user.removeLastSearchDate();
        }

        doSearch(req, res, user, function(err, results) {
          if (err) {
            logger.warn('Error searching ' + err);
            return res.status(400).send({errors: [{msg: 'No pudimos encontrar el usuario que estás buscando'}]});
          }
          else {
            sendSearchResponseFromResults(res, results, user, req.query.q);
          }
        });
      }
    });
  }
};

var sendSearchResponseFromResults = function(res, results, user, query) {

  var searchResults = errorHelper.checkSearchErrors(results);

  // Una vez que tenemos los resultados de búsqueda
  async.sortBy(searchResults.searches, function(search, callback) {
    // los ordenamos por fecha de creación (los más nuevos primero)
    callback(null, -search.created_time);
    // Una vez que los ordenamos, los enviamos
  }, function(err, sortedSearches) {

    // Nos quedamos con los primeros 5
    var slicedSearches = _.take(sortedSearches, config.MAX_FILTER_SEARCH_COUNT);

    // Y después salvamos para así el próximo pedido de búsqueda tenemos las últimas fechas
    user.saveLastSearchDates(slicedSearches, query, function(err) {
      if (err) {
        logger.warn('Error searching ' + JSON.stringify(err));
        return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar realizar la búsqueda' }] });
      }
      else {
        var response = {
          user_id: user._id,
          search: {
            count: sortedSearches.length,
            list: sortedSearches
          }
        };

        if (sortedSearches.errors) {
          response.errors = sortedSearches.errors;
        }

        return res.send(response);
      }
    });
  });
};

var doSearch = function(req, res, user, callback) {
  async.parallel({
    instagram: getInstagramSearch.bind(null, user, req),
    twitter: getTwitterSearch.bind(null, user, req)
  },
  // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
  callback);
};

var getInstagramSearch = function(user, req, callback) {
  if (user.hasLinkedAccount('instagram') && hasProvider(req, 'instagram', user)) {
    instagramSearch.search(user.instagram.access_token, user.instagram, req.query.q, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Instagram, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getTwitterSearch = function(user, req, callback) {
  if (user.hasLinkedAccount('twitter') && hasProvider(req, 'twitter', user)) {
    twitterSearch.search(user.twitter.access_token, user.twitter, req.query.q, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
  else {
    callback(null, null);
  }
};

var hasProvider = function (req, provider, user) {
  if (req.query.providers) {
    var providers = req.query.providers.split(',');
    return providers.indexOf(provider) > -1;
  }
  // Si no tiene los providers en la query, me fijo si en el usuario está salvada la búsqueda de ese proveedor
  else {
    return user.hasSavedSearch(provider);
  }
};