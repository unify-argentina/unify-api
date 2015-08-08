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
 *     {
 *         "user": {
 *             "__v": 0,
 *             "_id": "55c421354037f03842898378",
 *             "email": "90joelmarquez@gmail.com",
 *             "main_circle": {
 *                 "user": "55c421354037f03842898378",
 *                 "name": "Main Circle",
 *                 "_id": "55c421364037f03842898379",
 *                 "__v": 0,
 *                 "ancestors": [
 *                 ]
 *             },
 *             "name": "Joel Márquez",
 *             "google": {
 *                 "display_name": "Joel Márquez",
 *                 "email": "90joelmarquez@gmail.com",
 *                 "picture": "https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200"
 *             },
 *             "instagram": {
 *                 "display_name": "Joel Márquez",
 *                 "picture": "https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11385614_441266499409188_453477140_a.jpg",
 *                 "username": "joe__marquez"
 *             },
 *             "twitter": {
 *                 "display_name": "Joel Márquez",
 *                 "picture": "http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg",
 *                 "username": "joelmarquez90"
 *             },
 *             "facebook": {
 *                 "display_name": "Joel Márquez",
 *                 "email": "90joelmarquez@gmail.com",
 *                 "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *             },
 *             "valid_local_user": true,
 *             "media": {
 *                 "count": 5,
 *                 "list": [
 *                     {
 *                         "provider": "twitter",
 *                         "id": "614167759744815105",
 *                         "type": "video",
 *                         "created_time": 1435263979,
 *                         "link": "https://twitter.com/statuses/614167759744815105",
 *                         "likes": 0,
 *                         "text": "RT @enunabaldosa: El mejor polvo de Fiorito. #FuerzaDiego http://t.co/n8aG5cQ17v",
 *                         "user_has_liked": true
 *                     },
 *                     {
 *                         "provider": "facebook",
 *                         "id": "10153375756974738",
 *                         "type": "video",
 *                         "created_time": 1434330475,
 *                         "link": "",
 *                         "media_url": "https://video.xx.fbcdn.net/hvideo-xtf1/v/t43.1792-2/11390970_10153376400444738_1956408425_n.mp4?efg=eyJybHIiOjMxODEsInJsYSI6NDA5Nn0%3D&rl=3181&vabr=2121&oh=48e4f3c6aa439959b3714f69c80ce3c4&oe=55C7316F",
 *                         "text": "Esto es La Vela Puerca señores, gracias por tanto!!!"
 *                     },
 *                     {
 *                         "provider": "instagram",
 *                         "id": "1004621806268155504_993803680",
 *                         "type": "video",
 *                         "created_time": 1433980273,
 *                         "link": "https://instagram.com/p/3xIjXIOYZwVrXCEvFD9of7f_Jbc-qyedzM1Ak0/",
 *                         "likes": 8,
 *                         "media_url": "https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11424155_495429683938569_221343300_n.mp4",
 *                         "text": "Franchu rockstar dedicando canciones",
 *                         "user_has_liked": ""
 *                     },
 *                     {
 *                         "provider": "twitter",
 *                         "id": "603017315962216448",
 *                         "type": "text",
 *                         "created_time": 1432605506,
 *                         "link": "https://twitter.com/statuses/603017315962216448",
 *                         "likes": 0,
 *                         "text": "Potra! https://t.co/OBj9F9eSqO",
 *                         "user_has_liked": false
 *                     },
 *                     {
 *                         "provider": "facebook",
 *                         "id": "10153299865284738",
 *                         "type": "image",
 *                         "created_time": 1432215901,
 *                         "link": "https://www.facebook.com/photo.php?fbid=10153299865284738&set=a.10150737575769738.433956.826764737&type=1",
 *                         "media_url": "https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/11222191_10153299865284738_4077884363797576640_n.jpg?oh=0652558e97b45b1fac8d31f6f9a8cb9c&oe=56446D81",
 *                         "text": "Me parece una iniciativa muy buena del ministerio de seguridad. A atrapar a este hijo de puta! -> http://info.minseg.gob.ar/sebusca/index.html"
 *                     }
 *                 ]
 *             }
 *         }
 *     }
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