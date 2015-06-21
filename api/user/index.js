/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var userRoutes = require('express').Router();
var User = require('./user');

userRoutes.get('/:id', function(req, res) {

  process.nextTick(function() {

    if (typeof req.params.id === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) {
        res.status(401).send({ errors: [{ msg: 'Error finding user with id ' + req.params.id }] });
      }
      else {
        res.status(200).send({ user: user });
      }
    });
  });
});

userRoutes.use('/:id/circle', require('../circle'));

module.exports = userRoutes;