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
  if (typeof circleId !== 'string') {
    return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }

  // Buscamos el usuario del request y verificamos que el circle_id pertenezca a este usuario
  Circle.findOne({ _id: circleId, user: req.user })
    .populate('user ancestors')
    .exec(function(err, circle) {
      if (err || !circle) {
        logger.warn("You are trying to find a circle=" + circleId + " that doesn't belong to you");
        return res.status(401).send({ errors: [{ msg: "You are trying to find a circle that doesn't belong to you" }] });
      }
      else {
        req.circle = circle;
        next();
      }
    });
});

/**
 * @api {post} /api/user/:user_id/circle Crear un circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
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
 *      "circle":{
 *        "parent":"55936a0460bb409c379800b7",
 *        "name":"Amigos",
 *        "_id":"559ebc91dc9167e815a750b7",
 *        "__v":0,
 *        "ancestors":[
 *          "559eba8109b6aee614e3f733",
 *          "559ebc0ddc9167e815a750b5",
 *          "55936a0460bb409c379800b7"
 *        ]
 *      }
 *    }
 */
circleRoutes.post('/', circleController.create);

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
 *     {
 *         "circle": {
 *             "contacts": [
 *                 {
 *                     "user": "55b6f24c8424341d1fe6ef61",
 *                     "circle": "55b6f2ba8424341d1fe6ef63",
 *                     "picture": "graph.facebook.com/v2.3/10153267328674738/picture?type=large",
 *                     "name": "Joel",
 *                     "instagram_id": "993803680",
 *                     "twitter_id": "42704750",
 *                     "facebook_id": "10153267328674738",
 *                     "_id": "55b6f649fdd3e3be2400da40",
 *                     "__v": 0
 *                 },
 *                 {
 *                     "user": "55b6f24c8424341d1fe6ef61",
 *                     "circle": "55b6f2ba8424341d1fe6ef63",
 *                     "picture": "https://graph.facebook.com/v2.3/10205153877979641/picture?type=large",
 *                     "name": "Alejo",
 *                     "instagram_id": "993803680",
 *                     "twitter_id": "42704750",
 *                     "facebook_id": "10153267328674738",
 *                     "_id": "55b6f668fdd3e3be2400da41",
 *                     "__v": 0
 *                 }
 *             ],
 *             "parent": "55b6f24e8424341d1fe6ef62",
 *             "name": "Amigos",
 *             "_id": "55b6f2ba8424341d1fe6ef63",
 *             "__v": 0,
 *             "ancestors": [
 *                 {
 *                     "user": "55b6f24c8424341d1fe6ef61",
 *                     "name": "Main Circle",
 *                     "_id": "55b6f24e8424341d1fe6ef62",
 *                     "__v": 0,
 *                     "ancestors": [
 *                     ]
 *                 }
 *             ]
 *         }
 *     }
 *
 */
circleRoutes.get('/:circle_id', circleController.getById);

/**
 * @api {put} /api/user/:user_id/circle/:circle_id Actualizar un circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} circle_id Id del circulo a actualizar
 * @apiParam {String} name Nuevo nombre del circulo a actualizar
 * @apiParam {String} parent_id Nuevo id padre del circulo a actualizar
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
 *      "circle":{
 *        "parent":"55936a0460bb409c379800b7",
 *        "name":"Amigos",
 *        "_id":"559ebc91dc9167e815a750b7",
 *        "__v":0,
 *        "ancestors":[
 *          "559eba8109b6aee614e3f733",
 *          "559ebc0ddc9167e815a750b5",
 *          "55936a0460bb409c379800b7"
 *        ]
 *      }
 *    }
 */
circleRoutes.put('/:circle_id', circleController.update);

/**
 * @api {delete} /api/user/:user_id/circle/:circle_id Eliminar un circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} circle_id Id del circulo a borrar (no puede ser el círculo principal)
 *
 * @apiSuccess {String} circle Id del circulo eliminado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "circle":"55936a0460bb409c379800b7"
 *    }
 */
circleRoutes.delete('/:circle_id', circleController.delete);

module.exports = circleRoutes;