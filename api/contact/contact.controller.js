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

    validateSocialIds(req, res, 'crear');

    User.findOne({ _id: req.user })
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
      }
      else {
        // Encontramos el círculo cuyo usuario es el que está en el request
        Circle.find({ _id: { $in: req.body.circles_ids }, user: req.user })
          .populate('user', User.socialFields())
          .exec(function(err, circles) {
          if (err || !circles) {
            logger.warn("Circles don't exists or don't belong to current user=" + req.user);
            return res.status(400).send({ errors: [{ msg: 'Los círculos especificados no pertenecen al usuario actual' }] });
          }
          else if (req.body.circles_ids.length > circles.length) {
            logger.warn("One of the circles doesn't belong to current user=" + req.user);
            return res.status(400).send({ errors: [{ msg: 'Alguno de los círculos especificados no pertenece al usuario actual' }] });
          }
          else {
            var contact = new Contact();
            saveContactData(req, res, contact, circles, false);
          }
        });
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

    validateSocialIds(req, res, 'actualizar');

    User.findOne({ _id: req.user })
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({errors: [{msg: 'El usuario no ha podido ser encontrado'}]});
      }
      else {
        // Revisamos que el usuario tenga efectivamente el círculo pasado por parámetro
        Circle.find({ _id: { $in: req.body.circles_ids }, user: req.user })
          .populate('user', User.socialFields())
          .exec(function(err, circles) {
          if (err || !circles) {
            logger.warn("Circles don't exists or don't belong to current user=" + req.user);
            return res.status(400).send({ errors: [{ msg: 'Los círculos especificados no pertenecen al usuario actual' }] });
          }
          else if (req.body.circles_ids.length > circles.length) {
            logger.warn("One of the circles doesn't belong to current user=" + req.user);
            return res.status(400).send({ errors: [{ msg: 'Alguno de los círculos especificados no pertenece al usuario actual' }] });
          }
          else {
            saveContactData(req, res, req.contact, circles, true);
          }
        });
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
        return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
      }
      else {
        return res.send({ contact: contact._id });
      }
    });
  });
};

// Valida que los parámetros sean correctos
var validateParams = function(req, res) {
  req.assert('name', 'Nombre válido requerido').isString();
  req.assert('picture', 'URL de foto válida requerida').isURL();
  req.assert('circles_ids', 'Ids de círculos válidos requeridos').isStringArray();

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + req.validationErrors());
    return res.status(400).send({ errors: req.validationErrors()});
  }
};

var validateSocialIds = function(req, res, text) {

  validateSocialIdsExistance(req, res, text);

  validateSocialIdsFormat(req, res);
};

// Validamos que tenga por lo menos un id de una red social
var validateSocialIdsExistance = function(req, res, text) {
  if (!req.body.facebook_id && !req.body.twitter_id && !req.body.instagram_id && !req.body.google_email) {
    logger.warn("Requester didn't suplied a facebook, Twitter or Instagram id for creating a contact");
    return res.status(400).send({ errors: [{ msg:
    'Tienes que proveer al menos un id de Facebook, de Twitter, de Instagram o de Google para ' + text + ' un contacto' }] });
  }
};

// Validamos que si hay alguno, tenga un formato válido
var validateSocialIdsFormat = function(req, res) {
  if (req.body.facebook_id) {
    req.assert('facebook_id', 'Id de Facebook válido').isString();
    req.assert('facebook_display_name', 'Nombre de Facebook válido').isString();
  }
  if (req.body.twitter_id) {
    req.assert('twitter_id', 'Id de Twitter válido').isString();
    req.assert('twitter_username', 'Nombre de usuario de Twitter válido').isString();
  }
  if (req.body.instagram_id) {
    req.assert('instagram_id', 'Id de Instagram válido').isString();
    req.assert('instagram_username', 'Nombre de usuario de Instagram válido').isString();
  }
  req.assert('email', 'Email válido').optional().isEmail();

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + req.validationErrors());
    return res.status(400).send({ errors: req.validationErrors()});
  }
};

// Salva el contacto y lo envía al cliente
var saveContactData = function(req, res, contact, circles, isUpdate) {

  var user = isUpdate ? contact.user : circles[0].user;
  // Validamos que el usuario tenga las cuentas asociadas para poder
  // crear un contacto con los ids pasados por parámetro
  validateUserSocialAccounts(req, res, contact, user);

  // Si la validación está ok, copiamos los datos al contacto y lo devolvemos como json
  contact.name = req.body.name;
  contact.picture = req.body.picture;
  contact.user = req.user;
  contact.parents = Contact.getContactParentsFromCircles(circles);
  contact.save(function(err) {
    if (err) {
      logger.err(err);
      return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
    }
    else {
      logger.debug('Contact for user: ' + req.user + (isUpdate ? ' updated' : ' created') + ' successfully: ' + contact.toString());
      contact.created_at = undefined;
      contact.updated_at = undefined;
      return res.send({ contact: contact });
    }
  });
};

// Este método chequea que si se le pasó un social_id, efectivamente el usuario tenga esa cuenta linkeada
var validateUserSocialAccounts = function(req, res, contact, user) {

  contact.cleanSocialAccounts();

  // Si vino como parámetro el id de Facebook del contacto y el usuario tiene asociado Facebook, lo agregamos
  if (typeof req.body.facebook_id === 'string') {
    if (user.hasLinkedAccount('facebook')) {
      contact.facebook.id = req.body.facebook_id;
      contact.facebook.display_name = req.body.facebook_display_name;
    }
    // Sino, devolvemos error ya que no tiene linkeada esa cuenta
    else {
      return res.status(400).send({ errors: [{ msg: 'Debes vincular tu cuenta de Facebook para poder crear un contacto con una cuenta de Facebook' }] });
    }
  }

  // Si vino como parámetro el id de Twitter del contacto y el usuario tiene asociado Twitter, lo agregamos
  if (typeof req.body.twitter_id === 'string') {
    if (user.hasLinkedAccount('twitter')) {
      contact.twitter.id = req.body.twitter_id;
      contact.twitter.username = req.body.twitter_username;
    }
    // Sino, devolvemos error ya que no tiene linkeada esa cuenta
    else {
      return res.status(400).send({ errors: [{ msg: 'Debes vincular tu cuenta de Twitter para poder crear un contacto con una cuenta de Twitter' }] });
    }
  }

  // Si vino como parámetro el id de Instagram del contacto y el usuario tiene asociado Instagram, lo agregamos
  if (typeof req.body.instagram_id === 'string') {
    if (user.hasLinkedAccount('instagram')) {
      contact.instagram.id = req.body.instagram_id;
      contact.instagram.username = req.body.instagram_username;
    }
    // Sino, devolvemos error ya que no tiene linkeada esa cuenta
    else {
      return res.status(400).send({ errors: [{ msg: 'Debes vincular tu cuenta de Instagram para poder crear un contacto con una cuenta de Instagram' }] });
    }
  }

  // Si vino como parámetro el email del contacto y el usuario tiene asociado Google, lo agregamos
  if (typeof req.body.email === 'string') {
    if (user.hasLinkedAccount('google')) {
      contact.google.email = req.body.email;
    }
    // Sino, devolvemos error ya que no tiene linkeada esa cuenta
    else {
      return res.status(400).send({ errors: [{ msg: 'Debes vincular tu cuenta de Google para poder crear un contacto con un email' }] });
    }
  }
};