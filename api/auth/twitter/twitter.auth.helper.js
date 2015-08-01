/*
 * Este módulo es un helper para devolver los parámetros de OAuth para
 * hacer un request a Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var config = require('../../../config');

module.exports.getOauthParam = function(access_token) {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    token: access_token.token,
    token_secret: access_token.token_secret
  };
};