/*
 * Este es el módulo que se encarga de controlar las acciones sobre un contacto
 * @author Joel Márquez
 * */
'use strict';

// requires
var logger = require('../../config/logger');

// modelos
var Contact = require('./contact.model');
var User = require('../user/user.model');
var Circle = require('../circle/circle.model');

// Crea un contacto
module.exports.create = function(req, res) {

  process.nextTick(function() {
    validateParams(req, res);

    // Primero encontramos al usuario loggeado
    User.findOne({ _id: req.user }, selectFields(),function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {

        validateSocialIds(user, req, res);

        user.hasCircleWithId(req.body.circle_id, function(success, foundCircle) {
          if (success) {
            var contact = new Contact();
            saveContactData(req, res, contact, user);
          }
          else {
            logger.warn("Circle=" + req.body.circle_id + " doesn't exists or doesn't belong to current user=" + req.user);
            return res.status(401).send({ errors: [{ msg: "Circle doesn't exists or doesn't belong to current user" }] });
          }
        });
      }
    });
  });
};

// TODO
module.exports.getById = function(req, res) {

  process.nextTick(function() {
    return res.sendStatus(200);
  });
};

// TODO
module.exports.update = function(req, res) {

  process.nextTick(function() {
    return res.sendStatus(200);
  });
};

// TODO
module.exports.delete = function(req, res) {

  process.nextTick(function() {
    return res.sendStatus(200);
  });
};

// Valida que los parámetros sean correctos
var validateParams = function(req, res) {
  req.assert('name', 'Required').notEmpty();
  req.assert('name', 'Only alphanumeric characters are allowed').isAscii();
  req.assert('picture', 'Required').notEmpty();
  req.assert('picture', 'It must be a valid URL').isURL();
  // TODO revisar si un contacto puede estar en más de un círculo
  req.assert('circle_id', 'Required').notEmpty();
  req.assert('circle_id', 'Only alphanumeric characters are allowed').isAscii();

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + req.validationErrors());
    return res.status(401).send({ errors: req.validationErrors()});
  }

  // Validamos nosql injection
  if (typeof req.body.name !== 'string' || typeof req.body.picture !== 'string' ||
    typeof req.body.circle_id !== 'string') {
    logger.warn('No SQL injection - name: ' + req.body.name + ' picture: ' + req.body.picture +
    ' circle_id: ' + req.body.circle_id);
    return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }
};

var validateSocialIds = function(user, req, res) {
  // Validamos que tenga por lo menos un id de una red social
  if (!req.body.facebook_id && !req.body.twitter_id && !req.body.instagram_id) {
    logger.warn("Requester didn't suplied a facebook, twitter or instagram id for creating a contact");
    return res.status(401).send({ errors: [{ msg:
      'You have to suply a facebook, twitter or instagram id for creating a contact' }] });
  }
  // Validamos que si hay alguno, tenga un formato válido
  else if (req.body.facebook_id && typeof req.body.facebook_id !== 'string' ||
    req.body.twitter_id && typeof req.body.twitter_id !== 'string' ||
    req.body.instagram_id && typeof req.body.instagram_id !== 'string') {
    logger.warn('No SQL injection - facebook_id: ' + req.body.facebook_id +
      ' twitter_id: ' + req.body.twitter_id + ' instagram_id: ' + req.body.instagram_id);
    return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }
};

// Salva el contacto y lo envía al cliente
var saveContactData = function(req, res, contact, user) {
  contact.name = req.body.name;
  contact.picture = req.body.picture;
  // Si el usuario tiene asociado facebook y vino como parámetro el id de facebook del contacto, lo agregamos
  if (user.hasLinkedAccount('facebook')) {
    contact.facebook_id = req.body.facebook_id ? req.body.facebook_id : undefined;
  }
  // Si el usuario tiene asociado twitter y vino como parámetro el id de twitter del contacto, lo agregamos
  if (user.hasLinkedAccount('twitter')) {
    contact.twitter_id = req.body.twitter_id ? req.body.twitter_id : undefined;
  }
  // Si el usuario tiene asociado instagram y vino como parámetro el id de instagram del contacto, lo agregamos
  if (user.hasLinkedAccount('instagram')) {
    contact.instagram_id = req.body.instagram_id ? req.body.instagram_id : undefined;
  }
  contact.circle = req.body.circle_id;
  contact.user = req.user;
  contact.save(function(err) {
    if (err) {
      logger.err(err);
      return res.status(401).send({ errors: [{ msg: 'Error saving data ' + err }] });
    }
    else {
      logger.debug('Contact for user: ' + req.user + ' created successfully: ' + contact.toString());
      return res.status(200).send({ contact: contact });
    }
  });
};

// Devuelve los campos del usuario que van a servir para traer a los amigos de las redes sociales
var selectFields = function() {
  return '+facebook.id +facebook.accessToken +twitter.id +twitter.accessToken.token ' +
    '+twitter.accessToken.tokenSecret +instagram.id +instagram.accessToken';
};