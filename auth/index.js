'use strict';

// requires
var router = require('express').Router();

router.use('/local', require('./local'));

module.exports = router;