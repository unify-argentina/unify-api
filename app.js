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

// import config
var config = require('./config/config');

// express app
var app = express();
require('./config/express')(app);
require('./routes')(app);

// mongodb
mongoose.connect(config.MONGODB);
console.log('Connected to MongoDB at ' + config.MONGODB);

// start app
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Unify API started at port ' + port);