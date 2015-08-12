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
      .populate('main_circle')
      .exec(function(err, user) {
        if (err || !user) {
          logger.warn('User not found: ' + req.user);
          return res.status(400).send({ errors: [{ msg: 'User not found' }] });
        }
        else {
          logger.info('Get user by id: ' + req.params.user_id);
          return res.send({ user: user });
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
      return res.status(400).send({ errors: req.validationErrors() });
    }

    // Validamos nosql injection
    if (typeof req.body.email !== 'string' || (typeof req.body.name && typeof req.body.name !== 'string') ||
      typeof req.body.password !== 'string' || typeof req.body.confirm_password !== 'string') {
      logger.warn('No SQL injection - email: ' + req.body.email + ' password: ' + req.body.password);
      return res.status(400).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
    }

    // Si no encontramos un usuario con ese email, está disponible
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser && !existingUser._id.equals(req.user)) {
        logger.info('User already exists: ' + existingUser);
        return res.status(400).send({ errors: [{ param: 'email', msg: 'Email is already taken' }] });
      }
      else {
        // Encontramos un usuario con el id del token y le actualizamos los datos
        User.findOne({ _id: req.user })
          .populate('main_circle')
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
                  return res.status(400).send({ errors: [{ msg: 'Error saving data ' + err }] });
                }
                else {
                  user.password = undefined;
                  logger.info('Updated user: ' + user.toString());
                  user.created_at = undefined;
                  user.updated_at = undefined;
                  return res.send({ user: user });
                }
              });
            }
        });
      }
    });
  });
};