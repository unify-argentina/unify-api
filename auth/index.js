'use strict';

// requires
var router = require('express').Router();

router.use('/', require('./local'));

module.exports = router;