/*
* Este módulo contiene todas las variables de entorno
* @author Joel Márquez
* */
'use strict';

module.exports = {

  // Accepted origins
  CROSS_DOMAIN_URLS: ['http://localhost:9000', 'http://127.0.0.1:9000', 'http://www.myunify.io'],

  // Logger
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  // Mongo DB
  MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/unify-dev',
  MONGODB_TEST: process.env.MONGODB || 'mongodb://localhost:27017/unify-test',

  // Json Web Token
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Token',

  // Facebook
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'FACEBOOK secret',

  // Twitter
  TWITTER_SECRET: process.env.TWITTER_SECRET || 'TWITTER secret',
  TWITTER_KEY: process.env.TWITTER_KEY || 'TWITTER key',
  TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'http://localhost:9000',

  // Instagram
  INSTAGRAM_SECRET: process.env.INSTAGRAM_SECRET || 'INSTAGRAM secret',

  // Google
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'GOOGLE secret'
};