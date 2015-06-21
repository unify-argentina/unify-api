/*
* Este módulo se encarga de manejar las rutas de autenticación, que van dirigidas
* vía /api/auth
* @author Joel Márquez
* */
'use strict';

// requires
var router = require('express').Router();

router.use('/', require('./local'));
router.use('/facebook', require('./facebook'));

module.exports = router;