'use strict';

module.exports = function(app) {
	
	// Users API
	//app.use('/api/users', require('./api/user'));

	// Authentication route
	app.use('/auth', require('./auth'));
};