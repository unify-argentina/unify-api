/*
* Este módulo contiene todas las variables de entorno
* @author Joel Márquez
* */
'use strict';

module.exports = {
  MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/unify-dev',
  MONGODB_TEST: process.env.MONGODB || 'mongodb://localhost:27017/unify-test',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Token',
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'Facebook secret'
};