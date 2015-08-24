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

    validateSocialIds(req, res, 'creating');

    // Encontramos el círculo cuyo usuario es el que está en el request
    Circle.findOne({ _id: req.body.circle_id, user: req.user })
      .populate('user', User.socialFields())
      .exec(function(err, circle) {
      if (err || !circle) {
        logger.warn("Circle=" + req.body.circle_id + " doesn't exists or doesn't belong to current user=" + req.user);
        return res.status(400).send({ errors: [{ msg: "Circle doesn't exists or doesn't belong to current user" }] });
      }
      else {
        var contact = new Contact();
        saveContactData(req, res, contact, circle);
      }
    });
  });
};

// Devuelve el contacto pedido por Id
module.exports.getById = function(req, res) {

  process.nextTick(function() {
    return res.send({ contact: req.contact });
  });
};

// Se encarga de actualizar el contacto en base al id que se le pase por parámetro
module.exports.update = function(req, res) {

  process.nextTick(function() {
    validateParams(req, res);

    validateSocialIds(req, res, 'updating');

    // Revisamos que el usuario tenga efectivamente el círculo pasado por parámetro
    Circle.findOne({ _id: req.body.circle_id, user: req.user })
      .populate('user', User.socialFields())
      .exec(function(err, circle) {
        if (err || !circle) {
          logger.warn("Circle=" + req.body.circle_id + " doesn't exists or doesn't belong to current user=" + req.user);
          return res.status(400).send({ errors: [{ msg: "Circle doesn't exists or doesn't belong to current user" }] });
        }
        else {
          saveContactData(req, res, req.contact, circle);
        }
    });
  });
};

// Borra el contacto pasado por parámetro
module.exports.delete = function(req, res) {

  process.nextTick(function() {
    var contact = req.contact;
    contact.remove(function(err) {
      if (err) {
        logger.err(err);
        return res.status(400).send({ errors: [{ msg: 'Error removing contact ' + err }] });
      }
      else {
        return res.send({ contact: contact._id });
      }
    });
  });
};

// Valida que los parámetros sean correctos
var validateParams = function(req, res) {
  req.assert('name', 'Required').notEmpty();
  req.assert('picture', 'Required').notEmpty();
  req.assert('picture', 'It must be a valid URL').isURL();
  req.assert('circle_id', 'Required').notEmpty();

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + req.validationErrors());
    return res.status(400).send({ errors: req.validationErrors()});
  }

  // Validamos nosql injection
  if (typeof req.body.name !== 'string' || typeof req.body.circle_id !== 'string' || typeof req.body.picture !== 'string') {
    logger.warn('No SQL injection - name: ' + req.body.name + ' circle_id: ' + req.body.circle_id +
      ' picture: ' + req.body.picture);
    return res.status(400).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }
};

var validateSocialIds = function(req, res, text) {

  validateSocialIdsExistance(req, res, text);

  validateSocialIdsFormat(req, res);
};

// Validamos que tenga por lo menos un id de una red social
var validateSocialIdsExistance = function(req, res, text) {
  if (!req.body.facebook_id && !req.body.twitter_id && !req.body.instagram_id) {
    logger.warn("Requester didn't suplied a facebook, twitter or instagram id for creating a contact");
    return res.status(400).send({ errors: [{ msg:
    'You have to suply a facebook, twitter or instagram id for ' + text + ' a contact' }] });
  }
};

// Validamos que si hay alguno, tenga un formato válido
var validateSocialIdsFormat = function(req, res) {
  if (req.body.facebook_id && typeof req.body.facebook_id !== 'string' ||
    req.body.facebook_display_name && typeof req.body.facebook_display_name !== 'string' ||
    req.body.twitter_id && typeof req.body.twitter_id !== 'string' ||
    req.body.twitter_username && typeof req.body.twitter_username !== 'string' ||
    req.body.instagram_id && typeof req.body.instagram_id !== 'string' ||
    req.body.instagram_username && typeof req.body.instagram_username !== 'string') {
    logger.warn('No SQL injection - facebook_id: ' + req.body.facebook_id +
      ' twitter_id: ' + req.body.twitter_id + ' instagram_id: ' + req.body.instagram_id);
    return res.status(400).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }
};

// Salva el contacto y lo envía al cliente
var saveContactData = function(req, res, contact, circle) {

  var user = circle.user;
  // Validamos que el usuario tenga las cuentas asociadas para poder
  // crear un contacto con los ids pasados por parámetro
  validateUserSocialAccounts(req, res, contact, user);

  // Si la validación está ok, copiamos los datos al contacto y lo devolvemos como json
  contact.name = req.body.name;
  contact.picture = req.body.picture;
  contact.circle = req.body.circle_id;
  contact.user = req.user;
  contact.parents = getContactParents(circle);
  contact.save(function(err) {
    if (err) {
      logger.err(err);
      return res.status(400).send({ errors: [{ msg: 'Error saving data ' + err }] });
    }
    else {
      logger.debug('Contact for user: ' + req.user + ' created successfully: ' + contact.toString());
      contact.created_at = undefined;
      contact.updated_at = undefined;
      return res.send({ contact: contact });
    }
  });
};

// Este método genera los ancestros de un contacto (el círculo en el cual fue creado más los ancestros del círculo)
var getContactParents = function(circle) {
  var parents = [];
  var contactAncestors = [circle._id];
  contactAncestors.push.apply(contactAncestors, circle.ancestors);
  parents.push({
    circle: circle._id,
    ancestors: contactAncestors
  });
  return parents;
};

// Este método chequea que si se le pasó un social_id, efectivamente el usuario tenga esa cuenta linkeada
var validateUserSocialAccounts = function(req, res, contact, user) {

  // Si vino como parámetro el id de facebook del contacto y el usuario tiene asociado facebook, lo agregamos
  if (typeof req.body.facebook_id === 'string') {
    if (user.hasLinkedAccount('facebook')) {
      contact.facebook.id = req.body.facebook_id;
      contact.facebook.display_name = req.body.facebook_display_name;
    }
    // Sino, devolvemos error ya que no tiene linkeada esa cuenta
    else {
      return res.status(400).send({ errors: [{ msg: 'You have to link your facebook account in order to create a contact with a facebook_id' }] });
    }
  }

  // Si vino como parámetro el id de twitter del contacto y el usuario tiene asociado twitter, lo agregamos
  if (typeof req.body.twitter_id === 'string') {
    if (user.hasLinkedAccount('twitter')) {
      contact.twitter.id = req.body.twitter_id;
      contact.twitter.username = req.body.twitter_username;
    }
    // Sino, devolvemos error ya que no tiene linkeada esa cuenta
    else {
      return res.status(400).send({ errors: [{ msg: 'You have to link your twitter account in order to create a contact with a twitter_id' }] });
    }
  }

  // Si vino como parámetro el id de instagram del contacto y el usuario tiene asociado instagram, lo agregamos
  if (typeof req.body.instagram_id === 'string') {
    if (user.hasLinkedAccount('instagram')) {
      contact.instagram.id = req.body.instagram_id;
      contact.instagram.username = req.body.instagram_username;
    }
    // Sino, devolvemos error ya que no tiene linkeada esa cuenta
    else {
      return res.status(400).send({ errors: [{ msg: 'You have to link your instagram account in order to create a contact with a instagram_id' }] });
    }
  }
};