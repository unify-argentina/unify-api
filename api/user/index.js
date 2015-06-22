/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var userRoutes = require('express').Router();
var User = require('./user');

/**
 * @api {get} /api/user/:id Obtener Usuario
 * @apiGroup Usuarios
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} id Id del usuario
 *
 * @apiSuccess {Object} user Usuario
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *     {
 *        "user": {
 *          "mainCircle":"558748787f0a76cc4ca02a35",
 *          "email":"90joelmarquez@gmail.com",
 *          "name":"Joel",
 *          "_id":"558748767f0a76cc4ca02a34",
 *          "__v":0
 *        }
 *     }
 */
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