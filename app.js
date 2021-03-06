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
  if (err) {
    logger.error('There was an error connecting to MongoDB at ' + config.MONGODB + ' shutting down Unify API');
    process.exit(1);
  }
  else {
    logger.info('Connected to MongoDB at ' + config.MONGODB);
  }
});

// start app
app.listen(config.PORT, function() {
  logger.info('Unify API started at port ' + config.PORT);
});