/*
 * Este módulo maneja los errores posibles de Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var errors = require('../../../config/errors');
var logger = require('../../../config/logger');

/*
* Ejemplo de error de Twitter:
*
* {
*   "errors": [
*     {
*       "message": "Sorry, that page does not exist",
*       "code": 34
*     }
*   ]
* }
* */

// Chequea los errores que puedan llegar a venir de un response de Twitter
module.exports.hasError = function(err, response) {

  var result = { hasError: false, error: '' };

  if (err) {
    logger.error('Twitter Error: ' + JSON.stringify(err));
    result.hasError = true;
    result.error = util.format(errors.SOCIAL_ERROR, 'Twitter');
  }
  else if (response.body && response.body.errors && response.body.errors.length > 0) {
    logger.error('Twitter Error: ' + response.body.errors[0].message);
    result.hasError = true;
    result.error = {
      code: response.body.errors[0].code,
      msg: response.body.errors[0].message
    };
  }

  return result;
};