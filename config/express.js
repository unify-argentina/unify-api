/*
* Este módulo se encarga de configurar express, con todos sus componentes
* @author Joel Márquez
* */
'use strict';

// requires
var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var config = require('./index');
var logger = require('./logger');

var allowCrossDomain = function(req, res, next) {

  var origin = req.get('origin');
  if (config.CROSS_DOMAIN_URLS.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  }

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

module.exports = function(app) {
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(methodOverride());
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(allowCrossDomain);
};