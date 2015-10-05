/*
 * Este es el módulo que se encarga de manejar las rutas de la subida de archivos
 * @author Joel Márquez
 * */
'use strict';

// requires
var filesRoutes = require('express').Router();
var filesController = require('./files.controller');
var multer  = require('multer');
var config = require('../../config');
var logger = require('../../config/logger');

var upload = multer({ limits: { fileSize: 10 * 1024 * 1024 }, storage: multer.diskStorage({}) });

/**
 * @api {post} /api/file Subir archivo
 * @apiGroup Archivos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {File} file Archivo a subir
 *
 * @apiSuccess {String} url URL del archivo subido a Amazon
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "url": "https://unifyargentina.s3-us-west-2.amazonaws.com/56106d1b0b6074091bed5bf8_1444003759_contacto.png"
 *     }
 */
filesRoutes.post('/', upload.single('file'), filesController.uploadFile);

module.exports = filesRoutes;