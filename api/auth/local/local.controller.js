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

// modelos
var User = require('../../user/user.model');

// Maneja la lógica necesaria para el login de un usuario Unify
module.exports.login = function(req, res) {

  process.nextTick(function() {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('password', 'Required').notEmpty();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(401).send({ errors: req.validationErrors() });
    }

    // Validamos nosql injection
    if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
      logger.warn('No SQL injection - email: ' + req.body.email + ' password: ' + req.body.password);
      return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
    }

    // Si no encontramos un usuario, no existe, error
    User.findOne({ email: req.body.email }, '+password')
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.body.email);
        return res.status(401).send({ errors: [{ msg: "User doesn't exist" }] });
      }
      else {
        // Si lo encontramos comparamos passwords
        user.comparePassword(req.body.password, function(err, isMatch) {
          // Si coincide, enviamos el token con el id del usuario loggeado
          if (!isMatch) {
            logger.warn('Wrong password for user: ' + user.toString());
            return res.status(401).send({ errors: [{ msg: 'Wrong password' }] });
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
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('name', 'Required').notEmpty();
    req.assert('password', 'Password should have at least 6 characters of length').len(6, 100);
    req.assert('confirm_password', 'Required').notEmpty();
    req.assert('confirm_password', 'Confirm password must be equal to password').equals(req.body.password);

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(401).send({ errors: req.validationErrors() });
    }

    // Validamos nosql injection
    if (typeof req.body.email !== 'string' || typeof req.body.name !== 'string' ||
      typeof req.body.password !== 'string' || typeof req.body.confirm_password !== 'string') {
      logger.warn('No SQL injection - email: ' + req.body.email + ' password: ' + req.body.password +
                  ' name: ' + req.body.name + ' confirmPassword: ' + req.body.confirm_password);
      return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
    }

    // Si no encontramos un usuario, creamos un usuario nuevo y le generamos un token con el id del usuario
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        logger.warn('User already exists: ' + existingUser);
        return res.status(409).send({ errors: [{ param: 'email', msg: 'Email is already taken' }] });
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
            return res.status(401).send({ errors: [{ msg: 'Error saving data ' + err }] });
          }
          else {
            user.password = undefined;
            user.created_at = undefined;
            user.updated_at = undefined;
            return jwt.createJWT(res, user);
          }
        });
      }
    });
  });
};