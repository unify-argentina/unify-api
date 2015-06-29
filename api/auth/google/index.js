/*
 * Este módulo se encarga de manejar las rutas de Google
 * @author Joel Márquez
 * */
'use strict';

// requires
var googleRouter = require('express').Router();
var googleController = require('./google.controller');

googleRouter.post('/', googleController.linkAccount);

module.exports = googleRouter;