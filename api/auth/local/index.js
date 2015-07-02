/*
* Este módulo maneja todas las rutas de autenticación de Unify
* @author Joel Márquez
* */
'use strict';

// requires
var localRoutes = require('express').Router();
var localController = require('./local.controller');
var jwt = require('../util/jwt');

/**
 * @api {post} /auth/login Login
 * @apiGroup Autenticacion
 *
 * @apiParam {String} email Email del usuario
 * @apiParam {String} password Password del usuario
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "email":"unify.argentina@gmail.com",
 *      "password":"hola1234",
 *    }
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
localRoutes.post('/login', localController.login);

/**
 * @api {post} /auth/signup Signup
 * @apiGroup Autenticacion
 *
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
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
localRoutes.post('/signup', localController.signup);

module.exports = localRoutes;