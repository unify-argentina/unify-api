/*
* Este módulo se encarga de dirigir todas las rutas hacia /api
* @author Joel Márquez
* */
'use strict';

module.exports = function(app) {

  // Rutas principales
  app.use('/api', require('./api'));

  // Rutas de autenticación
  app.use('/auth', require('./api/auth'));

  app.get('/', function(req, res) {
    res.send('Welcome to the Unify API!');
  });
};