/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var userRoutes = require('express').Router();
var userController = require('./user.controller');

// modelos
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
 * @api {get} /api/user/:user_id Obtener Usuario
 * @apiGroup Usuarios
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 *
 * @apiSuccess {Object} user Usuario
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *     {
 *        "user": {
 *          "mainCircle":"558748787f0a76cc4ca02a35",
 *          "email":"unify.argentina@gmail.com",
 *          "name":"Juan Losa",
 *          "_id":"558748767f0a76cc4ca02a34",
 *          "__v":0
 *        }
 *     }
 */
userRoutes.get('/:user_id', userController.getUserById);

/**
 * @api {post} /api/user/:user_id Actualizar Usuario
 * @apiGroup Usuarios
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} email Email del usuario
 * @apiParam {String} name Nombre del usuario
 * @apiParam {String} password Password del usuario, debera tener 6 caracteres como minimo
 * @apiParam {String} confirm_password Tiene que ser igual que el password
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "email":"unify.argentina@gmail.com",
 *      "name":"Juan Losa",
 *      "confirm_password":"hola1234",
 *      "password":"hola1234"
 *    }
 *
 * @apiSuccess {Object} user Usuario
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *     {
 *        "user": {
 *          "mainCircle":"558748787f0a76cc4ca02a35",
 *          "email":"unify.argentina@gmail.com",
 *          "name":"Juan Losa",
 *          "_id":"558748767f0a76cc4ca02a34",
 *          "__v":0
 *        }
 *     }
 */
userRoutes.post('/:user_id', userController.updateUser);

/**
 * @api {get} /api/user/:user_id/friends Obtener los amigos del Usuario
 * @apiGroup Usuarios
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 *
 * @apiSuccess {Object} friends Listado de amigos de las redes sociales
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "friends":{
 *        "facebook":{
 *          "count":1,
 *          "list":[
 *            {
 *              "id":"104412116557897",
 *              "name":"Juan Losa",
 *              "picture":"https://graph.facebook.com/v2.3/104412116557897/picture?type=large"
 *            }
 *          ]
 *        },
 *        "instagram":{
 *          "count":2,
 *          "list":[
 *            {
 *              "id":"1442169810",
 *              "name":"marcelo tinelli",
 *              "picture":"https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11312440_693266217444492_2069397433_a.jpg",
 *              "username":"cuervotinelli1"
 *            },
 *            {
 *              "id":"1786223786",
 *              "name":"Cucina Paradiso",
 *              "picture":"https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/11055552_724116127706536_885942678_a.jpg",
 *              "username":"cucinaparadisoba"
 *            }
 *          ]
 *        },
 *        "twitter":{
 *          "count":3,
 *          "list":[
 *            {
 *              "id":"2399412002",
 *              "name":"StackCareersUK",
 *              "picture":"http://pbs.twimg.com/profile_images/565838781853351937/P4RG_KjM_normal.png",
 *              "username":"StackCareersUK"
 *            },
 *            {
 *              "id":"1887042901",
 *              "name":"Preguntados",
 *              "picture":"http://pbs.twimg.com/profile_images/459753435336695808/y8G4IVrX_normal.png",
 *              "username":"Preguntados_app"
 *            },
 *            {
 *              "id":"211089576",
 *              "name":"Wunderlist",
 *              "picture":"http://pbs.twimg.com/profile_images/494884573428207616/BjPVVsRm_normal.png",
 *              "username":"Wunderlist"
 *            }
 *          ]
 *        }
 *      }
 *    }
 */
userRoutes.get('/:user_id/friends', userController.getFriends);

userRoutes.use('/:user_id/circle', require('../circle'));

module.exports = userRoutes;