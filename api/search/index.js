/*
 * Este es el módulo que se encarga de manejar las rutas de busqueda
 * @author Joel Márquez
 * */
'use strict';

// requires
var searchRoutes = require('express').Router();
var searchController = require('./search.controller');

searchRoutes.get('/', searchController.search);

module.exports = searchRoutes;