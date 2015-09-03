/*
 * Este módulo se encarga de manejar las rutas de Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var twitterRouter = require('express').Router();
var twitterController = require('./twitter.login.controller');
var jwt = require('../util/jwt');

/**
 * @api {post} /auth/twitter Twitter login
 * @apiGroup Autenticacion Social
 *
 * @apiParam {String} oauth_token Oauth token para obtener el request token
 * @apiParam {String} oauth_verifier Oauth verificador para obtener el request token
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL",
 *       "user": {
 *         "__v": 0,
 *         "_id": "55b6fba973191a7428d80c94",
 *         "email": "90joelmarquez@gmail.com",
 *         "main_circle": "55b6fbaa73191a7428d80c95",
 *         "name": "Joel Marquez",
 *         "google": {
 *           "display_name": "Joel Márquez",
 *           "email": "90joelmarquez@gmail.com",
 *           "picture": "https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200"
 *         },
 *         "instagram": {
 *           "display_name": "Joel Márquez",
 *           "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg",
 *           "username": "joe__marquez"
 *         },
 *         "twitter": {
 *           "display_name": "Joel Márquez",
 *           "picture": "http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg",
 *           "username": "joelmarquez90"
 *         },
 *         "facebook": {
 *           "display_name": "Joel Márquez",
 *           "email": "90joelmarquez@gmail.com",
 *           "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *         },
 *         "valid_local_user": true,
 *         "verified": true
 *       }
 *     }
 */
twitterRouter.post('/', twitterController.linkAccount);

/**
 * @api {get} /auth/twitter/callback Twitter login callback
 * @apiGroup Autenticacion Social
 *
 * @apiParam {String} oauth_token Oauth token para obtener el request token
 * @apiParam {String} oauth_verifier Oauth verificador para obtener el request token
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
twitterRouter.get('/callback', twitterController.handleCallback);

/**
 * @api {delete} /auth/twitter Twitter unlink
 * @apiGroup Autenticacion Social
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
twitterRouter.delete('/', jwt.ensureAuthenticated, twitterController.unlinkAccount);

module.exports = twitterRouter;