/*
 * Este módulo se encarga de manejar las rutas de Google
 * @author Joel Márquez
 * */
'use strict';

// requires
var googleRouter = require('express').Router();
var googleController = require('./google.login.controller');
var jwt = require('../util/jwt');

/**
 * @api {post} /auth/google Google login
 * @apiGroup Social
 *
 * @apiParam {String} code Código de autorización de Google
 * @apiParam {String} clientId Id de la app
 * @apiParam {String} redirectUri La uri a la cual se va a redireccionar
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
googleRouter.post('/', googleController.linkAccount);

/**
 * @api {post} /auth/google/unlink Google unlink
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
googleRouter.post('/unlink', jwt.ensureAuthenticated, googleController.unlinkAccount);

module.exports = googleRouter;