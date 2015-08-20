/*
 * Este módulo maneja los errores posibles de Instagram
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var errors = require('../../../config/errors');
var logger = require('../../../config/logger');

// Chequea los errores que puedan llegar a venir de un response de Instagram
module.exports.hasError = function(err, response) {

  var result = { hasError: false, error: '' };

  if (err || !response.body.meta) {
    logger.error('Error: ' + err);
    result.hasError = true;
    result.error = util.format(errors.SOCIAL_ERROR, 'Instagram');
  }
  else if (response.body.meta.error_type) {
    logger.error('Error: ' + response.body.meta.error_message);
    result.hasError = true;
    result.error = {
      code: response.body.meta.code,
      message: response.body.meta.error_message
    };
  }

  return result;
};