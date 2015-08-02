/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var userRoutes = require('express').Router();
var userController = require('./user.controller');
var mediaController = require('./user.media.controller');
var friendsController = require('./user.friends.controller');

// modelos
var User = require('./user.model.js');

// Esto lo que hace es verificar que cada vez que se envíe un user_id como parámetro en una ruta,
// coincida con el user que está en el request, previamente validado con el Json Web Token
userRoutes.param('user_id', function(req, res, next, userId) {
  // Validamos nosql injection
  if (typeof userId !== 'string') {
    return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
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
 * @api {get} /api/user/:user_id Obtener usuario
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
 *    {
 *        "user": {
 *            "__v": 0,
 *            "_id": "55b6fba973191a7428d80c94",
 *            "email": "90joelmarquez@gmail.com",
 *            "main_circle": "55b6fbaa73191a7428d80c95",
 *            "name": "Joel Marquez",
 *            "google": {
 *                "display_name": "Joel Márquez",
 *                "email": "90joelmarquez@gmail.com",
 *                "picture": "https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200"
 *            },
 *            "instagram": {
 *                "display_name": "Joel Márquez",
 *                "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg",
 *                "userName": "joe__marquez"
 *            },
 *            "twitter": {
 *                "display_name": "Joel Márquez",
 *                "picture": "http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg",
 *                "userName": "joelmarquez90"
 *            },
 *            "facebook": {
 *                "display_name": "Joel Márquez",
 *                "email": "90joelmarquez@gmail.com",
 *                "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *            },
 *            "valid_local_user": true,
 *            "media": {
 *                "count": 3,
 *                "list": [
 *                    {
 *                        "provider": "facebook",
 *                        "id": "10153477879074738",
 *                        "type": "image",
 *                        "created_time": 1437948477,
 *                        "link": "https://www.facebook.com/photo.php?fbid=10153477879074738&set=a.10152154863139738.1073741830.826764737&type=1",
 *                        "media_url": "https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-xfp1/v/t1.0-9/20225_10153477879074738_4360696422298472690_n.jpg?oh=7d332338c4db1136c359cbe0e7ed3264&oe=565513FA&__gda__=1448067937_d3d74b86dbe101b54961e0549652c028",
 *                        "text": "Cumple de franchu 3 años, y si, se vuelve a la infancia"
 *                    },
 *                    {
 *                        "provider": "instagram",
 *                        "id": "1037909504130909999_993803680",
 *                        "type": "image",
 *                        "created_time": 1437948476,
 *                        "link": "https://instagram.com/p/5nZTHmuYcv/",
 *                        "likes": 13,
 *                        "media_url": "https://scontent.cdninstagram.com/hphotos-xfp1/t51.2885-15/e15/10809951_484188628422854_977065670_n.jpg",
 *                        "text": "Cumple de franchu 3 años, y si, se vuelve a la infancia",
 *                        "user_has_liked": ""
 *                    },
 *                    {
 *                        "provider": "twitter",
 *                        "id": "625427358284148736",
 *                        "type": "text",
 *                        "created_time": 1437948476,
 *                        "link": "https://twitter.com/statuses/625427358284148736",
 *                        "likes": 0,
 *                        "text": "Cumple de franchu 3 años, y si, se vuelve a la infancia https://t.co/ZT86vvlho0",
 *                        "user_has_liked": false
 *                    }
 *                ]
 *            }
 *        }
 *    }
 */
userRoutes.get('/:user_id', mediaController.getMedia);

/**
 * @api {put} /api/user/:user_id Actualizar usuario
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
 *          "main_circle":"558748787f0a76cc4ca02a35",
 *          "email":"unify.argentina@gmail.com",
 *          "name":"Juan Losa",
 *          "_id":"558748767f0a76cc4ca02a34",
 *          "__v":0
 *        }
 *     }
 */
userRoutes.put('/:user_id', userController.update);

/**
 * @api {get} /api/user/:user_id/friends Obtener los amigos del usuario
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
userRoutes.get('/:user_id/friends', friendsController.getFriends);

userRoutes.use('/:user_id/circle', require('../circle'));

userRoutes.use('/:user_id/contact', require('../contact'));

module.exports = userRoutes;