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
var errorHelper = require('../auth/util/error.helper.js');

// modelos
var User = require('../user/user.model');

// Obtiene el contenido del usuario
module.exports.getMedia = function (req, res) {

  process.nextTick(function () {

    User.findOne({ _id: req.user }, User.socialFields(), function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
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
      return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener el contenido del usuario actual' }] });
    }
    else {
      sendMediaResponseFromResults(res, results, user._id);
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
var sendMediaResponseFromResults = function(res, results, userId) {

  var mediaResults = errorHelper.checkMediaErrors(results);

  // Una vez que tenemos los contenidos de las 3 redes sociales
  async.sortBy(mediaResults.mediaObjects, function(media, callback) {
    // los ordenamos por fecha de creación (los más nuevos primero)
    callback(null, -media.created_time);
    // Una vez que los ordenamos, los enviamos
  }, function(err, sortedMedia) {

    var response = {
      user_id: userId,
      media: {
        count: sortedMedia.length,
        list: sortedMedia
      }
    };

    if (mediaResults.errors) {
      response.errors = mediaResults.errors;
    }

    return res.send(response);
  });
};

// Pone me gusta o marca como favorito un tweet
module.exports.like = function (req, res) {

  process.nextTick(function () {
    req.assert('facebook_media_id', 'Id de media de Facebook válido').optional().isString();
    req.assert('twitter_media_id', 'Id de media de Twitter válido').optional().isString();
    req.assert('instagram_media_id', 'Id de media de Instagram válido').optional().isString();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }

    // Si no se pasó ninguno, devolvemos error
    if (req.body.facebook_media_id === undefined && req.body.twitter_media_id === undefined && req.body.instagram_media_id === undefined) {
      logger.warn('No media id provided');
      return res.status(400).send({ errors: [{ msg: 'Tenes que proveer al menos un media id' }] });
    }

    User.findOne({ _id: req.user }, User.socialFields(), function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
      }
      else {
        doPostLike(req, res, user);
      }
    });
  });
};

// Una vez que encontramos al usuario, mandamos los likes correspondientes
var doPostLike = function(req, res, user) {
  // Le pegamos a cada API
  async.parallel({
    facebook: postFacebookLike.bind(null, user, req.body.facebook_media_id),
    instagram: postInstagramLike.bind(null, user, req.body.instagram_media_id),
    twitter: postTwitterLike.bind(null, user, req.body.twitter_media_id)
  },
  // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
  function(err) {
    if (err) {
      logger.warn('Error searching media ' + err);
      return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar darle like a un determinado contenido' }] });
    }
    else {
      res.sendStatus(200);
    }
  });
};

var postFacebookLike = function(user, facebookMediaId, callback) {
  if (user.hasLinkedAccount('facebook') && typeof facebookMediaId === 'string') {
    facebookMedia.postLike(user.facebook.access_token, facebookMediaId, function(err) {
      callback(err);
    });
  }
  // Si no tiene linkeada la cuenta de Facebook o no se pasó un facebook_media_id, no devolvemos nada
  else {
    callback(null);
  }
};

var postInstagramLike = function(user, instagramMediaId, callback) {
  if (user.hasLinkedAccount('instagram') && typeof instagramMediaId === 'string') {
    instagramMedia.postLike(user.instagram.access_token, instagramMediaId, function(err) {
      callback(err);
    });
  }
  // Si no tiene linkeada la cuenta de Instagram o no se pasó un instagram_media_id, no devolvemos nada
  else {
    callback(null);
  }
};

var postTwitterLike = function(user, twitterMediaId, callback) {
  if (user.hasLinkedAccount('twitter') && typeof twitterMediaId === 'string') {
    twitterMedia.postLike(user.twitter.access_token, twitterMediaId, function(err) {
      callback(err);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter o no se pasó un twitter_media_id, no devolvemos nada
  else {
    callback(null);
  }
};