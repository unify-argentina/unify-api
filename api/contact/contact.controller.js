/*
 * Este es el módulo que se encarga de controlar las acciones sobre un contacto
 * @author Joel Márquez
 * */
'use strict';

// requires
var logger = require('../../config/logger');
var _ = require('lodash');

// modelos
var Contact = require('./contact.model');
var User = require('../user/user.model');
var Circle = require('../circle/circle.model');

module.exports.list = function (req, res) {

  process.nextTick(function () {
    Contact.find({ user: req.user_id })
      .populate('parents.circle')
      .populate('parents.ancestors')
      .exec(function(err, contacts) {
        if (err || !contacts) {
          logger.warn("You are trying to find a contact=" + contactId + " that doesn't belong to you");
          return res.status(400).send({ errors: [{ msg: 'Estás queriendo acceder a un contacto que no te pertenece' }] });
        }
        // Si pertenece, incorporamos el id al request y continuamos
        else {
          return res.send({
            contacts: {
              count: contacts.length,
              list: contacts
            }
          });
        }
      });
  });
};

// Crea un contacto
module.exports.create = function(req, res) {

  process.nextTick(function() {

    validateParams(req, res);

    validateSocialIds(req, res, 'crear');

    User.findOne({ _id: req.user_id })
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
      }
      else {
        // Encontramos el grupo cuyo usuario es el que está en el request
        Circle.find({ _id: { $in: req.body.circles_ids }, user: req.user_id })
          .populate('user', User.socialFields())
          .exec(function(err, circles) {
          if (err || !circles) {
            logger.warn("Circles don't exists or don't belong to current user=" + req.user_id);
            return res.status(400).send({ errors: [{ msg: 'Los grupos especificados no pertenecen al usuario actual' }] });
          }
          else if (req.body.circles_ids.length > circles.length) {
            logger.warn("One of the circles doesn't belong to current user=" + req.user_id);
            return res.status(400).send({ errors: [{ msg: 'Alguno de los grupos especificados no pertenece al usuario actual' }] });
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

// Crea múltiples contactos en el círculo principal basándose en los user ids pasados por parámetro
module.exports.createMultiple = function (req, res) {

  process.nextTick(function () {
    req.assert('user_ids', 'Ids de usuarios válidos requeridos').isStringArray();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors()});
    }

    User.findOne({ _id: req.user_id })
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
      }
      // Una vez que encontramos el usuario logueado, buscamos los usuarios con los ids pasados pos parámetro
      else {
        var userIdsQuery = _.map(req.body.user_ids, function(userId) { return { _id: userId }; });

        User.find({ $or: userIdsQuery }, User.socialFields(), function(err, users) {
          if (err || !users || users.length === 0) {
            logger.warn('Users not found');
            return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar los usuarios buscados' }] });
          }
          else {
            var circle = user.main_circle;

            // Una vez que los encontramos, los mapeamos a un contacto de Unify para crearlos como contactos del usuario
            var contactsToCreate = _.map(users, function(user) {

              var contact = new Contact();

              contact.name = user.name;
              contact.picture = user.picture || '';
              contact.user = req.user_id;
              contact.parents = Contact.getContactParentsFromCircles([circle]);

              if (user.hasLinkedAccount('facebook')) {
                contact.facebook.id = user.facebook.id;
                contact.facebook.display_name = user.facebook.display_name;
              }
              if (user.hasLinkedAccount('twitter')) {
                contact.twitter.id = user.twitter.id;
                contact.twitter.username = user.twitter.username;
              }
              if (user.hasLinkedAccount('instagram')) {
                contact.instagram.id = user.instagram.id;
                contact.instagram.username = user.instagram.username;
              }
              if (user.hasLinkedAccount('google')) {
                contact.google.email = user.google.email;
              }

              return contact;
            });

            // Por último los insertamos a todos
            logger.debug('contacts to create: ' + JSON.stringify(contactsToCreate));
            Contact.create(contactsToCreate, function(err, contacts) {
              if (err || !contacts || contacts.length !== contactsToCreate.length) {
                logger.warn("Couldn't create multiple contacts for user: " + req.user_id);
                return res.status(400).send({ errors: [{ msg: 'No hemos podido agregar los contactos solicitados' }] });
              }
              else {
                return res.sendStatus(200);
              }
            });
          }
        });
      }
    });
  });
};

// Devuelve el contacto pedido por Id
module.exports.getById = function(req, res) {

  process.nextTick(function() {

    req.contact.user = undefined;

    return res.send({ contact: req.contact });
  });
};

// Se encarga de actualizar el contacto en base al id que se le pase por parámetro
module.exports.update = function(req, res) {

  process.nextTick(function() {

    validateParams(req, res);

    validateSocialIds(req, res, 'actualizar');

    User.findOne({ _id: req.user_id })
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({errors: [{msg: 'No pudimos encontrar el usuario que estás buscando'}]});
      }
      else {
        // Revisamos que el usuario tenga efectivamente el grupo pasado por parámetro
        Circle.find({ _id: { $in: req.body.circles_ids }, user: req.user_id })
          .populate('user', User.socialFields())
          .exec(function(err, circles) {
          if (err || !circles) {
            logger.warn("Circles don't exists or don't belong to current user=" + req.user_id);
            return res.status(400).send({ errors: [{ msg: 'Los grupos especificados no pertenecen al usuario actual' }] });
          }
          else if (req.body.circles_ids.length > circles.length) {
            logger.warn("One of the circles doesn't belong to current user=" + req.user_id);
            return res.status(400).send({ errors: [{ msg: 'Alguno de los grupos especificados no pertenece al usuario actual' }] });
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
  req.assert('name', 'Es necesario un nombre válido').isString();
  req.assert('picture', 'URL de foto válida requerida').isURL();
  req.assert('circles_ids', 'Ids de grupos válidos requeridos').isStringArray();

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
    logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
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
  contact.user = req.user_id;
  contact.parents = Contact.getContactParentsFromCircles(circles);
  contact.save(function(err) {
    if (err) {
      logger.err(err);
      return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
    }
    else {
      logger.debug('Contact for user: ' + req.user_id + (isUpdate ? ' updated' : ' created') + ' successfully: ' + contact.toString());
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