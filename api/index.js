'use strict';

// requires
var router = require('express').Router();
var pjson = require('../package.json');

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
router.get('/', function(req, res) {

  process.nextTick(function() {
    res.send({version: pjson.version});
  });
});

// Authentication route
router.use('/auth', require('./auth'));

module.exports = router;