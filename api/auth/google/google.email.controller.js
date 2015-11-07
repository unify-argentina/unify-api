/*
 * Este módulo se encarga de manejar los emails de Google del usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var logger = require('../../../config/logger');
var googleErrors = require('./google.errors');
var googleUtils = require('./google.utils');

// Lista los mensajes de la bandeja de entrada
module.exports.listInbox = function(refresh_token, callback) {
  list(refresh_token, googleUtils.getInboxName(), callback);
};

// Lista los mensajes enviados
module.exports.listSent = function(refresh_token, callback) {
  list(refresh_token, googleUtils.getSentName(), callback);
};

// Lista los mensajes borradores
module.exports.listDraft = function(refresh_token, callback) {
  list(refresh_token, googleUtils.getDraftName(), callback);
};

// Lista los mensajes de la papelera de reciclaje
module.exports.listTrash = function(refresh_token, callback) {
  list(refresh_token, googleUtils.getTrashName(), callback);
};

// Devuelve los emails de la cuenta de Google del usuario loggeado
var list = function(refresh_token, labelId, callback) {

  googleUtils.getAccessToken(refresh_token, function(err, access_token) {

    if (err) {
      callback(null, err);
    }
    else {

      // Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Google
      var emails = [];

      var qs = { labelIds: labelId };

      // Primero obtenemos los emails con el labelId correspondiente
      getGoogleData(googleUtils.getUserEmailGenericListURL(), qs, access_token, emails, function(err, googleEmails) {

        if (err) {
          callback(null, err);
        }
        else {

          var headers = { Authorization: 'Bearer ' + access_token };

          // Una vez que los tenemos, mapeamos la lista de ids de emails al email propiamente dicho
          async.map(googleEmails, function(email, mapCallback) {

            var url = util.format(googleUtils.getUserEmailDetailURL(), email.id);

            // Haciendo un request por cada email
            request.get({ url: url, headers: headers, json: true }, function(err, response) {
              var result = googleErrors.hasError(err, response);
              if (result.hasError) {
                mapCallback(result.error, null);
              }
              else {
                mapCallback(null, mapEmail(response.body));
              }
            });

          }, function(err, googleDetailedEmails) {

            logger.debug('Google emails count: ' + googleDetailedEmails.length);

            var url = util.format(googleUtils.getUserEmailLabelsURL(), labelId);
            logger.info('URL: ' + url);

            // Por último, una vez que tenemos la lista de todos los emails, pedimos la info de ese labelId
            request.get({ url: url, headers: headers, json: true }, function(err, response) {

              var result = googleErrors.hasError(err, response);
              if (result.hasError) {
                callback(null, result.error);
              }
              else {
                var emailResults = {
                  total_count: response.body.messagesTotal,
                  unread_count: response.body.messagesUnread,
                  emails: googleDetailedEmails
                };
                callback(err, emailResults);
              }
            });
          });
        }
      });
    }
  });
};

// Le pega a la API de Google y en el response, si fue exitoso, van a estar los emails del usuario
var getGoogleData = function(url, qs, access_token, emails, callback) {

  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  var headers = { Authorization: 'Bearer ' + access_token };

  request.get({ url: url, qs: qs, headers: headers, json: true }, function(err, response) {

    var result = googleErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error, null);
    }
    else if (!response.body.messages || response.body.messages.length === 0) {
      callback(null, emails);
    }
    // Ya tengo los emails y los devuelvo en el callback
    else {
      emails.push.apply(emails, response.body.messages);
      callback(null, emails);
    }
  });
};

// Recibe un objeto de email de Google y devuelve uno mas simple
var mapEmail = function(googleEmail) {

  var emailValues = getValuesFromPayload(googleEmail);
  var bodyValues = getBodyFromPayload(googleEmail);
  var unread = googleEmail.labelIds && googleEmail.labelIds.constructor === Array && googleEmail.labelIds.indexOf('UNREAD') > -1;

  logger.debug('Google email: id=' + googleEmail.id + ' subject: ' + emailValues.subject);

  return {
    id: googleEmail.id,
    threadId: googleEmail.threadId,
    snippet: googleEmail.snippet,
    provider: 'google',
    unread: unread,
    date: emailValues.date,
    from: emailValues.from,
    to: emailValues.to,
    cc: emailValues.cc,
    cco: emailValues.cco,
    subject: emailValues.subject,
    text: bodyValues.text,
    html: bodyValues.html
  };
};

// Obtiene el valor pedido dentro del array de headers
var getValuesFromPayload = function(googleEmail, name) {

  var result = {
    date: '',
    from: '',
    to: '',
    cc: [],
    cco: [],
    subject: ''
  };
  var payload = googleEmail.payload;

  if (payload) {
    var headers = payload.headers;
    if (headers && headers.length > 0) {

      var date = ensureValue(headers, 'Date');
      result.date = moment(date, googleUtils.getGmailDateFormat(), 'en').unix();
      result.from = ensureValue(headers, 'From');
      result.to = ensureArrayValue(headers, 'To');
      result.cc = ensureArrayValue(headers, 'Cc');
      result.cco = ensureArrayValue(headers, 'Cco');
      result.subject = ensureValue(headers, 'Subject');
    }
  }

  return result;
};

// Se asegura de devolver un valor vacío o el valor del header a buscar
var ensureValue = function(headers, name) {
  var header = _.find(headers, { name: name });
  return header ? header.value : '';
};

// Se asegura de devolver un array vacío o el array del header a buscar
var ensureArrayValue = function(headers, name) {
  var header = _.find(headers, { name: name });
  return header ? header.value.split(', ') : [];
};

// Obtiene el cuerpo del mail, en formato texto y html
var getBodyFromPayload = function(googleEmail, contentType) {

  var result = {
    text: '',
    html: ''
  };

  var payload = googleEmail.payload;

  if (payload) {
    if (payload.body.size === 0) {
      var parts = payload.parts;

      if (parts && parts.length > 0) {
        result.text = findPartValue(parts, googleUtils.MIMETYPES.TEXT);
        result.html = findPartValue(parts, googleUtils.MIMETYPES.HTML);
      }
    }
    else if (payload.mimeType === googleUtils.MIMETYPES.HTML || payload.mimeType === googleUtils.MIMETYPES.TEXT) {
      result.html = payload.body.data;
      result.text = payload.body.data;
    }
  }

  return result;
};

// Encuentra recursivamente el valor del part pasado como parámetro en mimeType
var findPartValue = function(parts, mimeType) {

  // Chequea que parts sea un array para poder continuar la función, si no lo es vuelve
  if (!parts || parts.constructor !== Array) {
    return '';
  }

  var part = _.find(parts, { mimeType: mimeType });
  if (part && part.filename === '') {
    return part.body.data || '';
  }
  else {
    var result = '';
    for (var i = 0; result === '' && i < parts.length; i++) {
      result = findPartValue(parts[i].parts, mimeType);
    }
    return result;
  }
};

// Create a Gmail email
module.exports.create = function(refresh_token, from, body, callback) {

  googleUtils.getAccessToken(refresh_token, function(err, access_token) {

    if (err) {
      callback(err);
    }
    else {

      /*
       From: Unify Argentina <unify.argentina@gmail.com>
       To: Joel Márquez <90joelmarquez@gmail.com>, Unify Argentina <unify.argentina@gmail.com>
       Subject: Probando la fucking API de Gmail

       Holaaa
       * */

      var recipients = body.to.map(function(recipient) {
        return '<' + recipient + '>';
      }).join(', ');

      var ccs = '';
      if (body.cc) {
        ccs = 'Cc: ' + body.cc.map(function(eachCc) {
            return '<' + eachCc + '>';
          }).join(', ') + '\n';
      }

      var ccos = '';
      if (body.cco) {
        ccos = 'Bcc: ' + body.cco.map(function(eachCco) {
            return '<' + eachCco + '>';
          }).join(', ') + '\n';
      }

      var email = 'From: <' + from + '>\n' +
        'To: ' + recipients + '\n' + ccs + ccos +
        'Subject: ' + body.subject + '\n\n' + body.text;
      logger.debug('Email: ' + email);

      var emailEncodedBase64 = new Buffer(email).toString('base64');
      var emailEncodedURLBase64 = emailEncodedBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      logger.info('URL: ' + googleUtils.getUserEmailSendURL());
      var headers = { Authorization: 'Bearer ' + access_token };

      // Enviamos el email en formato url base 64
      request.post({ url: googleUtils.getUserEmailSendURL(), headers: headers, json: { raw: emailEncodedURLBase64 } }, function(err, response) {

        var result = googleErrors.hasError(err, response);
        if (result.hasError) {
          callback(result.error);
        }
        else {
          callback(null);
        }
      });
    }
  });
};

// Elimina un email de google
module.exports.delete = function(refresh_token, emailId, callback) {

  googleUtils.getAccessToken(refresh_token, function(err, access_token) {

    if (err) {
      callback(err);
    }
    else {
      var url = util.format(googleUtils.getUserEmailDeleteURL(), emailId);
      logger.info('URL: ' + url);

      var headers = { Authorization: 'Bearer ' + access_token };

      request.del({ url: url, headers: headers, json: true }, function(err, response) {
        var result = googleErrors.hasError(err, response);
        if (result.hasError) {
          callback(result.error);
        }
        else {
          callback(null);
        }
      });
    }
  });
};

// Marca el emailId como leído
module.exports.toggleEmailSeen = function(refresh_token, emailIds, toggle, callback) {

  googleUtils.getAccessToken(refresh_token, function(err, access_token) {

    if (err) {
      callback(err);
    }
    else {
      var count = 0;

      var authenticatedRequest = request.defaults({
        headers: { Authorization: 'Bearer ' + access_token }
      });

      // Por cada emailId, lo marcamos como leído o no leído
      emailIds.forEach(function(emailId) {

        count++;
        var url = util.format(googleUtils.getUserEmailModifyURL(), emailId);
        logger.info('URL: ' + url);

        var body = {};
        // Marcar como leído
        if (toggle) {
          body.removeLabelIds = ['UNREAD'];
        }
        // Marcar como no leído
        else {
          body.addLabelIds = ['UNREAD'];
        }

        authenticatedRequest.post({ url: url, json: body }, function(err, response) {
          var result = googleErrors.hasError(err, response);
          if (result.hasError) {
            callback(result.error);
          }
          else if (count === emailIds.length) {
            callback(null);
          }
        });
      });
    }
  });
};

// Mueve a la papelera de reciclaje un email
module.exports.toggleEmailTrash = function(refresh_token, emailIds, toggle, callback) {

  googleUtils.getAccessToken(refresh_token, function(err, access_token) {

    if (err) {
      callback(err);
    }
    else {
      var count = 0;

      var authenticatedRequest = request.defaults({
        headers: { Authorization: 'Bearer ' + access_token }
      });

      // Por cada emailId, lo movemos o lo sacamos de la papelera
      emailIds.forEach(function(emailId) {

        count++;
        var url = util.format(googleUtils.getUserEmailModifyURL(), emailId);
        logger.info('URL: ' + url);

        var body = {};
        // Lo movemos a la papelera
        if (toggle) {
          body.addLabelIds = ['TRASH'];
        }
        // Lo sacamos de la papelera y lo movemos a la bandeja de entrada
        else {
          body.removeLabelIds = ['TRASH'];
          body.addLabelIds = ['INBOX'];
        }

        authenticatedRequest.post({ url: url, json: body }, function(err, response) {
          var result = googleErrors.hasError(err, response);
          if (result.hasError) {
            callback(result.error);
          }
          else if (count === emailIds.length) {
            callback(null);
          }
        });
      });
    }
  });
};