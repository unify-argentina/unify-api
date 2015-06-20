'use strict';

// requires
var router = require('express').Router();

router.use('/', require('./local'));
router.use('/facebook', require('./facebook'));

module.exports = router;