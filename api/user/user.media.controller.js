/*
 * Este es el módulo que se encarga de controlar los contenidos a mostrar de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var async = require('async');
var _ = require('lodash');
var instagramMedia = require('../auth/instagram/instagram.media.controller');
var twitterMedia = require('../auth/twitter/twitter.media.controller');
var facebookMedia = require('../auth/facebook/facebook.media.controller');
var logger = require('../../config/logger');
var config = require('../../config');
var errorHelper = require('../auth/util/error.helper.js');

// modelos
var User = require('../user/user.model');

// Obtiene el contenido del usuario
module.exports.getMedia = function(req, res) {

  process.nextTick(function() {
    getUserMedia(req, res, false);
  });
};

// Obtiene más contenido del usuario
module.exports.getMoreMedia = function (req, res) {

  process.nextTick(function () {
    getUserMedia(req, res, true);
  });
};

var getUserMedia = function(req, res, shouldGetMore) {

  User.findOne({ _id: req.user_id }, User.socialFields(), function(err, user) {
    if (err || !user) {
      logger.warn('User not found: ' + req.user_id);
      return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
    }
    else {

      if (!shouldGetMore) {
        user.removeLastContentDate();
      }

      doGetMedia(res, user);
    }
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
      logger.warn('Error searching media ' + JSON.stringify(err));
      return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener el contenido del usuario actual' }] });
    }
    else {
      sendMediaResponseFromResults(res, results, user);
    }
  });
};

var getFacebookMedia = function(user, callback) {
  if (user.hasLinkedAccount('facebook')) {
    facebookMedia.getMedia(user.facebook.access_token, user.facebook, user.facebook.id, function(err, results) {
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
    instagramMedia.getMedia(user.instagram.access_token, user.instagram, user.instagram.id, function(err, results) {
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
    twitterMedia.getMedia(user.twitter.access_token, user.twitter, user.twitter.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
  else {
    callback(null, null);
  }
};

// Envía al cliente el contenido del usuario
var sendMediaResponseFromResults = function(res, results, user) {

  var mediaResults = errorHelper.checkMediaErrors(results);

  // Una vez que tenemos los contenidos de las 3 redes sociales
  async.sortBy(mediaResults.mediaObjects, function(media, callback) {
    // los ordenamos por fecha de creación (los más nuevos primero)
    callback(null, -media.created_time);
    // Una vez que los ordenamos, los enviamos
  }, function(err, sortedMedia) {

    // Nos quedamos con los primeros 5
    var slicedMedia = _.take(sortedMedia, config.MAX_FILTER_MEDIA_COUNT);

    // Y después salvamos para así el próximo pedido de contenido tenemos las últimas fechas
    user.saveLastContentDates(slicedMedia, function(err) {
      if (err) {
        logger.warn('Error searching media ' + JSON.stringify(err));
        return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener el contenido del usuario actual' }] });
      }
      else {
        var response = {
          user_id: user._id,
          media: {
            count: slicedMedia.length,
            list: slicedMedia
          }
        };

        if (mediaResults.errors) {
          response.errors = mediaResults.errors;
        }

        return res.send(response);
      }
    });
  });
};

// Pone me gusta o marca como favorito un tweet
module.exports.like = function(req, res) {

  process.nextTick(function() {
    toggleLike(req, res, true);
  });
};

// Saca el me gusta o desmarca como favorito un tweet
module.exports.unlike = function(req, res) {

  process.nextTick(function() {
    toggleLike(req, res, false);
  });
};

var toggleLike = function(req, res, toggleLike) {
  req.assert('facebook_media_id', 'Id de media de Facebook válido').optional().isString();
  req.assert('twitter_media_id', 'Id de media de Twitter válido').optional().isString();
  req.assert('instagram_media_id', 'Id de media de Instagram válido').optional().isString();

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
    return res.status(400).send({ errors: req.validationErrors() });
  }

  // Si no se pasó ninguno, devolvemos error
  if (req.body.facebook_media_id === undefined && req.body.twitter_media_id === undefined && req.body.instagram_media_id === undefined) {
    logger.warn('No media id provided');
    return res.status(400).send({ errors: [{ msg: 'Tenes que proveer al menos un media id para darle like' }] });
  }

  User.findOne({ _id: req.user_id }, User.socialFields(), function(err, user) {
    if (err || !user) {
      logger.warn('User not found: ' + req.user_id);
      return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
    }
    else {
      doToggleLike(req, res, user, toggleLike);
    }
  });
};

// Una vez que encontramos al usuario, mandamos los likes correspondientes
var doToggleLike = function(req, res, user, toggleLike) {
  // Le pegamos a cada API
  async.parallel({
    facebook: toggleFacebookLike.bind(null, user, req.body.facebook_media_id, toggleLike),
    instagram: toggleInstagramLike.bind(null, user, req.body.instagram_media_id, toggleLike),
    twitter: toggleTwitterLike.bind(null, user, req.body.twitter_media_id, toggleLike)
  },
  // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
  function(err) {
    if (err) {
      logger.warn('Error giving like ' + JSON.stringify(err));
      return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar darle like a un determinado contenido' }] });
    }
    else {
      return res.sendStatus(200);
    }
  });
};

var toggleFacebookLike = function(user, facebookMediaId, toggleLike, callback) {
  if (user.hasLinkedAccount('facebook') && typeof facebookMediaId === 'string') {
    facebookMedia.toggleLike(user.facebook.access_token, facebookMediaId, toggleLike, function(err) {
      callback(err);
    });
  }
  // Si no tiene linkeada la cuenta de Facebook o no se pasó un facebook_media_id, no devolvemos nada
  else {
    callback(null);
  }
};

var toggleInstagramLike = function(user, instagramMediaId, toggleLike, callback) {
  if (user.hasLinkedAccount('instagram') && typeof instagramMediaId === 'string') {
    instagramMedia.toggleLike(user.instagram.access_token, instagramMediaId, toggleLike, function(err) {
      callback(err);
    });
  }
  // Si no tiene linkeada la cuenta de Instagram o no se pasó un instagram_media_id, no devolvemos nada
  else {
    callback(null);
  }
};

var toggleTwitterLike = function(user, twitterMediaId, toggleLike, callback) {
  if (user.hasLinkedAccount('twitter') && typeof twitterMediaId === 'string') {
    twitterMedia.toggleLike(user.twitter.access_token, twitterMediaId, toggleLike, function(err) {
      callback(err);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter o no se pasó un twitter_media_id, no devolvemos nada
  else {
    callback(null);
  }
};

// Publica el contenido en las redes sociales pasadas por parámetro
module.exports.publishContent = function(req, res) {

  process.nextTick(function() {

    if (typeof req.body === 'string') {
      req.body = JSON.parse(req.body);
    }

    req.assert('facebook', 'Facebook válido').isBoolean();
    req.assert('twitter', 'Twitter válido').isBoolean();
    req.assert('text', 'Texto válido').optional().isString();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
      return res.status(400).send({ errors: req.validationErrors() });
    }

    User.findOne({ _id: req.user_id }, User.socialFields(), function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
      }
      else {
        doPublishContent(req, res, user);
      }
    });
  });
};

// Efectivamente publica el contenido
var doPublishContent = function(req, res, user) {
  // Le pegamos a cada API

  if (req.file === undefined && req.body.text === undefined) {
    logger.warn('User not found: ' + req.user_id);
    return res.status(400).send({ errors: [{ msg: 'Tienes que enviar al menos o un texto o un archivo para poder publicar contenido desde Unify' }] });
  }

  async.parallel({
    facebook: publishFacebookContent.bind(null, user, req.file, req.body.text, req.body.facebook === 'true' || req.body.facebook === true),
    twitter: publishTwitterContent.bind(null, user, req.file, req.body.text, req.body.twitter === 'true' || req.body.twitter === true)
  },
  function(err) {
    if (err) {
      logger.warn('Error publishing content ' + JSON.stringify(err));
      return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar subir contenido' }] });
    }
    else {
      return res.sendStatus(200);
    }
  });
};

var publishFacebookContent = function(user, file, text, shouldPublish, callback) {
  if (user.hasLinkedAccount('facebook') && shouldPublish) {
    facebookMedia.publishContent(user.facebook.access_token, file, text, function(err) {
      callback(err);
    });
  }
  else {
    callback(null);
  }
};

var publishTwitterContent = function(user, file, text, shouldPublish, callback) {
  if (user.hasLinkedAccount('twitter') && shouldPublish) {
    twitterMedia.publishContent(user.twitter.access_token, file, text, function(err) {
      callback(err);
    });
  }
  else {
    callback(null);
  }
};