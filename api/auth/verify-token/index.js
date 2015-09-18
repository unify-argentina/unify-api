/*
 * Este módulo se encarga de manejar las rutas de verificación de cuenta
 * @author Joel Márquez
 * */
'use strict';

// requires
var verifyTokenController = require('./verify-token.controller');
var verifyRoutes = require('express').Router();

/**
 * @api {get} /auth/verify/:token Verificacion de cuenta
 * @apiGroup Autenticacion
 *
 * @apiParam {String} token Token de verificacion
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9H0Z2_5o",
 *       "user": {
 *         "created_at": "2015-09-03T04:05:21.846Z",
 *         "updated_at": "2015-09-03T04:05:21.846Z",
 *         "__v": 0,
 *         "_id": "55e7c6f80fdc3a922952aefc",
 *         "email": "unify.argentina@gmail.com",
 *         "main_circle": "55e7c6f90fdc3a922952aefd",
 *         "name": "joel",
 *         "verified": true,
 *         "valid_local_user": true
 *       }
 *     }
 */
verifyRoutes.get('/:token', verifyTokenController.verifyToken);

module.exports = verifyRoutes;