/*
 * Este módulo maneja todo lo que es la autenticación de los usuarios, así como también
 * los manejos de contraseñas, el reset y el update de las mismas y de los datos de los
 * usuarios
 * @author Joel Márquez
 * */
'use strict';

// requires
var jwt = require('./../util/jwt');
var logger = require('../../../config/logger');
var notificationsController = require('../../email/notifications.controller');

// modelos
var User = require('../../user/user.model');

// Maneja la lógica necesaria para el login de un usuario Unify
module.exports.login = function(req, res) {

  process.nextTick(function() {
    req.assert('email', 'Es necesaria una dirección de email válida').isEmail();
    req.assert('password', 'Es necesaria una contraseña válida').isString();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
      return res.status(400).send({ errors: req.validationErrors() });
    }

    // Si no encontramos un usuario, no existe, error
    User.findOne({ email: req.body.email }, '+password')
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.body.email);
        return res.status(400).send({ errors: [{ msg: 'El usuario con el email ' + req.body.email + ' no existe' }] });
      }
      else {
        // Si lo encontramos comparamos passwords
        user.comparePassword(req.body.password, function(err, isMatch) {
          // Si coincide, enviamos el token con el id del usuario loggeado
          if (!isMatch) {
            logger.warn('Wrong password for user: ' + user.toString());
            return res.status(400).send({ errors: [{ msg: 'La contraseña es incorrecta' }] });
          }
          else {
            logger.debug('User logged in successfully: ' + user.toString());
            user.password = undefined;
            return jwt.createJWT(res, user);
          }
        });
      }
    });
  });
};

// Maneja la lógica necesaria para el signup de un usuario Unify
module.exports.signup = function(req, res) {

  process.nextTick(function() {
    req.assert('email', 'Es necesaria una dirección de email válida').isEmail();
    req.assert('name', 'Es necesario un nombre válido').isString();
    req.assert('password', 'Es necesaria una contraseña válida').isString();
    req.assert('password', 'La contraseña debe tener entre 6 y 100 caracteres de longitud').len(6, 100);
    req.assert('confirm_password', 'Es necesaria una confirmación de contraseña válida').isString();
    req.assert('confirm_password', 'La confirmación de la contraseña debe ser igual a la contraseña').equals(req.body.password);

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
      return res.status(400).send({ errors: req.validationErrors() });
    }

    // Si no encontramos un usuario, creamos un usuario nuevo y le generamos un token con el id del usuario
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        logger.warn('User already exists: ' + existingUser);
        return res.status(400).send({ errors: [{ param: 'email', msg: 'El email ' + req.body.email + ' ya está registrado en Unify' }] });
      }
      else {
        var user = new User({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          valid_local_user: true
        });
        user.save(function(err) {
          if (err) {
            logger.error(err);
            return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
          }
          else {
            user.password = undefined;
            user.created_at = undefined;
            user.updated_at = undefined;

            notificationsController.sendSignupEmailToUser(user);
            return jwt.createJWT(res, user);
          }
        });
      }
    });
  });
};