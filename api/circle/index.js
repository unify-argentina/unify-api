/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var circleRoutes = require('express').Router();
var circleController = require('./circle.controller');
var logger = require('../../config/logger');

// modelos
var User = require('../user/user.model');
var Circle = require('./circle.model');

// Esto lo que hace es verificar que cada vez que se envíe un circle_id como parámetro en una ruta,
// efectivamente pertenezca al usuario loggeado
circleRoutes.param('circle_id', function(req, res, next, circleId) {
  // Validamos nosql injection
  if (typeof circleId === 'object') {
    return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
  }

  // Buscamos el usuario del request y verificamos que el circle_id pertenezca a este usuario
  User.findOne({ _id: req.user }, function(err, user) {
    if (err || !user) {
      logger.warn('User not found: ' + req.user);
      return res.status(400).send({ errors: [{ msg: 'User not found' }] });
    }
    else {
      user.hasCircleWithId(circleId, function(success, foundCircle) {
        if (success) {
          req.circle = foundCircle._id;
          next();
        }
        else {
          return res.status(401).send({ errors: [{ msg: "You are trying to find a circle that doesn't belong to you" }]});
        }
      });
    }
  });
});

/**
 * @api {get} /api/user/:id/circle Crear un circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} id Id del usuario
 * @apiParam {String} name Nombre del circulo a crear
 * @apiParam {String} parent_id Id del circulo padre
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "name":"Amigos",
 *      "parent_id":"55936a0460bb409c379800b7"
 *    }
 *
 * @apiSuccess {Object} circle Circulo creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "circle": {
 *        "__v":0,
 *        "parent":
 *        "55936a0460bb409c379800b7",
 *        "name":"Amigos",
 *        "_id":"55936a8960bb409c379800b8",
 *        "contacts":[]
 *      }
 *    }
 */
circleRoutes.post('/', circleController.createCircle);

/**
 * @api {get} /api/user/:user_id/circle/:circle_id Obtener circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} circle_id Id del circulo
 *
 * @apiSuccess {Object} circle Circulo
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "circle":{
 *        "parent":"559ebc76dc9167e815a750b6",
 *        "name":"Tios",
 *        "_id":"559ebc91dc9167e815a750b7",
 *        "__v":0,
 *        "ancestors":[
 *          "559eba8109b6aee614e3f733",
 *          "559ebc0ddc9167e815a750b5",
 *          "559ebc76dc9167e815a750b6"
 *        ]
 *      }
 *    }
 */
circleRoutes.get('/:circle_id', circleController.getCircleById);

module.exports = circleRoutes;