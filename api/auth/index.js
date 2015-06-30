/*
* Este módulo se encarga de manejar las rutas de autenticación, que van dirigidas
* vía /api/auth
* @author Joel Márquez
* */
'use strict';

// requires
var authRoutes = require('express').Router();

authRoutes.use('/', require('./local'));
authRoutes.use('/facebook', require('./facebook'));
authRoutes.use('/twitter', require('./twitter'));

module.exports = authRoutes;