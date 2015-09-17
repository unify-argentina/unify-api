/*
 * Este módulo se encarga de manejar las rutas de recuperación de cuenta
 * @author Joel Márquez
 * */
'use strict';

// requires
var recoveryPasswordController = require('./recovery-password.controller');
var recoveryRoutes = require('express').Router();

/**
 * @api {post} /auth/recover Enviar email de recuperacion
 * @apiGroup Recuperacion de cuenta
 *
 * @apiParam {String} email Email de la cuenta a recuperar
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "email" : "unify.argentina@gmail.com"
 *    }
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 */
recoveryRoutes.post('/', recoveryPasswordController.recover);

module.exports = recoveryRoutes;