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
var googleContacts = require('../auth/google/google.contacts.controller');
var async = require('async');
var logger = require('../../config/logger');
var errorHelper = require('../auth/util/error.helper');

// modelos
var User = require('./user.model.js');

// Se encarga de devolver los amigos de las redes sociales que tenga conectadas
module.exports.getFriends = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user_id }, User.socialFields(), function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
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
    twitter: getTwitterFriends.bind(null, user),
    google: getGoogleContacts.bind(null, user)
  },
  // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
  function(err, results) {
    if (err) {
      logger.warn('Error searching friends ' + JSON.stringify(err));
      return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener los amigos del usuario actual' }] });
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

var getGoogleContacts = function(user, callback) {
  if (user.hasLinkedAccount('google')) {
    googleContacts.getContacts(user.google.refresh_token, user.google.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
  else {
    callback(null, null);
  }
};

// Envía al cliente los amigos del usuario
var sendFriendsResponseFromResults = function(res, results) {

  var friendResults = errorHelper.checkFriendsErrors(results);

  var response = {
    friends: friendResults.friends
  };

  if (friendResults.errors) {
    response.errors = friendResults.errors;
  }

  return res.send(response);
};