/*
 * Este es el módulo que se encarga de controlar los contenidos a mostrar de un contacto
 * @author Joel Márquez
 * */
'use strict';

// requires
var instagramMedia = require('../auth/instagram/instagram.media.controller');
var twitterMedia = require('../auth/twitter/twitter.media.controller');
var facebookMedia = require('../auth/facebook/facebook.media.controller');
var logger = require('../../config/logger');
var async = require('async');

// modelos
var User = require('../user/user.model');

module.exports.getMedia = function (req, res) {

  process.nextTick(function () {

    User.findOne({ _id: req.user }, selectFields(), function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        doGetMedia(req, res, user, req.contact);
      }
    });
  });
};

var doGetMedia = function(req, res, user, contact) {
  async.parallel({
      facebook: function(callback) {
        if (user.hasLinkedAccount('facebook') && contact.hasLinkedAccount('facebook')) {
          facebookMedia.getMedia(user.facebook.accessToken, contact.facebook_id, function(err, results) {
            callback(err, results);
          });
        }
        // Si no tiene linkeada la cuenta de Facebook, no devolvemos nada
        else {
          callback(null, null);
        }
      },
      instagram: function(callback) {
        if (user.hasLinkedAccount('instagram') && contact.hasLinkedAccount('instagram')) {
          instagramMedia.getMedia(user.instagram.accessToken, contact.instagram_id, function(err, results) {
            callback(err, results);
          });
        }
        // Si no tiene linkeada la cuenta de Instagram, no devolvemos nada
        else {
          callback(null, null);
        }
      },
      twitter: function(callback) {
        if (user.hasLinkedAccount('twitter') && contact.hasLinkedAccount('twitter')) {
          twitterMedia.getMedia(user.twitter.accessToken, contact.twitter_id, function(err, results) {
            callback(err, results);
          });
        }
        // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
        else {
          callback(null, null);
        }
      }
    },
    // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
    function(err, results) {
      if (err) {
        logger.warn('Error searching media ' + err);
        return res.status(400).send({ errors: [{ msg: 'There was an error obtaining contact media' }] });
      }
      else {
        sendMediaResponseFromResults(res, results);
      }
  });
};

// Envía al cliente el contenido del contacto
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
    // los ordenamos por fecha de creación
    callback(null, media.created_time);
  // Una vez que los ordenamos, los enviamos
  }, function(err, result) {
    return res.send({
      count: result.length,
      list: result
    });
  });
};

// Devuelve los campos del usuario que van a servir para traer a los amigos de las redes sociales
var selectFields = function() {
  return 'facebook.id facebook.accessToken twitter.id twitter.accessToken.token ' +
    'twitter.accessToken.tokenSecret instagram.id instagram.accessToken';
};