'use strict';

module.exports = {
	MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/test',
	TOKEN_SECRET: process.env.TOKEN_SECRET || 'Token',
	FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'Facebook secret'
};