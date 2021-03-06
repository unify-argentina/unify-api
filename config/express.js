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
var validator = require('validator');
var config = require('./index');
var logger = require('./logger');

var allowCrossDomainConfig = function(req, res, next) {

  var origin = req.get('origin');
  if (config.CROSS_DOMAIN_URLS.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  }

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    return res.sendStatus(200);
  }
  else {
    next();
  }
};

var isEmailArray = function(possibleArray) {
  var isEmailArray = possibleArray !== undefined && possibleArray.constructor === Array;
  var i = 0;
  while (isEmailArray && i < possibleArray.length) {
    isEmailArray = typeof possibleArray[i] === 'string' && validator.isEmail(possibleArray[i]);
    i++;
  }
  return isEmailArray;
};

var isStringArray = function(possibleArray) {
  var isStringArray = possibleArray !== undefined && possibleArray.constructor === Array;
  var i = 0;
  // Viene por body como un JSON array de strings
  while (isStringArray && i < possibleArray.length) {
    isStringArray = typeof possibleArray[i] === 'string';
    i++;
  }
  // Viene por un GET un array del tipo clave=valor1,valor2,valor3
  if (!isStringArray && typeof possibleArray === 'string') {
    var values = possibleArray.split(',');
    if (values !== undefined && values.constructor === Array) {
      i = 0;
      isStringArray = true;
      while (isStringArray && i < values.length) {
        isStringArray = typeof values[i] === 'string';
        i++;
      }
    }
  }
  return isStringArray;
};

var isString = function(possibleString) {
  return typeof possibleString === 'string';
};

var notEquals = function(str, comparison) {
  return str !== comparison;
};

module.exports = function(app) {
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(allowCrossDomainConfig);
  app.use(expressValidator({ customValidators: {
    isEmailArray: isEmailArray,
    isStringArray: isStringArray,
    isString: isString,
    notEquals: notEquals
  }}));
};