/*
 * Este módulo se encarga de manejar las rutas de Instagram
 * @author Joel Márquez
 * */
'use strict';

// requires
var instagramRouter = require('express').Router();
var instagramController = require('./instagram.controller');
var jwt = require('../util/jwt');

/**
 * @api {post} /auth/instagram Instagram login
 * @apiGroup Social
 *
 * @apiParam {String} code Código de autorización de Instagram
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
instagramRouter.post('/', instagramController.linkAccount);

instagramRouter.post('/unlink', jwt.ensureAuthenticated, instagramController.unlinkAccount);

module.exports = instagramRouter;