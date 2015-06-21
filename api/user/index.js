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

    // Nos aseguramos de que no nos manden objetos en el request
    if (typeof req.params.id === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    // Si el req.user, ya habiendo pasado por la verificación del token es el mismo
    // que el del req.params.id, enviamos el user
    if (req.user === req.params.id) {
      User.find({ _id: req.params.id }, function(err, user) {
        if (err) {
          res.status(401).send({ errors: [{ msg: 'Error finding user with id ' + req.params.id }] });
        }
        else {
          res.status(200).send({ user: user });
        }
      });
    }
    else {
      res.status(401).send({ errors: [{ msg: 'You are trying to find a different user' }]});
    }
  });
});

userRoutes.use('/:id/circle', require('../circle'));

module.exports = userRoutes;