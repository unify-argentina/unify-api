/*
* Este módulo se encarga de manejar las rutas de autenticación, que van dirigidas
* vía /api/auth
* @author Joel Márquez
* */
'use strict';

// requires
var authRoutes = require('express').Router();

// /auth
authRoutes.use('/', require('./local'));

// /auth/facebook
authRoutes.use('/facebook', require('./facebook'));

// /auth/twitter
authRoutes.use('/twitter', require('./twitter'));

// /auth/instagram
authRoutes.use('/instagram', require('./instagram'));

// /auth/google
authRoutes.use('/google', require('./google'));

// /auth/verify
authRoutes.use('/verify', require('./verify-token'));

module.exports = authRoutes;