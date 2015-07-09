/*
 * Este es el módulo que se encarga de manejar las rutas de un contacto
 * @author Joel Márquez
 * */
'use strict';

var contactRoutes = require('express').Router();
var contactController = require('./contact.controller');

contactRoutes.post('/', contactController.createContact);

module.exports = contactRoutes;
