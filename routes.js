/*
* Este módulo se encarga de dirigir todas las rutas hacia /api
* @author Joel Márquez
* */
'use strict';

module.exports = function (app) {

  //Main route
  app.use('/api', require('./api'));

  app.get('/', function(req, res) {
    res.send('Welcome to the Unify API!');
  });
};