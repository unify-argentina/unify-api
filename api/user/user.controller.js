/*
 * Este es el módulo que se encarga de controlar las acciones sobre un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var facebookFriends = require('../auth/facebook/facebook.friends.controller');
var instagramFriends = require('../auth/instagram/instagram.friends.controller');
var twitterFriends = require('../auth/twitter/twitter.friends.controller');
var async = require('async');
var logger = require('../../config/logger');

// modelos
var User = require('./user.model.js');

// Se encarga de obtener el usuario en base al id que se le pase por parámetro
module.exports.getById = function(req, res) {

  process.nextTick(function() {
    User
      .findOne({ _id: req.params.user_id })
      .populate('mainCircle')
      .exec(function(err, user) {
        if (err || !user) {
          logger.warn('User not found: ' + req.user);
          return res.status(400).send({errors: [{msg: 'User not found'}]});
        }
        else {
          logger.debug('Get user by id: ' + req.params.user_id);
          return res.status(200).send({ user: user });
        }
      });
  });
};

// Se encarga de actualizar el usuario en base al id que se le pase por parámetro
module.exports.update = function(req, res) {

  process.nextTick(function() {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('password', 'Password should have at least 6 characters of length').len(6, 100);
    req.assert('confirm_password', 'Required').notEmpty();
    req.assert('confirm_password', 'Confirm password must be equal to password').equals(req.body.password);

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(401).send({ errors: req.validationErrors() });
    }

    // Validamos nosql injection
    if (typeof req.body.email !== 'string' || (typeof req.body.name && typeof req.body.name !== 'string') ||
      typeof req.body.password !== 'string' || typeof req.body.confirm_password !== 'string') {
      logger.warn('No SQL injection - email: ' + req.body.email + ' password: ' + req.body.password);
      return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
    }

    // Si no encontramos un usuario con ese email, está disponible
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        logger.debug('User already exists: ' + existingUser);
        return res.status(409).send({ errors: [{ param: 'email', msg: 'Email is already taken' }] });
      }
      else {
        // Encontramos un usuario con el id del token y le actualizamos los datos
        User.findOne({ _id: req.user })
          .populate('mainCircle')
          .exec(function(err, user) {
            if (err || !user) {
              logger.warn('User not found: ' + req.user);
              return res.status(400).send({ errors: [{ msg: 'User not found' }] });
            }
            else {
              user.email = req.body.email;
              user.password = req.body.password;
              user.name = req.body.name || user.name;
              user.save(function(err) {
                if (err) {
                  logger.error(err);
                  return res.status(401).send({ errors: [{ msg: 'Error saving data ' + err }] });
                }
                else {
                  user.password = undefined;
                  logger.debug('Updated user: ' + user.toString());
                  return res.send({ user: user });
                }
              });
            }
        });
      }
    });
  });
};

// Se encarga de devolver los amigos de las redes sociales que tenga conectadas
module.exports.getFriends = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user }, selectFields(), function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        // Una vez que encontramos al usuario, mandamos a consultar los amigos por cada red social que tenga
        // asociada el usuario
        logger.debug('Searching for friends');
        async.parallel({
          facebook: function(callback) {
            if (user.hasLinkedAccount('facebook')) {
              facebookFriends.getFriends(user.facebook.accessToken, user.facebook.id, function(err, results) {
                callback(err, results);
              });
            }
            // Si no tiene linkeada la cuenta de Facebook, no devolvemos nada
            else {
              callback(null, null);
            }
          },
          instagram: function(callback) {
            if (user.hasLinkedAccount('instagram')) {
              instagramFriends.getFriends(user.instagram.accessToken, user.instagram.id, function(err, results) {
                callback(err, results);
              });
            }
            // Si no tiene linkeada la cuenta de Instagram, no devolvemos nada
            else {
              callback(null, null);
            }
          },
          twitter: function(callback) {
            if (user.hasLinkedAccount('twitter')) {
              twitterFriends.getFriends(user.twitter.accessToken, user.twitter.id, function(err, results) {
                callback(err, results);
              });
            }
            // Si no tiene linkeada la cuenta de Twitter, no devolvemos nada
            else {
              callback(null, null);
            }
          }
        },
        // Una vez tenemos todos los resultados, devolvemos un JSON con los mismos
        function(err, results) {
          if (err) {
            logger.warn('Error searching friends ' + err);
            return res.status(400).send({ errors: [{ msg: 'There was an error obtaining user friends' }] });
          }
          else {
            sendFriendsResponseFromResults(res, results);
          }
        });
      }
    });
  });
};

// Devuelve los campos del usuario que van a servir para traer a los amigos de las redes sociales
var selectFields = function() {
  return 'facebook.id facebook.accessToken twitter.id twitter.accessToken.token ' +
    'twitter.accessToken.tokenSecret instagram.id instagram.accessToken';
};

// Envía al cliente los amigos del usuario
var sendFriendsResponseFromResults = function(res, results) {
  var friends = {};
  if (results.facebook) {
    friends.facebook = results.facebook;
  }
  if (results.instagram) {
    friends.instagram = results.instagram;
  }
  if (results.twitter) {
    friends.twitter = results.twitter;
  }
  return res.send({
    friends: friends
  });
};