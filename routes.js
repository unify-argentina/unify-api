/*
* Este módulo se encarga de dirigir todas las rutas hacia /api
* @author Joel Márquez
* */
'use strict';

module.exports = function (app) {

  //Main route
  app.use('/api', require('./api'));
};