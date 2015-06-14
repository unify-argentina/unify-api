'use strict';

// requires
var router = require('express').Router();
var User = require('../api/user');

router.post('login', function(req, res) {
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'Password cannot be blank').notEmpty();
	var errors = req.validationErrors();

	if (errors) {
		return res.status(401).send({ message: 'Missing fields: email and/or password' });
	}

	User.findOne({ email: req.body.email }, function(err, user) {
		if (!user) {
			return res.status(401).send({ message: 'User doesn\'t exist' });
		}
		user.comparePassword(req.body.password, function(err, isMatch) {
			if (!isMatch) {
				return res.status(401).send({ message: 'Wrong password' });
			}
			res.send({ token: createJWT(user) });
		});
	});
});

module.exports = router;