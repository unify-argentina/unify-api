/*
 * Este es el módulo que se encarga de obtener los amigos del usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var facebookFriends = require('../auth/facebook/facebook.friends.controller');
var facebookPages = require('../auth/facebook/facebook.pages.controller');
var instagramFriends = require('../auth/instagram/instagram.friends.controller');
var twitterFriends = require('../auth/twitter/twitter.friends.controller');
var async = require('async');
var logger = require('../../config/logger');
var errorHelper = require('../auth/util/error.helper');

// modelos
var User = require('./user.model.js');

// Se encarga de devolver los amigos de las redes sociales que tenga conectadas
module.exports.getFriends = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user }, selectFields(), function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        doGetFriends(res, user);
      }
    });
  });
};

// Una vez que encontramos al usuario, mandamos a consultar los amigos por cada red social que tenga
// asociada el usuario
var doGetFriends = function(res, user) {
  async.parallel({
      facebook_friends: getFacebookFriends.bind(null, user),
      facebook_pages: getFacebookPages.bind(null, user),
      instagram: getInstagramFriends.bind(null, user),
      twitter: getTwitterFriends.bind(null, user)
    },
    // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
    function(err, results) {
      if (err) {
        logger.warn('Error searching friends ' + err);
        return res.status(400).send({ errors: [{ msg: 'There was an error obtaining user friends' }] });
      }
      else {
        sendFriendsResponseFromResults(res, results);
      }
    });
};

var getFacebookFriends = function(user, callback) {
  if (user.hasLinkedAccount('facebook')) {
    facebookFriends.getFriends(user.facebook.access_token, user.facebook.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Facebook, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getFacebookPages = function(user, callback) {
  if (user.hasLinkedAccount('facebook')) {
    facebookPages.getPages(user.facebook.access_token, user.facebook.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Facebook, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getInstagramFriends = function(user, callback) {
  if (user.hasLinkedAccount('instagram')) {
    instagramFriends.getFriends(user.instagram.access_token, user.instagram.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Instagram, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getTwitterFriends = function(user, callback) {
  if (user.hasLinkedAccount('twitter')) {
    twitterFriends.getFriends(user.twitter.access_token, user.twitter.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
  else {
    callback(null, null);
  }
};

// Devuelve los campos del usuario que van a servir para traer a los amigos de las redes sociales
var selectFields = function() {
  return 'facebook.id facebook.access_token twitter.id twitter.access_token.token ' +
    'twitter.access_token.token_secret instagram.id instagram.access_token';
};

// Envía al cliente los amigos del usuario
var sendFriendsResponseFromResults = function(res, results) {

  var friendResults = errorHelper.checkFriendsErrors(results);

  logger.info('User friends: ' + JSON.stringify(friendResults));

  return res.send({
    friends: friendResults.friends,
    errors: friendResults.errors
  });
};