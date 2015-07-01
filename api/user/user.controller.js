/*
 * Este es el módulo que se encarga de controlar las acciones sobre un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var User = require('./user.model.js');

module.exports.getUserById = function(req, res) {

  process.nextTick(function() {

    // Nos aseguramos de que no nos manden objetos en el request
    if (typeof req.params.id === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    // Si el req.user, ya habiendo pasado por la verificación del token es el mismo
    // que el del req.params.id, enviamos el user
    if (req.user === req.params.id) {
      User
        .findOne({ _id: req.params.id })
        .populate('mainCircle')
        .exec(function(err, user) {
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
};