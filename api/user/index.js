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
var logger = require('../../config/logger');

// modelos
var User = require('./user.model.js');

// Esto lo que hace es verificar que cada vez que se envíe un user_id como parámetro en una ruta,
// coincida con el user que está en el request, previamente validado con el Json Web Token
userRoutes.param('user_id', function(req, res, next, userId) {
  req.assert('user_id', 'Id del usuario válido requerido').isString();

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + req.validationErrors());
    return res.status(400).send({ errors: req.validationErrors() });
  }

  // Si el req.user, ya habiendo pasado por la verificación del token es el mismo
  // que el del req.params.id, enviamos el user
  else if (req.user !== userId) {
    return res.status(400).send({ errors: [{ msg: 'Estás queriendo acceder a un usuario distinto al tuyo' }]});
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
 *     {
 *         "friends": {
 *             "facebook_friends": {
 *                 "list": [
 *                     {
 *                         "id": "104412116557897",
 *                         "name": "Juan Losa",
 *                         "picture": "https://graph.facebook.com/v2.3/104412116557897/picture?type=large"
 *                     }
 *                 ],
 *                 "count": 1
 *             },
 *             "facebook_pages": {
 *                 "list": [
 *                     {
 *                         "id": "28686402854",
 *                         "name": "Fernet Branca",
 *                         "picture": "https://graph.facebook.com/v2.3/28686402854/picture?type=large"
 *                     }
 *                 ],
 *                 "count": 1
 *             },
 *             "instagram": {
 *                 "list": [
 *                     {
 *                         "id": "13460080",
 *                         "name": "nike",
 *                         "picture": "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11809593_769192616523522_1094660024_a.jpg",
 *                         "username": "nike"
 *                     }
 *                 ],
 *                 "count": 1
 *             },
 *             "twitter": {
 *                 "list": [
 *                     {
 *                         "id": "2569881",
 *                         "name": "Ørta",
 *                         "picture": "http://pbs.twimg.com/profile_images/594954985244360705/YWx3Fuju_bigger.png",
 *                         "username": "orta"
 *                     }
 *                 ],
 *                 "count": 1
 *             },
 *             "google": {
 *                 "list": [
 *                     {
 *                         "id": "http://www.google.com/m8/feeds/contacts/90joelmarquez%40gmail.com/base/7c6c92a3883ca8f2",
 *                         "name": "Florencia Aragno",
 *                         "email": "faragno@ecosistemas.com.ar"
 *                     }
 *                 ],
 *                 "count": 1
 *             }
 *         },
 *         "errors": {
 *         }
 *     }
 *
 * @apiErrorExample Respuesta invalida
 *     HTTP/1.1 200 OK
 *     {
 *         "friends": {
 *         },
 *         "errors": {
 *             "facebook_friends": {
 *                 "code": 190,
 *                 "msg": "Error validating access token: The user has not authorized application 805638479520745."
 *             },
 *             "facebook_pages": {
 *                 "code": 190,
 *                 "msg": "Error validating access token: The user has not authorized application 805638479520745."
 *             },
 *             "instagram": {
 *                 "code": 400,
 *                 "msg": "The access_token provided is invalid."
 *             },
 *             "twitter": {
 *                 "code": 89,
 *                 "msg": "Invalid or expired token."
 *             },
 *             "google": {
 *                 "code": 89,
 *                 "msg": "Invalid credentials"
 *             }
 *         }
 *     }
 */
userRoutes.get('/:user_id/friends', friendsController.getFriends);

/**
 * @api {get} /api/user/:user_id/media Obtener contenido del usuario
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
 *     {
 *         "user_id": "55da99dff7c2a1864235b6fb",
 *         "media": {
 *             "count": 4,
 *             "list": [
 *                 {
 *                     "provider": "twitter",
 *                     "id": "596020075393642496",
 *                     "type": "text",
 *                     "created_time": 1430937234,
 *                     "link": "https://twitter.com/statuses/596020075393642496",
 *                     "likes": 0,
 *                     "text": "LIVE on #Periscope: Working @ Etermax https://t.co/4cS15HwDk1",
 *                     "user_has_liked": false
 *                 },
 *                 {
 *                     "provider": "instagram",
 *                     "id": "960103625562621136_993803680",
 *                     "type": "image",
 *                     "created_time": 1428673292,
 *                     "link": "https://instagram.com/p/1S-SkdOYTQfgPBMEYnQ3vXzQw0u5-zsRlm9XY0/",
 *                     "likes": 6,
 *                     "media_url": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11084974_830219477014557_2002237000_n.jpg",
 *                     "text": "Máquina de snacks y de cafe en el laburo, cartón lleno!",
 *                     "user_has_liked": ""
 *                 },
 *                 {
 *                     "provider": "facebook",
 *                     "id": "10153184467399738",
 *                     "type": "image",
 *                     "created_time": 1427824794,
 *                     "link": "https://www.facebook.com/photo.php?fbid=10153184467399738&set=a.36885379737.45118.826764737&type=1",
 *                     "likes": 11,
 *                     "media_url": "https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-xpt1/t31.0-8/10856832_10153184467399738_425179179183655076_o.jpg",
 *                     "text": "Google te pasás loco.."
 *                 },
 *                 {
 *                     "provider": "facebook",
 *                     "id": "104231789737",
 *                     "type": "video",
 *                     "created_time": 1248316817,
 *                     "link": "",
 *                     "likes": 0,
 *                     "media_url": "https://video.xx.fbcdn.net/hvideo-xpa1/v/t42.1790-2/1128968_10151770969524738_48281_n.mp4?oh=5292d676428908d8e4c12316c9c3fd81&oe=55CE3C64",
 *                     "text": ""
 *                 }
 *             ]
 *         }
 *     }
 *
 * @apiErrorExample Respuesta invalida
 *     HTTP/1.1 200 OK
 *     {
 *         "media": {
 *             "count": 0,
 *             "list": [
 *             ]
 *         },
 *         "errors": {
 *             "facebook": {
 *                 "photos": {
 *                     "code": 190,
 *                     "msg": "Error validating access token: The user has not authorized application 805638479520745."
 *                 },
 *                 "videos": {
 *                     "code": 190,
 *                     "msg": "Error validating access token: The user has not authorized application 805638479520745."
 *                 },
 *                 "statuses": {
 *                     "code": 190,
 *                     "msg": "Error validating access token: The user has not authorized application 805638479520745."
 *                 }
 *             },
 *             "instagram": {
 *                 "code": 400,
 *                 "msg": "The access_token provided is invalid."
 *             },
 *             "twitter": {
 *                 "code": 89,
 *                 "msg": "Invalid or expired token."
 *             }
 *         }
 *     }
 */
userRoutes.get('/:user_id/media', mediaController.getMedia);

/**
 * @api {post} /api/user/:user_id/media Dar like
 * @apiGroup Usuarios
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} [facebook_media_id] Id del contenido de Facebook a darle like
 * @apiParam {String} [twitter_media_id] Id del contenido de Twitter a darle fav
 *
 * @apiDescription Aclaración: si bien los ids de los contenidos son opcionales,
 * al menos uno es requerido para poder darle like en esa red social
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "facebook_media_id": "10205843678664227",
 *      "twitter_media_id": "581605355672715264"
 *    }
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 */
userRoutes.post('/:user_id/media', mediaController.like);

// Rutas de un círculo
userRoutes.use('/:user_id/circle', require('../circle'));

// Rutas de un contacto
userRoutes.use('/:user_id/contact', require('../contact'));

// Rutas de los emails
userRoutes.use('/:user_id/email', require('../email'));

module.exports = userRoutes;