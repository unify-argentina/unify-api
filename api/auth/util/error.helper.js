/*
 * Este es un helper utilizado en los módulos encargados de obtener el media de un círculo, usuario o contacto
 * @author Joel Márquez
 * */
'use strict';

// Chequea los errores que pudieron venir de las distintas APIs al querer obtener contenido
module.exports.checkMediaErrors = function(results) {

  var errors = {};
  var mediaObjects = [];

  // Chequeando errores de facebook
  if (results.facebook) {
    if (results.facebook.totalResults.length > 0) {
      mediaObjects.push.apply(mediaObjects, results.facebook.totalResults);
    }
    if (results.facebook.photos) {
      if (errors.facebook === undefined) {
        errors.facebook = {};
      }
      errors.facebook.photos = results.facebook.photos;
    }
    if (results.facebook.videos) {
      if (errors.facebook === undefined) {
        errors.facebook = {};
      }
      errors.facebook.videos = results.facebook.videos;
    }
    if (results.facebook.statuses) {
      if (errors.facebook === undefined) {
        errors.facebook = {};
      }
      errors.facebook.statuses = results.facebook.statuses;
    }
  }

  // Chequeando errores de instagram
  if (results.instagram) {
    if (results.instagram.constructor === Array) {
      mediaObjects.push.apply(mediaObjects, results.instagram);
    }
    else {
      errors.instagram = results.instagram;
    }
  }

  // Chequeando errores de twitter
  if (results.twitter) {
    if (results.twitter.constructor === Array) {
      mediaObjects.push.apply(mediaObjects, results.twitter);
    }
    else {
      errors.twitter = results.twitter;
    }
  }

  return {
    mediaObjects: mediaObjects,
    errors: errors
  };
};

// Chequea los errores que pudieron venir de las distintas APIs al querer obtener amigos
module.exports.checkFriendsErrors = function(results) {

  var errors = {};
  var friends = {};

  if (results.facebook_friends.constructor === Array) {
    friends.facebook_friends = results.facebook_friends;
  }
  else {
    errors.facebook_friends = results.facebook_friends;
  }

  if (results.facebook_pages.constructor === Array) {
    friends.facebook_pages = results.facebook_pages;
  }
  else {
    errors.facebook_pages = results.facebook_pages;
  }

  if (results.instagram.constructor === Array) {
    friends.instagram = results.instagram;
  }
  else {
    errors.instagram = results.instagram;
  }

  if (results.twitter.constructor === Array) {
    friends.twitter = results.twitter;
  }
  else {
    errors.twitter = results.twitter;
  }

  return {
    friends: friends,
    errors: errors
  };
};