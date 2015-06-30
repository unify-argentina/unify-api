/*
 * Este módulo se encarga de manejar las rutas de Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var twitterRouter = require('express').Router();
var twitterController = require('./twitter.controller');

twitterRouter.post('/', twitterController.linkAccount);
twitterRouter.get('/callback', twitterController.handleCallback);

module.exports = twitterRouter;