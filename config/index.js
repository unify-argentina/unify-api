/*
* Este módulo contiene todas las variables de entorno
* @author Joel Márquez
* */
'use strict';

module.exports = {

  // Amazon
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'Amazon key id',
  AWS_BUCKET: process.env.AWS_BUCKET || 'unifyargentina',
  AWS_REGION: process.env.AWS_REGION || 'us-west-2',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'Amazon secret access key',

  // Base URL
  BASE_API_URL: process.env.BASE_API_URL || 'http://localhost:8080',

  // Accepted origins
  CROSS_DOMAIN_URLS: ['http://localhost:9000', 'http://127.0.0.1:9000', 'http://www.myunify.io', 'http://test-unify.herokuapp.com'],

  // Email,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'unify',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'Gmail',
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || 'unify.argentina@gmail.com',

  // Facebook
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'FACEBOOK secret',

  // Google
  GOOGLE_ID: process.env.GOOGLE_ID || 'GOOGLE id',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'GOOGLE secret',

  // Instagram
  INSTAGRAM_SECRET: process.env.INSTAGRAM_SECRET || 'INSTAGRAM secret',

  // Logger
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  // Mongo DB
  MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/unify-dev',
  MONGODB_TEST: process.env.MONGODB || 'mongodb://localhost:27017/unify-test',

  // Port
  PORT: process.env.PORT || 8080,

  // Json Web Token
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Token',

  // Twitter
  TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'http://localhost:9000',
  TWITTER_KEY: process.env.TWITTER_KEY || 'TWITTER key',
  TWITTER_SECRET: process.env.TWITTER_SECRET || 'TWITTER secret'
};