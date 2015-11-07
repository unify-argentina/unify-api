/*
 * Este módulo se encarga de obtener los estados de Facebook
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var moment = require('moment');
var logger = require('../../../config/logger');
var config = require('../../../config');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');

// Devuelve los estados del usuario pasado por parámetro
module.exports.getStatuses = function(access_token, facebook, facebookId, callback) {

  var qs = {
    fields: 'id,message,updated_time,likes.limit(0).summary(true),comments.limit(0).summary(true)',
    limit: config.FACEBOOK_STATUSES_MAX_MEDIA_COUNT,
    access_token: access_token
  };

  var lastStatus = facebook.last_content_date_status;
  if (lastStatus) {
    qs.until = lastStatus - 1;
  }

  var url = util.format(facebookUtils.getUserStatusesURL(), facebookId);
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  request.get({ url: url, qs: qs, json: true }, function(err, response) {

    var result = facebookErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    else {
      // Primero filtramos los estados que no tienen mensaje
      async.filter(response.body.data, filter, function(filteredMedia) {
        // Ahora si, tenemos que mapear el response
        async.map(filteredMedia,
          // Recibe un objeto de tipo imagen y devuelve uno homogéneo a las 3 redes sociales
          function(facebookMedia, callback) {

            var mappedMedia = {
              provider: 'facebook',
              id: facebookMedia.id || '',
              type: 'text',
              created_time: moment(facebookMedia.updated_time, facebookUtils.getFacebookDateFormat(), 'en').unix() || '',
              likes: facebookMedia.likes.summary.total_count || 0,
              text: facebookMedia.message || '',
              link: facebookUtils.getFacebookURL() + facebookId + '_' + facebookMedia.id
            };

            callback(null, mappedMedia);
          },
          function(err, mappedMedia) {
            logger.debug('Media: ' + JSON.stringify(mappedMedia));
            callback(err, mappedMedia);
        });
      });
    }
  });
};

// Esta función filtra los estados que no tienen ningún mensaje
var filter = function(facebookMedia, callback) {
  callback(facebookMedia.message !== undefined);
};

// Publica un estado a Facebook
module.exports.publishStatus = function(access_token, text, callback) {

  var qs = { access_token: access_token };
  var url = facebookUtils.getUserPublishStatusesURL();

  logger.info('URL: ' + url + ' qs: ' + qs);

  var body = {
    message: text
  };

  request.post({ url: url, qs: qs, json: body }, function(err, response) {

    var result = facebookErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error);
    }
    else {
      callback(null);
    }
  });
};