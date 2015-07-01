/*
 * Este módulo se encarga de manejar las rutas de Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var twitterRouter = require('express').Router();
var twitterController = require('./twitter.controller');

/**
 * @api {post} /auth/twitter Twitter login
 * @apiGroup Autenticacion
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
twitterRouter.post('/', twitterController.linkAccount);

/**
 * @api {get} /auth/twitter/callback Twitter login callback
 * @apiGroup Autenticacion
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

module.exports = twitterRouter;