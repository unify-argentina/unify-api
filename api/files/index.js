/*
 * Este es el módulo que se encarga de manejar las rutas de la subida de archivos
 * @author Joel Márquez
 * */
'use strict';

// requires
var filesRoutes = require('express').Router();
var filesController = require('./files.controller');
var logger = require('../../config/logger');

/**
 * @api {get} /api/sign?file_type=type Obtener URL de archivo
 * @apiGroup Archivos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} file_type El Content-Type del archivo a subir
 *
 * @apiSuccess {String} signed_request Request firmada por Amazon
 * @apiSuccess {String} url URL del archivo final
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "signed_request": "https://unifyargentina.s3-us-west-2.amazonaws.com/fb3.png?Content-Type=imag…a5d06b2ef11e321&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read",
 *         "url" : "https://unifyargentina.s3.amazonaws.com/fb3.png"
 *     }
 */
filesRoutes.get('/', filesController.getAmazonSignedURL);

module.exports = filesRoutes;