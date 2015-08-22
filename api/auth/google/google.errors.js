/*
 * Este módulo maneja los errores posibles de Google
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var errors = require('../../../config/errors');
var logger = require('../../../config/logger');

/*
* Ejemplo de error de Google:
*
* {
*   "error": {
*     "errors": [
*       {
*         "domain": "global",
*         "reason": "authError",
*         "message": "Invalid Credentials",
*         "locationType": "header",
*         "location": "Authorization"
*       }
*     ],
*     "code": 401,
*     "message": "Invalid Credentials"
*   }
* }
* */

// Chequea los errores que puedan llegar a venir de un response de Google
module.exports.hasError = function(err, response) {

  var result = { hasError: false, error: '' };

  if (err) {
    logger.error('Error: ' + err);
    result.hasError = true;
    result.error = util.format(errors.SOCIAL_ERROR, 'Google');
  }
  else if (response.body.error) {
    logger.error('Error: ' + JSON.stringify(response.body));
    result.hasError = true;
    result.error = {
      code: response.body.error.code || 0,
      msg: response.body.error.message || response.body.error
    };
  }

  return result;
};