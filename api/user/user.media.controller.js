/*
 * Este es el módulo que se encarga de controlar los contenidos a mostrar de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var instagramMedia = require('../auth/instagram/instagram.media.controller');
var twitterMedia = require('../auth/twitter/twitter.media.controller');
var facebookMedia = require('../auth/facebook/facebook.media.controller');
var logger = require('../../config/logger');
var async = require('async');
var _ = require('lodash');

// modelos
var User = require('../user/user.model');

// Obtiene el contenido del usuario
module.exports.getMedia = function (req, res) {

  process.nextTick(function () {

    User.findOne({ _id: req.user }, selectFields())
      .populate('main_circle')
      .exec(function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        doGetMedia(res, user);
      }
    });
  });
};

// Una vez que encontramos al usuario, mandamos a consultar su contenido por cada red social que tenga asociada
var doGetMedia = function(res, user) {
  async.parallel({
      facebook: getFacebookMedia.bind(null, user),
      instagram: getInstagramMedia.bind(null, user),
      twitter: getTwitterMedia.bind(null, user)
    },
    // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
    function(err, results) {
      if (err) {
        logger.warn('Error searching media ' + err);
        return res.status(400).send({ errors: [{ msg: 'There was an error obtaining user media' }] });
      }
      else {
        sendMediaResponseFromResults(res, results);
      }
    });
};

var getFacebookMedia = function(user, callback) {
  if (user.hasLinkedAccount('facebook')) {
    facebookMedia.getMedia(user.facebook.access_token, user.facebook.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Facebook, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getInstagramMedia = function(user, callback) {
  if (user.hasLinkedAccount('instagram')) {
    instagramMedia.getMedia(user.instagram.access_token, user.instagram.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Instagram, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getTwitterMedia = function(user, callback) {
  if (user.hasLinkedAccount('twitter')) {
    twitterMedia.getMedia(user.twitter.access_token, user.twitter.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
  else {
    callback(null, null);
  }
};

// Envía al cliente el contenido del usuario
var sendMediaResponseFromResults = function(res, results) {
  var mediaObjects = [];
  if (results.facebook) {
    mediaObjects.push.apply(mediaObjects, results.facebook);
  }
  if (results.instagram) {
    mediaObjects.push.apply(mediaObjects, results.instagram);
  }
  if (results.twitter) {
    mediaObjects.push.apply(mediaObjects, results.twitter);
  }
  // Una vez que tenemos los contenidos de las 3 redes sociales
  async.sortBy(mediaObjects, function(media, callback) {
    // los ordenamos por fecha de creación (los más nuevos primero)
    callback(null, -media.created_time);
    // Una vez que los ordenamos, los enviamos
  }, function(err, sortedMedia) {
    return res.send({
      media: {
        count: sortedMedia.length,
        list: sortedMedia
      }
    });
  });
};

// Limpia los datos que no tienen que ser enviados al cliente
var clearProtectedData = function(result) {
  if (result.instagram) {
    result.instagram.id = undefined;
    result.instagram.access_token = undefined;
  }
  if (result.facebook) {
    result.facebook.id = undefined;
    result.facebook.access_token = undefined;
  }
  if (result.twitter) {
    result.twitter.id = undefined;
    result.twitter.access_token = undefined;
  }
};

// Devuelve los campos del usuario que van a servir para traer a los amigos de las redes sociales
var selectFields = function() {
  return '+facebook.id +facebook.access_token +twitter.id +twitter.access_token.token ' +
    '+twitter.access_token.token_secret +instagram.id +instagram.access_token';
};