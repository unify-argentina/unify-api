/*
 * Este módulo maneja los errores posibles de Instagram
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var errors = require('../../../config/errors');
var logger = require('../../../config/logger');

/*
* Ejemplo de error de Instagram:
*
* {
*   "error_type": "OAuthException",
*   "code": 400,
*   "error_message": "..."
* }
* */

// Chequea los errores que puedan llegar a venir de un response de Instagram
module.exports.hasError = function(err, response) {

  var result = { hasError: false, error: '' };

  if (err) {
    logger.error('Error: ' + err);
    result.hasError = true;
    result.error = util.format(errors.SOCIAL_ERROR, 'Instagram');
  }
  else if (response.body.error_message) {
    logger.error('Error: ' + response.body.error_message);
    result.hasError = true;
    result.error = {
      code: response.body.code,
      msg: response.body.error_message
    };
  }

  return result;
};