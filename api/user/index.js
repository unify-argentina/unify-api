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
    return res.status(400).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }

  // Si el req.user, ya habiendo pasado por la verificación del token es el mismo
  // que el del req.params.id, enviamos el user
  if (req.user !== userId) {
    return res.status(400).send({ errors: [{ msg: 'You are trying to find a different user' }]});
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
 *                         "id": "141545972523915",
 *                         "name": "Back to the Future Trilogy",
 *                         "picture": "https://graph.facebook.com/v2.3/141545972523915/picture?type=large"
 *                     }
 *                 ],
 *                 "count": 1
 *             },
 *             "instagram": {
 *                 "list": [
 *                     {
 *                         "id": "259220806",
 *                         "name": "9GAG",
 *                         "picture": "https://igcdn-photos-d-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10543934_413441348850651_1114644254_a.jpg",
 *                         "username": "9gag"
 *                     }
 *                 ],
 *                 "count": 1
 *             },
 *             "twitter": {
 *                 "list": [
 *                     {
 *                         "id": "6761682",
 *                         "name": "blink182",
 *                         "picture": "http://pbs.twimg.com/profile_images/529142117491171330/mRCmdNod_bigger.png",
 *                         "username": "blink182"
 *                     }
 *                 ],
 *                 "count": 1
 *             }
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

userRoutes.use('/:user_id/circle', require('../circle'));

userRoutes.use('/:user_id/contact', require('../contact'));

module.exports = userRoutes;