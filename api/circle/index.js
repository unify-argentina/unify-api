/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

var circleRoutes = require('express').Router();
var circleController = require('./circle.controller');

/**
 * @api {get} /api/user/:id/circle Crear un circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} id Id del usuario
 * @apiParam {String} name Nombre del circulo a crear
 * @apiParam {String} parent_id Id del circulo padre
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "name":"Amigos",
 *      "parent_id":"55936a0460bb409c379800b7"
 *    }
 *
 * @apiSuccess {Object} circle Circulo creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "circle": {
 *        "__v":0,
 *        "parent":
 *        "55936a0460bb409c379800b7",
 *        "name":"Amigos",
 *        "_id":"55936a8960bb409c379800b8",
 *        "contacts":[]
 *      }
 *    }
 */
circleRoutes.post('/', circleController.createCircle);

module.exports = circleRoutes;