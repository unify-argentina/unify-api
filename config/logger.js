/*
 * Este módulo se encarga de configurar winston, el logger a utilizar
 * @author Joel Márquez
 * */
'use strict';

// requires
var winston = require('winston');
var config = require('./index');

winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config.LOG_LEVEL,
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: false
});

module.exports = logger;