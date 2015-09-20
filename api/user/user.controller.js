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
          return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
        }
        else {
          logger.debug('Get user by id: ' + req.params.user_id);
          return res.send({ user: user });
        }
      });
  });
};

// Se encarga de actualizar el usuario en base al id que se le pase por parámetro
module.exports.update = function(req, res) {

  process.nextTick(function() {
    req.assert('email', 'Email válido requerido').isEmail();
    req.assert('name', 'Nombre válido requerido').isString();
    req.assert('password', 'Password válido requerido').isString();
    req.assert('password', 'Password debe tener entre 6 y 100 caracteres de longitud').len(6, 100);
    req.assert('confirm_password', 'Confirmación de password válido requerido').isString();
    req.assert('confirm_password', 'Confirmación de password debe ser igual al password').equals(req.body.password);
    req.assert('picture', 'URL de foto válida requerida').optional().isURL();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(400).send({ errors: req.validationErrors() });
    }

    // Si no encontramos un usuario con ese email, está disponible
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser && !existingUser._id.equals(req.user)) {
        logger.debug('User already exists: ' + existingUser);
        return res.status(400).send({ errors: [{ param: 'email', msg: 'El email ' + req.body.email + ' ya está registrado en Unify' }] });
      }
      else {
        // Encontramos un usuario con el id del token y le actualizamos los datos
        User.findOne({ _id: req.user })
          .populate('main_circle')
          .exec(function(err, user) {
            if (err || !user) {
              logger.warn('User not found: ' + req.user);
              return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
            }
            else {
              user.email = req.body.email;
              user.password = req.body.password;
              user.name = req.body.name || user.name;
              user.picture = req.body.picture || user.picture;
              user.save(function(err) {
                if (err) {
                  logger.error(err);
                  return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
                }
                else {
                  user.password = undefined;
                  logger.debug('Updated user: ' + user.toString());
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