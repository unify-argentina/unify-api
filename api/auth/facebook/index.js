/*
* Este módulo se encarga de manejar las rutas de Facebook
* @author Joel Márquez
* */
'use strict';

// requires
var facebookRouter = require('express').Router();
var facebookController = require('./facebook.login.controller');
var jwt = require('../util/jwt');

/**
 * @api {post} /auth/facebook Facebook login
 * @apiGroup Social
 *
 * @apiParam {String} code Código de autorización de Facebook
 * @apiParam {String} clientId Id de la app
 * @apiParam {String} redirectUri La uri a la cual se va a redireccionar
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL",
 *       "user": {
 *         "__v": 0,
 *         "_id": "55b6fba973191a7428d80c94",
 *         "email": "90joelmarquez@gmail.com",
 *         "mainCircle": "55b6fbaa73191a7428d80c95",
 *         "name": "Joel Marquez",
 *         "google": {
 *           "displayName": "Joel Márquez",
 *           "email": "90joelmarquez@gmail.com",
 *           "picture": "https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200"
 *         },
 *         "instagram": {
 *           "displayName": "Joel Márquez",
 *           "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg",
 *           "userName": "joe__marquez"
 *         },
 *         "twitter": {
 *           "displayName": "Joel Márquez",
 *           "picture": "http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg",
 *           "userName": "joelmarquez90"
 *         },
 *         "facebook": {
 *           "displayName": "Joel Márquez",
 *           "email": "90joelmarquez@gmail.com",
 *           "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *         },
 *         "validLocalUser": true
 *       }
 *     }
 */
facebookRouter.post('/', facebookController.linkAccount);

/**
 * @api {delete} /auth/facebook Facebook unlink
 * @apiGroup Social
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
facebookRouter.delete('/', jwt.ensureAuthenticated, facebookController.unlinkAccount);

module.exports = facebookRouter;