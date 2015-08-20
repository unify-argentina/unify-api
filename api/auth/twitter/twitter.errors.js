/*
 * Este módulo maneja los errores posibles de Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var errors = require('../../../config/errors');
var logger = require('../../../config/logger');

// Chequea los errores que puedan llegar a venir de un response de Twitter
module.exports.hasError = function(err, response) {

  var result = { hasError: false, error: '' };

  if (err) {
    logger.error('Error: ' + err);
    result.hasError = true;
    result.error = util.format(errors.SOCIAL_ERROR, 'Twitter');
  }
  else if (response.body.errors && response.body.errors.length > 0) {
    logger.error('Error: ' + response.body.errors[0].message);
    result.hasError = true;
    result.error = {
      code: response.body.errors[0].code,
      message: response.body.errors[0].message
    };
  }

  return result;
};