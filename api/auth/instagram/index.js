/*
 * Este módulo se encarga de manejar las rutas de Instagram
 * @author Joel Márquez
 * */
'use strict';

// requires
var instagramRouter = require('express').Router();
var instagramController = require('./instagram.controller');

instagramRouter.post('/', instagramController.linkAccount);

module.exports = instagramRouter;