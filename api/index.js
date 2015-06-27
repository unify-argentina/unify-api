/*
* Este módulo se encarga de manejar la versión de la API, así como también
* de indicar el camino de todas las rutas de la API
* @author Joel Márquez
* */
'use strict';

// requires
var apiRoutes = require('express').Router();
var pjson = require('../package.json');
var jwt = require('./auth/jwt');
var moment = require('moment');
var config = require('../config/config');

/**
 * @api {get} /api Version
 * @apiGroup API
 *
 * @apiSuccess {String} version Version actual de la API
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "version": "0.0.1"
 *     }
 */
apiRoutes.get('/', function(req, res) {

  process.nextTick(function() {
    res.send({version: pjson.version});
  });
});

// Este método verifica que en el request haya un JSON Web Token no vencido, si no lo hay
// o ya venció, devuelve un error
apiRoutes.use(function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ errors: [{ msg: 'Please make sure your request has an Authorization header' }] });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.verify(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ errors: [{ msg: err.message }] });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ errors: [{ msg: 'Token has expired' }] });
  }
  req.user = payload.sub;
  next();
});

// Rutas de los círculos
apiRoutes.use('/user', require('./user'));

module.exports = apiRoutes;