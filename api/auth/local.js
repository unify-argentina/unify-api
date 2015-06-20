'use strict';

// requires
var router = require('express').Router();
var User = require('../user/user.model.js');
var jwt = require('./jwt');


/**
 * @api {post} /api/auth/login Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 *
 * @apiSuccess {String} token Valid access token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NTg0ZTc0MGRkOTlkNDllMzQ0MGRkM2IiLCJpYXQiOjE0MzQ3NzMzMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
router.post('/login', function (req, res) {

  process.nextTick(function () {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('password', 'Required').notEmpty();
    req.assert('password', 'Only alphanumeric characters are allowed').isAscii();

    if (req.validationErrors()) {
      return res.status(401).send({errors: req.validationErrors()});
    }

    if (typeof req.body.email === 'object' || typeof req.body.password === 'object') {
      return res.status(401).send({errors: [{msg: "You're trying to send object data types"}]});
    }

    User.findOne({email: req.body.email}, function (err, user) {
      if (!user) {
        return res.status(401).send({errors: [{msg: "User doesn't exist"}]});
      }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({errors: [{msg: 'Wrong password'}]});
        }
        res.send({token: jwt.createJWT(user)});
      });
    });
  });
});

/**
 * @api {post} /api/auth/signup Signup
 * @apiName Signup
 * @apiGroup Authentication
 *
 * @apiParam {String} email User email
 * @apiParam {String} name User name
 * @apiParam {String} password User password, must be at least 6 characters of length
 * @apiParam {String} confirm_password Same as password, they must be identical
 *
 * @apiSuccess {String} token Valid access token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NTg0ZTc0MGRkOTlkNDllMzQ0MGRkM2IiLCJpYXQiOjE0MzQ3NzMzMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
router.post('/signup', function (req, res) {

  process.nextTick(function () {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('name', 'Required').notEmpty();
    req.assert('name', 'Only alphanumeric characters are allowed').isAscii();
    req.assert('password', 'Password should have at least 6 characters of length').len(6, 100);
    req.assert('confirm_password', 'Required').notEmpty();
    req.assert('confirm_password', 'Confirm password must be equal to password').equals(req.body.password);

    if (req.validationErrors()) {
      return res.status(401).send({errors: req.validationErrors()});
    }

    if (typeof req.body.email === 'object' || req.body.name === 'object' ||
      typeof req.body.password === 'object' || typeof req.body.confirm_password === 'object') {
      return res.status(401).send({errors: [{msg: "You're trying to send object data types"}]});
    }

    User.findOne({email: req.body.email}, function (err, existingUser) {
      if (existingUser) {
        return res.status(409).send({errors: [{param: 'email', msg: 'Email is already taken'}]});
      }
      var user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      });
      user.save(function (err) {
        if (err) {
          return res.status(401).send({errors: [{msg: 'Error saving data' + err}]});
        }
        res.send({token: jwt.createJWT(user)});
      });
    });
  });
});

module.exports = router;