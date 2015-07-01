/*
 * Este es el módulo que se encarga de controlar las acciones sobre un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var User = require('./user.model.js');

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