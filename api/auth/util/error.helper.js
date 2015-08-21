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

  checkFriendsList(errors, friends, results, 'facebook_friends');
  checkFriendsList(errors, friends, results, 'facebook_pages');
  checkFriendsList(errors, friends, results, 'instagram');
  checkFriendsList(errors, friends, results, 'twitter');

  return {
    friends: friends,
    errors: errors
  };
};

// Verifica que los resultados contengan la cuenta solicitada y que tenga la lista, si no la tiene es un error
var checkFriendsList = function(errors, friends, results, account) {
  if (results[account]) {
    if (results[account].list) {
      friends[account] = results[account];
    }
    else {
      errors[account] = results[account];
    }
  }
};