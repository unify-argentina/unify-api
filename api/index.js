'use strict';

// requires
var router = require('express').Router();
var pjson = require('../package.json');

/**
 * @api {get} /api Version
 * @apiName Version
 * @apiGroup API
 *
 * @apiSuccess {String} version Current API version
 */
router.get('/', function(req, res) {

  process.nextTick(function() {
    res.send({version: pjson.version});
  });
});

// Authentication route
router.use('/auth', require('./auth'));

module.exports = router;