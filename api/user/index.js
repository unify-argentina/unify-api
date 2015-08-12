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
 *             "valid_local_user": true
 *         }
 *     }
 */
userRoutes.get('/:user_id', userController.getById);

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
 *             "valid_local_user": true
 *         }
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
 *     {
 *         "friends": {
 *             "facebook": {
 *                 "list": [
 *                     {
 *                         "id": "10205153877979641",
 *                         "name": "Alejo García",
 *                         "picture": "https://graph.facebook.com/v2.3/10205153877979641/picture?type=large",
 *                         "is_friend": true
 *                     },
 *                     {
 *                         "id": "237673679704701",
 *                         "name": "Kinder",
 *                         "picture": "https://graph.facebook.com/v2.3/237673679704701/picture?type=large",
 *                         "is_friend": false
 *                     }
 *                 ],
 *                 "count": 2
 *             },
 *             "instagram": {
 *                 "list": [
 *                     {
 *                         "id": "1748235982",
 *                         "name": "Basta De Todo",
 *                         "picture": "https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11374053_781604678648356_1836083238_a.jpg",
 *                         "username": "bastatodo"
 *                     }
 *                 ],
 *                 "count": 1
 *             },
 *             "twitter": {
 *                 "list": [
 *                     {
 *                         "id": "66780587",
 *                         "name": "Amazon Web Services",
 *                         "picture": "http://pbs.twimg.com/profile_images/2900345382/16ffae8c667bdbc6a4969f6f02090652_bigger.png",
 *                         "username": "awscloud"
 *                     }
 *                 ],
 *                 "count": 1
 *             }
 *         }
 *     }
 */
userRoutes.get('/:user_id/friends', friendsController.getFriends);

/**
 * @api {get} /api/user/:user_id/feed Obtener feed del usuario
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
 *                 "count": 4,
 *                 "list": [
 *                     {
 *                         "provider": "twitter",
 *                         "id": "630875071029112832",
 *                         "type": "text",
 *                         "created_time": 1439247312,
 *                         "link": "https://twitter.com/statuses/630875071029112832",
 *                         "likes": 0,
 *                         "text": "@FloreJoffre volvió mi escritora favorita, la extrañaba mucho!",
 *                         "user_has_liked": false
 *                     },
 *                     {
 *                         "provider": "facebook",
 *                         "id": "10153505103784738",
 *                         "type": "image",
 *                         "created_time": 1438992173,
 *                         "link": "https://www.facebook.com/photo.php?fbid=10153505103784738&set=a.10152154863139738.1073741830.826764737&type=1",
 *                         "likes": 22,
 *                         "media_url": "https://scontent.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/11222579_10153505103784738_8048795787845306035_n.jpg?oh=1666a8fd6d3e5aed978488fc1b03ad17&oe=56809729",
 *                         "text": "Visita a los abuelos!"
 *                     },
 *                     {
 *                         "provider": "instagram",
 *                         "id": "1046664664395121919_993803680",
 *                         "type": "image",
 *                         "created_time": 1438992172,
 *                         "link": "https://instagram.com/p/6Gf_eAOYT_TLaOE0wV4q3GebfMnHq2eYRd3500/",
 *                         "likes": 10,
 *                         "media_url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11326029_815625338545580_1345778981_n.jpg",
 *                         "text": "Visita a los abuelos!",
 *                         "user_has_liked": ""
 *                     },
 *                     {
 *                         "provider": "instagram",
 *                         "id": "1041658847019238902_993803680",
 *                         "type": "video",
 *                         "created_time": 1438395432,
 *                         "link": "https://instagram.com/p/50tzPRuYX2b063EzLuYQ190FkgywcDGwMbFoM0/",
 *                         "likes": 6,
 *                         "media_url": "https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11766536_1631591547111503_50874758_n.mp4",
 *                         "text": "Alguien nos invadió el cuarto!",
 *                         "user_has_liked": ""
 *                     }
 *                 ]
 *             }
 *         }
 *     }
 */
userRoutes.get('/:user_id/media', mediaController.getMedia);

userRoutes.use('/:user_id/circle', require('../circle'));

userRoutes.use('/:user_id/contact', require('../contact'));

module.exports = userRoutes;