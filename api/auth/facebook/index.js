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
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
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