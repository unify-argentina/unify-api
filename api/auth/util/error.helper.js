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
    // Errores en fotos
    if (results.facebook.photos) {
      if (errors.facebook === undefined) {
        errors.facebook = {};
      }
      errors.facebook.photos = results.facebook.photos;
    }
    // Errores en videos
    if (results.facebook.videos) {
      if (errors.facebook === undefined) {
        errors.facebook = {};
      }
      errors.facebook.videos = results.facebook.videos;
    }
    // Errores en estados
    if (results.facebook.statuses) {
      if (errors.facebook === undefined) {
        errors.facebook = {};
      }
      errors.facebook.statuses = results.facebook.statuses;
    }
  }

  checkArrayResultsList(errors, mediaObjects, results, 'instagram');
  checkArrayResultsList(errors, mediaObjects, results, 'twitter');

  return {
    mediaObjects: mediaObjects,
    errors: errors
  };
};

// Chequea los errores que pudieron venir de las distintas APIs al querer obtener amigos
module.exports.checkFriendsErrors = function(results) {

  var errors = {};
  var friends = {};

  checkResultsList(errors, friends, results, 'facebook_friends');
  checkResultsList(errors, friends, results, 'facebook_pages');
  checkResultsList(errors, friends, results, 'instagram');
  checkResultsList(errors, friends, results, 'twitter');
  checkResultsList(errors, friends, results, 'google');

  return {
    friends: friends,
    errors: errors
  };
};

// Chequea los errores que pudieron venir al querer obtener emails
module.exports.checkEmailErrors = function(results) {

  var errors = {};
  var emails = [];

  checkArrayResultsList(errors, emails, results, 'google');

  return {
    emails: emails,
    errors: errors
  };
};

// Verifica que los resultados contengan la cuenta solicitada y que tenga la lista, si no la tiene es un error
var checkResultsList = function(errors, listObject, results, account) {
  if (results[account]) {
    if (results[account].list) {
      listObject[account] = results[account];
    }
    else {
      errors[account] = results[account];
    }
  }
};

// Verifica que los resultados tengan un array con la cuenta solicitada, si lo tienen, agregan los elementos a la lista
var checkArrayResultsList = function(errors, list, results, account) {
  if (results[account]) {
    if (results[account].constructor === Array) {
      list.push.apply(list, results[account]);
    }
    else {
      errors[account] = results[account];
    }
  }
};