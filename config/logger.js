/*
 * Este módulo se encarga de configurar winston, el logger a utilizar
 * @author Joel Márquez
 * */
'use strict';

var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;