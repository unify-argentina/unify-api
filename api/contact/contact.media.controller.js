/*
 * Este es el módulo que se encarga de controlar los contenidos a mostrar de un contacto
 * @author Joel Márquez
 * */
'use strict';

// requires
var async = require('async');
var _ = require('lodash');var instagramMedia = require('../auth/instagram/instagram.media.controller');
var twitterMedia = require('../auth/twitter/twitter.media.controller');
var facebookMedia = require('../auth/facebook/facebook.media.controller');
var logger = require('../../config/logger');
var config = require('../../config');
var errorHelper = require('../auth/util/error.helper');

// modelos
var User = require('../user/user.model');

// Obtiene el contenido de un contacto
module.exports.getMedia = function(req, res) {

  process.nextTick(function() {
    getContactMedia(req, res, false);
  });
};

// Obtiene más contenido del contacto
module.exports.getMoreMedia = function (req, res) {

  process.nextTick(function () {
    getContactMedia(req, res, true);
  });
};

var getContactMedia = function(req, res, shouldGetMore) {

  User.findOne({ _id: req.user_id }, User.socialFields(), function(err, user) {
    if (err || !user) {
      logger.warn('User not found: ' + req.user_id);
      return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
    }
    else {

      var contact = req.contact;

      if (!shouldGetMore) {
        contact.removeLastContentDate();
      }

      module.exports.doGetMedia(user, contact, function(err, results) {
        if (err) {
          logger.warn('Error searching media ' + JSON.stringify(err));
          return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener el contenido del contacto especificado' }] });
        }
        else {
          sendMediaResponseFromResults(res, results, contact);
        }
      });
    }
  });
};

// Obtiene el contenido del contacto por cada red social que tenga asociada el usuario
module.exports.doGetMedia = function(user, contact, callback) {
  async.parallel({
    facebook: getFacebookMedia.bind(null, user, contact),
    instagram: getInstagramMedia.bind(null, user, contact),
    twitter: getTwitterMedia.bind(null, user, contact)
  },
  // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
  function(err, results) {
    if (err) {
      callback(err, null);
    }
    else {
      callback(null, results);
    }
  });
};

var getFacebookMedia = function(user, contact, callback) {
  if (user.hasLinkedAccount('facebook') && contact.hasLinkedAccount('facebook') && contact.hasValidAccount('facebook')) {
    facebookMedia.getMedia(user.facebook.access_token, contact.facebook, contact.facebook.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Facebook, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getInstagramMedia = function(user, contact, callback) {
  if (user.hasLinkedAccount('instagram') && contact.hasLinkedAccount('instagram') && contact.hasValidAccount('instagram')) {
    instagramMedia.getMedia(user.instagram.access_token, contact.instagram, contact.instagram.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Instagram, no devolvemos nada
  else {
    callback(null, null);
  }
};

var getTwitterMedia = function(user, contact, callback) {
  if (user.hasLinkedAccount('twitter') && contact.hasLinkedAccount('twitter') && contact.hasValidAccount('twitter')) {
    twitterMedia.getMedia(user.twitter.access_token, contact.twitter, contact.twitter.id, function(err, results) {
      callback(err, results);
    });
  }
  // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
  else {
    callback(null, null);
  }
};

// Envía al cliente el contenido del contacto
var sendMediaResponseFromResults = function(res, results, contact) {

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
    contact.saveLastContentDates(slicedMedia, function(err) {
      if (err) {
        logger.warn('Error searching media ' + JSON.stringify(err));
        return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener el contenido del contacto especificado' }] });
      }
      else {
        var response = {
          contact_id: contact._id,
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