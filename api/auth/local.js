/*
* Este módulo maneja todo lo que es la autenticación de los usuarios, así como también
* los manejos de contraseñas, el reset y el update de las mismas y de los datos de los
* usuarios
* @author Joel Márquez
* */
'use strict';

// requires
var localRoutes = require('express').Router();
var User = require('../user/user.js');
var jwt = require('./jwt');

/**
 * @api {post} /auth/login Login
 * @apiGroup Autenticacion
 *
 * @apiParam {String} email Email del usuario
 * @apiParam {String} password Password del usuario
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
localRoutes.post('/login', function (req, res) {

  process.nextTick(function () {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('password', 'Required').notEmpty();
    req.assert('password', 'Only alphanumeric characters are allowed').isAscii();

    if (req.validationErrors()) {
      return res.status(401).send({ errors: req.validationErrors() });
    }

    if (typeof req.body.email === 'object' || typeof req.body.password === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    User.findOne({ email: req.body.email }, '+password', function (err, user) {
      if (!user) {
        return res.status(401).send({ errors: [{ msg: "User doesn't exist" }] });
      }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ errors: [{ msg: 'Wrong password' }] });
        }
        res.send({ token: jwt.createJWT(user) });
      });
    });
  });
});

/**
 * @api {post} /auth/signup Signup
 * @apiGroup Autenticacion
 *
 * @apiParam {String} email Email del usuario
 * @apiParam {String} name Nombre del usuario
 * @apiParam {String} password Password del usuario, debera tener 6 caracteres como minimo
 * @apiParam {String} confirm_password Tiene que ser igual que el password
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs"
 *     }
 */
localRoutes.post('/signup', function (req, res) {

  process.nextTick(function () {
    req.assert('email', 'Required').notEmpty();
    req.assert('email', 'Valid email required').isEmail();
    req.assert('name', 'Required').notEmpty();
    req.assert('name', 'Only alphanumeric characters are allowed').isAscii();
    req.assert('password', 'Password should have at least 6 characters of length').len(6, 100);
    req.assert('confirm_password', 'Required').notEmpty();
    req.assert('confirm_password', 'Confirm password must be equal to password').equals(req.body.password);

    if (req.validationErrors()) {
      return res.status(401).send({ errors: req.validationErrors() });
    }

    if (typeof req.body.email === 'object' || typeof req.body.name === 'object' ||
      typeof req.body.password === 'object' || typeof req.body.confirm_password === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ errors: [{ param: 'email', msg: 'Email is already taken' }] });
      }
      var user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        validLocalUser: true
      });
      user.save(function (err) {
        if (err) {
          return res.status(401).send({ errors: [{msg: 'Error saving data' + err }] });
        }
        res.status(200).send({ token: jwt.createJWT(user) });
      });
    });
  });
});

module.exports = localRoutes;