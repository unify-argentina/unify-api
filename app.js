/*
* Este es el módulo principal, el cual importa el módulo de express y lo configura
* con el módulo de rutas, y también importa el módulo de mongoose para conectarse
* a la base de datos de MongoDB. Por último, levanta la API en el puerto 8080 o en
* el que se le pase por parámetro
* @author Joel Márquez
* */
'use strict';

// requires
var express = require('express');
var mongoose = require('mongoose');
var logger = require('./config/logger');

// import config
var config = require('./config');

// express app
var app = express();
require('./config/express')(app);
require('./routes')(app);

// mongodb
mongoose.connect(config.MONGODB, function(err) {
  logger.debug('Connected to MongoDB at ' + config.MONGODB);
  mongoose.set('debug', function (coll, method, query, doc) {
    logger.debug('Col: ' + coll + ' method: ' + method + ' query: ' + JSON.stringify(query) + ' doc: ' + JSON.stringify(doc));
  });
});

// start app
var port = process.env.PORT || 8080;
app.listen(port, function() {
  logger.debug('Unify API started at port ' + port);
});