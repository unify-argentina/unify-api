/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var userRoutes = require('express').Router();
var userController = require('./user.controller');
var User = require('./user.model.js');

// Esto lo que hace es verificar que cada vez que se envíe un user_id como parámetro en una ruta,
// coincida con el user que está en el request, previamente validado con el Json Web Token
userRoutes.param('user_id', function(req, res, next, userId) {
  // Validamos nosql injection
  if (typeof userId === 'object') {
    return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
  }

  // Si el req.user, ya habiendo pasado por la verificación del token es el mismo
  // que el del req.params.id, enviamos el user
  if (req.user !== userId) {
    return res.status(401).send({ errors: [{ msg: 'You are trying to find a different user' }]});
  }
  else {
    next();
  }
});

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
userRoutes.get('/:user_id', userController.getUserById);

userRoutes.use('/:user_id/circle', require('../circle'));

module.exports = userRoutes;