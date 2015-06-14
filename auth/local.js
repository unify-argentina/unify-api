'use strict';

// requires
var router = require('express').Router();
var User = require('../api/user/user.model.js');
var jwt = require('./jwt');

// '/auth/login'
router.post('/login', function(req, res) {
	
	req.assert('email', 'required').notEmpty();
	req.assert('email', 'valid email required').isEmail();
	req.assert('password', '6 to 20 characters required').len(6, 20);

	if (req.validationErrors()) {
		return res.status(401).send({ errors: req.validationErrors() });
	}

	User.findOne({ email: req.body.email }, function(err, user) {
		if (!user) {
			return res.status(401).send({ message: 'User doesn\'t exist' });
		}
		user.comparePassword(req.body.password, function(err, isMatch) {
			if (!isMatch) {
				return res.status(401).send({ message: 'Wrong password' });
			}
			res.send({ token: jwt.createJWT(user) });
		});
	});
});

module.exports = router;