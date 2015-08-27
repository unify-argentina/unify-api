/*
 * Este módulo maneja los errores posibles de Facebook
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var errors = require('../../../config/errors');
var logger = require('../../../config/logger');

/*
* Ejemplo de error de Facebook:
*
* {
*   "error": {
*     "message": "Message describing the error",
*     "type": "OAuthException",
*     "code": 190,
*     "error_subcode": 460,
*     "error_user_title": "A title",
*     "error_user_msg": "A message"
*   }
* }
* */

// Chequea los errores que puedan llegar a venir de un response de Facebook
module.exports.hasError = function(err, response) {

  var result = { hasError: false, error: '' };

  if (err) {
    logger.error('Facebook Error: ' + err);
    result.hasError = true;
    result.error = util.format(errors.SOCIAL_ERROR, 'Facebook');
  }
  else if (response.body.error) {
    logger.error('Facebook Error: ' + response.body.error.message);
    result.hasError = true;
    result.error = {
      code: response.body.error.code,
      msg: response.body.error.message
    };
  }

  return result;
};