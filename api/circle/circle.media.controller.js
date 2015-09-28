/*
 * Este es el módulo que se encarga de controlar los contenidos a mostrar de un circulo
 * @author Joel Márquez
 * */
'use strict';

// requires
var contactMediaController = require('../contact/contact.media.controller');
var logger = require('../../config/logger');
var async = require('async');
var _ = require('lodash');

// modelos
var Circle = require('./circle.model');
var Contact = require('../contact/contact.model');
var User = require('../user/user.model');

// Devuelve el contenido de los contactos hijos directos e indirectos (hijos de algún subcírculo)
module.exports.getMedia = function (req, res) {

  process.nextTick(function () {

    User.findOne({ _id: req.user_id }, User.socialFields(), function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
      }
      else {
        // Una vez que tenemos al usuario buscamos los contactos que tienen como ancestro al círculo a buscar
        Contact.find({ 'parents.ancestors': req.circle._id, user: req.user_id }, function(err, contacts) {
          if (err || !contacts) {
            logger.warn('Contacts not found for circle: ' + req.circle._id);
            return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener el contenido del círculo especificado' }] });
          }
          else {
            // Si no hubo error, vamos a buscar el contenido de cada contacto encontrado
            doGetMedia(res, user, contacts, function(err, results) {
              if (err) {
                logger.warn('Error searching media ' + err);
                return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar obtener el contenido del círculo especificado' }] });
              }
              else {
                sendMediaResponseFromResults(res, results, req.circle._id);
              }
            });
          }
        });
      }
    });
  });
};

// Obtiene el contenido de cada contacto
var doGetMedia = function(res, user, contacts, mediaCallback) {

  // Por cada contacto obtenemos el contenido de sus cuentas asociadas
  async.map(contacts, function(contact, mapCallback) {

    contactMediaController.doGetMedia(user, contact, function(err, result) {

      var mediaObjects = buildMediaArray(result);

      // Por cada mediaObject, le asociamos los datos del contacto
      async.map(mediaObjects, function(mediaObject, contactCallback) {

        mediaObject.contact = {
          id: contact._id,
          name: contact.name,
          picture: contact.picture
        };
        contactCallback(null, mediaObject);

      }, function(err, contactMediaObjects) {

        mapCallback(null, contactMediaObjects);
      });
    });

  }, function(err, contactsMedia) {

    mediaCallback(err, contactsMedia);
  });
};

// Arma el array de contenido chequeando si contiene contenido por cada red social
var buildMediaArray = function(media) {
  var mediaArray = [];
  if (media.facebook && media.facebook.totalResults) {
    mediaArray.push.apply(mediaArray, media.facebook.totalResults);
  }
  if (media.instagram) {
    mediaArray.push.apply(mediaArray, media.instagram);
  }
  if (media.twitter) {
    mediaArray.push.apply(mediaArray, media.twitter);
  }
  return mediaArray;
};

// Ordena el contenido cronológicamente y le devuelve al cliente los contactos, su contenido e info del círculo
var sendMediaResponseFromResults = function(res, mediaResults, circleId) {

  // Media results es un array de arrays, lo convertimos a un sólo array
  var flattenedMedia = _.flatten(mediaResults);

  async.sortBy(flattenedMedia, function(media, callback) {
    // los ordenamos por fecha de creación (los más nuevos primero)
    callback(null, -media.created_time);
  }, function(err, sortedMedia) {

    return res.send({
      circle_id: circleId,
      media: {
        count: sortedMedia.length,
        list: sortedMedia
      }
    });
  });
};