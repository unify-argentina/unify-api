/*
 * Este es el módulo que se encarga de controlar las acciones de busqueda de Instagram
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var logger = require('../../../config/logger');
var config = require('../../../config');
var instagramErrors = require('./instagram.errors');
var instagramUtils = require('./instagram.utils');

module.exports.search = function(access_token, instagram, query, callback) {

  var qs = {
    count: config.INSTAGRAM_MAX_SEARCH_COUNT,
    access_token: access_token
  };

  var lastMedia = instagram.last_search_id;
  if (lastMedia) {
    qs.min_tag_id = lastMedia;
  }

  if (!query) {
    query = instagram.last_search_term;
  }

  var url = instagramUtils.getSearchURL(query);
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  request.get({ url: url, qs: qs, json: true }, function(err, response) {

    var result = instagramErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    else {
      // Si no hubo error, tenemos que mapear el response
      async.map(response.body.data, instagramUtils.mapMedia, function(err, mappedMedia) {
        logger.debug('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};