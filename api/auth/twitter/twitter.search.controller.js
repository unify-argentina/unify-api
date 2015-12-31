/*
 * Este es el módulo que se encarga de controlar las acciones de busqueda de Twitter
 * @author Joel Márquez
 * */
'use strict';

var util = require('util');
var request = require('request');
var async = require('async');
var bignum = require('bignum');
var config = require('../../../config');
var logger = require('../../../config/logger');
var twitterUtils = require('./twitter.utils');
var twitterErrors = require('./twitter.errors');

module.exports.search = function(access_token, twitter, query, callback) {

  var qs = {
    count: config.TWITTER_MAX_SEARCH_COUNT,
    q: query
  };

  var lastTweetId = twitter.last_search_id;
  if (lastTweetId) {
    // https://dev.twitter.com/rest/public/timelines
    qs.max_id = bignum(lastTweetId).sub('1').toString();
  }

  var url = twitterUtils.getSearchURL();
  logger.info('URL: ' + url + ' qs: ' + JSON.stringify(qs));

  request.get({ url: url, oauth: twitterUtils.getOauthParam(access_token), qs: qs, json: true }, function(err, response) {
    var result = twitterErrors.hasError(err, response);
    if (result.hasError) {
      callback(null, result.error);
    }
    // Si no hubo error, tenemos que mapear el response
    else {
      async.map(response.body, twitterUtils.mapMedia, function(err, mappedMedia) {
        logger.debug('Media: ' + JSON.stringify(mappedMedia));
        callback(err, mappedMedia);
      });
    }
  });
};