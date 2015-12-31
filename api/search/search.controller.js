/*
 * Este es el módulo que se encarga de controlar las acciones de busqueda
 * @author Joel Márquez
 * */
'use strict';

// requires
var facebookSearch = require('../auth/facebook/facebook.search.controller');
var instagramSearch = require('../auth/instagram/instagram.search.controller');
var twitterSearch = require('../auth/twitter/twitter.search.controller');
var logger = require('../../config/logger');

var _ = require('lodash');
var async = require('async');

// modelos
var User = require('../user/user.model.js');

module.exports.search = function (req, res) {

  process.nextTick(function () {

    req.assert('providers', 'Proveedores sociales requeridos').isStringArray();
    req.assert('q', 'Consulta requerida').isString();

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
          doSearch(req, res, user, function(err, results) {
            if (err) {
              logger.warn('Error searching ' + err);
              return res.status(400).send({errors: [{msg: 'No pudimos encontrar el usuario que estás buscando'}]});
            }
            else {
              sendSearchResponseFromResults(res, results);
            }
          });
        }
      });
    }
  });
};

module.exports.searchMore = function (req, res) {

  process.nextTick(function () {
    return res.sendStatus(200);
  });
};

var sendSearchResponseFromResults = function(res, results) {

  // TODO chequear errores y unificar respuesta ordenada cronológicamente
  res.send(results);
};

var doSearch = function(req, res, user, callback) {
  async.parallel({
    facebook: getFacebookSearch.bind(null, user, req),
    instagram: getInstagramSearch.bind(null, user, req),
    twitter: getTwitterSearch.bind(null, user, req)
  },
  // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
  callback);
};

var getFacebookSearch = function(user, req, callback) {
  if (user.hasLinkedAccount('facebook') && hasProvider(req, 'facebook')) {
    facebookSearch.search(user.facebook.access_token, user.facebook, req.query.q, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Facebook, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getInstagramSearch = function(user, req, callback) {
  if (user.hasLinkedAccount('instagram') && hasProvider(req, 'instagram')) {
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
  if (user.hasLinkedAccount('twitter') && hasProvider(req, 'twitter')) {
    twitterSearch.search(user.twitter.access_token, user.twitter, req.query.q, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
  else {
    callback(null, null);
  }
};

var hasProvider = function (req, provider) {
  var providers = req.query.providers.split(',');
  return providers.indexOf(provider) > -1;
};