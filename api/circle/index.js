/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

var circleRoutes = require('express').Router();
var circleController = require('./circle.controller');

/**
 * @api {get} /api/user/:id/circle Crear un círculo
 * @apiGroup Círculos
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} id Id del usuario
 *
 * @apiSuccess {Object} circle Círculo creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *     {
 *        "circle": {
 *          "mainCircle":"558748787f0a76cc4ca02a35",
 *          "email":"90joelmarquez@gmail.com",
 *          "name":"Joel",
 *          "_id":"558748767f0a76cc4ca02a34",
 *          "__v":0
 *        }
 *     }
 */
circleRoutes.post('/', circleController.createCircle);

module.exports = circleRoutes;