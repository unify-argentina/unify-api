/*
 * Este es el módulo que se encarga de controlar las acciones sobre un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var async = require('async');
var logger = require('../../config/logger');
var jwt = require('../auth/util/jwt');
var notificationsController = require('../email/notifications.controller');

// modelos
var User = require('./user.model.js');

// Se encarga de obtener el usuario en base al id que se le pase por parámetro
module.exports.getById = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.params.user_id })
      .populate('main_circle')
      .exec(function(err, user) {
        if (err || !user) {
          logger.warn('User not found: ' + req.user_id);
          return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
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
    req.assert('email', 'Email válido').optional().isEmail();
    req.assert('name', 'Nombre válido').optional().isString();
    req.assert('picture', 'URL de foto válida').optional().isURL();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
      return res.status(400).send({ errors: req.validationErrors() });
    }

    // Si no encontramos un usuario con ese email, está disponible
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser && !existingUser._id.equals(req.user_id)) {
        logger.debug('User already exists: ' + existingUser);
        return res.status(400).send({ errors: [{ param: 'email', msg: 'El email ' + req.body.email + ' ya está registrado en Unify' }] });
      }
      else {
        // Encontramos un usuario con el id del token y le actualizamos los datos
        User.findOne({ _id: req.user_id })
          .populate('main_circle')
          .exec(function(err, user) {
            if (err || !user) {
              logger.warn('User not found: ' + req.user_id);
              return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
            }
            else {
              var reset = user.shouldResetVerificatedAccount(req.body.email);
              if (reset) {
                user.verified = false;
              }
              user.email = req.body.email || user.email;
              user.name = req.body.name || user.name;
              user.picture = req.body.picture || user.picture;
              user.save(function(err) {
                if (err) {
                  logger.error(err);
                  return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
                }
                else {
                  logger.debug('Updated user: ' + user.toString());
                  user.created_at = undefined;
                  user.updated_at = undefined;

                  if (reset) {
                    notificationsController.sendVerifyEmailToUser(user);
                  }
                  return jwt.createJWT(res, user);
                }
              });
            }
        });
      }
    });
  });
};

// Actualiza la password del usuario
module.exports.updatePassword = function(req, res) {

  process.nextTick(function() {
    req.assert('password', 'Es necesaria una contraseña válida').isString();
    req.assert('password', 'La contraseña debe tener entre 6 y 100 caracteres de longitud').len(6, 100);
    req.assert('confirm_password', 'Es necesaria una confirmación de contraseña válida').isString();
    req.assert('confirm_password', 'La confirmación de la contraseña debe ser igual a la contraseña').equals(req.body.password);

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
      return res.status(400).send({ errors: req.validationErrors() });
    }

    // Encontramos un usuario con el id del token y le actualizamos la password
    User.findOne({ _id: req.user_id }, '+password')
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
      }
      else {

        // Verificamos que si el usuario es válido, entonces pase la contraseña anterior
        if (user.valid_local_user) {
          req.assert('old_password', 'Es necesario ingresar la contraseña anterior').isString();
          req.assert('old_password', 'La nueva contraseña no puede ser igual a la anterior').notEquals(req.body.password);
        }

        // Validamos errores
        if (req.validationErrors()) {
          logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
          return res.status(400).send({ errors: req.validationErrors() });
        }

        if (req.body.old_password) {
          // Si lo encontramos comparamos passwords
          user.comparePassword(req.body.old_password, function(err, isMatch) {
            // Si coincide, le actualizamos la password y lo guardamos
            if (!isMatch) {
              logger.warn('Wrong password for user: ' + user.toString());
              return res.status(400).send({ errors: [{ msg: 'La contraseña es incorrecta' }] });
            }
            else {
              user.password = req.body.password;
              user.save(function(err) {
                if (err) {
                  logger.error(err);
                  return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
                }
                else {
                  logger.debug('Updated user: ' + user.toString());
                  user.created_at = undefined;
                  user.updated_at = undefined;
                  user.password = undefined;
                  return jwt.createJWT(res, user);
                }
              });
            }
          });
        }
        else {
          user.valid_local_user = true;
          user.save(function(err) {
            if (err) {
              logger.error(err);
              return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
            }
            else {
              logger.debug('Updated user: ' + user.toString());
              user.created_at = undefined;
              user.updated_at = undefined;
              user.password = undefined;
              return jwt.createJWT(res, user);
            }
          });
        }
      }
    });
  });
};