/*
 * Este módulo maneja todo lo que es la autenticación de los usuarios, así como también
 * los manejos de contraseñas, el reset y el update de las mismas y de los datos de los
 * usuarios
 * @author Joel Márquez
 * */
'use strict';

// requires
var jwt = require('./../util/jwt');

// modelos
var User = require('../../user/user.model');

// Maneja la lógica necesaria para el login de un usuario Unify
module.exports.login = function (req, res) {

  process.nextTick(function () {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('password', 'Required').notEmpty();
    req.assert('password', 'Only alphanumeric characters are allowed').isAscii();

    // Validamos errores
    if (req.validationErrors()) {
      return res.status(401).send({ errors: req.validationErrors() });
    }

    // Validamos nosql injection
    if (typeof req.body.email === 'object' || typeof req.body.password === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    // Si no encontramos un usuario, no existe, error
    User.findOne({ email: req.body.email }, '+password', function (err, user) {
      if (!user) {
        return res.status(401).send({ errors: [{ msg: "User doesn't exist" }] });
      }
      // Si lo encontramos comparamos passwords
      user.comparePassword(req.body.password, function (err, isMatch) {
        // Si coincide, enviamos el token con el id del usuario loggeado
        if (!isMatch) {
          return res.status(401).send({ errors: [{ msg: 'Wrong password' }] });
        }
        else {
          res.send({ token: jwt.createJWT(user) });
        }
      });
    });
  });
};

// Maneja la lógica necesaria para el signup de un usuario Unify
module.exports.signup = function (req, res) {

  process.nextTick(function () {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('name', 'Required').notEmpty();
    req.assert('name', 'Only alphanumeric characters are allowed').isAscii();
    req.assert('password', 'Password should have at least 6 characters of length').len(6, 100);
    req.assert('confirm_password', 'Required').notEmpty();
    req.assert('confirm_password', 'Confirm password must be equal to password').equals(req.body.password);

    // Validamos errores
    if (req.validationErrors()) {
      return res.status(401).send({ errors: req.validationErrors() });
    }

    // Validamos nosql injection
    if (typeof req.body.email === 'object' || typeof req.body.name === 'object' ||
      typeof req.body.password === 'object' || typeof req.body.confirm_password === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    // Si no encontramos un usuario, creamos un usuario nuevo y le generamos un token con el id del usuario
    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ errors: [{ param: 'email', msg: 'Email is already taken' }] });
      }
      var user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        validLocalUser: true
      });
      user.save(function (err) {
        if (err) {
          return res.status(401).send({ errors: [{ msg: 'Error saving data ' + err }] });
        }
        else {
          res.send({ token: jwt.createJWT(user) });
        }
      });
    });
  });
};