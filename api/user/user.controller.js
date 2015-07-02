/*
 * Este es el módulo que se encarga de controlar las acciones sobre un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var User = require('./user.model.js');

// Se encarga de obtener el usuario en base al id que se le pase por parámetro
module.exports.getUserById = function(req, res) {

  process.nextTick(function() {
    User
      .findOne({ _id: req.params.user_id })
      .populate('mainCircle')
      .exec(function(err, user) {
        if (err) {
          return res.status(401).send({ errors: [{ msg: 'Error finding user with id ' + req.params.id }] });
        }
        else {
          return res.status(200).send({ user: user });
        }
      });
  });
};

// Se encarga de actualizar el usuario en base al id que se le pase por parámetro
module.exports.updateUser = function (req, res) {

  process.nextTick(function () {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('password', 'Password should have at least 6 characters of length').len(6, 100);
    req.assert('confirm_password', 'Required').notEmpty();
    req.assert('confirm_password', 'Confirm password must be equal to password').equals(req.body.password);

    // Validamos errores
    if (req.validationErrors()) {
      return res.status(401).send({ errors: req.validationErrors() });
    }

    // Validamos nosql injection
    if (typeof req.body.email === 'object' || (typeof req.body.name && typeof req.body.name === 'object') ||
      typeof req.body.password === 'object' || typeof req.body.confirm_password === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    // Si no encontramos un usuario con ese email, está disponible
    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ errors: [{ param: 'email', msg: 'Email is already taken' }] });
      }
      else {
        // Encontramos un usuario con el id del token y le actualizamos los datos
        User.findOne({ _id: req.user })
          .populate('mainCircle')
          .exec(function (err, user) {
          user.email = req.body.email;
          user.password = req.body.password;
          user.name = req.body.name || user.name;
          user.save(function(err) {
            if (err) {
              return res.status(401).send({ errors: [{ msg: 'Error saving data ' + err }] });
            }
            else {
              user.password = undefined;
              return res.send({ user: user });
            }
          });
        });
      }
    });
  });
};

module.exports.getFriends = function (req, res) {

  process.nextTick(function () {

  });
};