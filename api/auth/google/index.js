/*
 * Este módulo se encarga de manejar las rutas de Google
 * @author Joel Márquez
 * */
'use strict';

// requires
var googleRouter = require('express').Router();
var googleController = require('./google.controller');
var jwt = require('../util/jwt');

googleRouter.post('/', googleController.linkAccount);

googleRouter.post('/unlink', jwt.ensureAuthenticated, googleController.unlinkAccount);

module.exports = googleRouter;