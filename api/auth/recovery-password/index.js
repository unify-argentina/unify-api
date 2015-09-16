/*
 * Este módulo se encarga de manejar las rutas de recuperación de cuenta
 * @author Joel Márquez
 * */
'use strict';

// requires
var recoveryPasswordController = require('./recovery-password.controller');
var recoveryRoutes = require('express').Router();

/**
 * @api {post} /auth/recover Enviar email de recuperación
 * @apiGroup Recuperación de cuenta
 *
 * @apiParam {String} email Email de la cuenta a recuperar
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 */
recoveryRoutes.post('/', recoveryPasswordController.recover);

/**
 * @api {get} /auth/recover/:token Validar recuperación de cuenta
 * @apiGroup Recuperación de cuenta
 *
 * @apiParam {String} token Token generado para recuperar la cuenta
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 */
recoveryRoutes.post('/:token', recoveryPasswordController.validateToken);

module.exports = recoveryRoutes;