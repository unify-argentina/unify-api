/*
* Este módulo se encarga de manejar la versión de la API, así como también
* de indicar el camino de todas las rutas de la API
* @author Joel Márquez
* */
'use strict';

// requires
var apiRoutes = require('express').Router();
var pjson = require('../package.json');
var jwt = require('./auth/util/jwt');

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
    return res.send({ version: pjson.version });
  });
});

// Este método verifica que en el request haya un JSON Web Token no vencido, si no lo hay
// o ya venció, devuelve un error
apiRoutes.use(jwt.ensureAuthenticated);

// Rutas de los usuarios
apiRoutes.use('/user', require('./user'));

// Rutas para subida de archivos
apiRoutes.use('/file', require('./files'));

module.exports = apiRoutes;