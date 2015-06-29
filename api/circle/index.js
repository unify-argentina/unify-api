/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

var circleRoutes = require('express').Router();
var circleController = require('./circle.controller');

circleRoutes.post('/', circleController.createCircle);

module.exports = circleRoutes;