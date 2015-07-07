/*
 * Este módulo se encarga de configurar winston, el logger a utilizar
 * @author Joel Márquez
 * */
'use strict';

var winston = require('winston');

// Termina devolviendo la última carpeta y el nombre del archivo, ej: config/logger.js
var getLabel = function(callingModule) {
  var parts = callingModule.split('/');
  return parts[parts.length - 2] + '/' + parts.pop();
};

// Cada vez que se quiera usar, se va a tener que llamar así: require('logger.js')(__filename);
module.exports = function(callingModule) {
  return new winston.Logger({
    transports: [new winston.transports.Console({
      label: getLabel(callingModule),
      timestamp: true
    })]
  });
};