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

module.exports.search = function (req, res) {

  process.nextTick(function () {

    req.assert('providers', 'Proveedores sociales requeridos').isStringArray();

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
          doSearch(req, res, user);
        }
      });
    }
  });
};

var doSearch = function(req, res, user) {
  async.parallel({
    facebook: getFacebookSearch.bind(null, user, req),
    instagram: getInstagramSearch.bind(null, user, req),
    twitter: getTwitterSearch.bind(null, user, req)
  },
  // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
  function(err, results) {
    callback(err, results);
  });
};

var getFacebookSearch = function(user, req, callback) {
  if (user.hasLinkedAccount('facebook')) {
    facebookSearch.search(user.facebook.access_token, req.params.query, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Facebook, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getInstagramSearch = function(user, req, callback) {
  if (user.hasLinkedAccount('instagram')) {
    instagramSearch.search(user.instagram.access_token, req.params.query, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Instagram, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getTwitterSearch = function(user, req, callback) {
  if (user.hasLinkedAccount('twitter')) {
    twitterSearch.search(user.twitter.access_token, req.params.query, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
  else {
    callback(null, null);
  }
};