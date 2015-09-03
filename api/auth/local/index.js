/*
* Este módulo maneja todas las rutas de autenticación de Unify
* @author Joel Márquez
* */
'use strict';

// requires
var localRoutes = require('express').Router();
var localController = require('./local.controller');
var jwt = require('../util/jwt');

/**
 * @api {post} /auth/login Login
 * @apiGroup Autenticacion
 *
 * @apiParam {String} email Email del usuario
 * @apiParam {String} password Password del usuario
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "email":"unify.argentina@gmail.com",
 *      "password":"hola1234",
 *    }
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWJjM2MyN2JmYTU0MGVhMmM0MzJjZGMiLCJpYXQiOjE0MzgzOTk2NDUsImV4cCI6MTQ0MDk5MTY0NX0.lrrs4_S3qZ7roqmJeCr3nNAXxmPURlYhZlUA7IOcn2w",
 *         "user": {
 *             "__v": 0,
 *             "_id": "55bc3c27bfa540ea2c432cdc",
 *             "email": "90joelmarquez@gmail.com",
 *             "main_circle": {
 *                 "user": "55bc3c27bfa540ea2c432cdc",
 *                 "name": "Main Circle",
 *                 "_id": "55bc3c29bfa540ea2c432cdd",
 *                 "__v": 0,
 *                 "ancestors": [
 *                 ]
 *             },
 *             "name": "Joel",
 *             "google": {
 *                 "display_name": "Joel Márquez",
 *                 "email": "90joelmarquez@gmail.com",
 *                 "picture": "https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200"
 *             },
 *             "instagram": {
 *                 "display_name": "Joel Márquez",
 *                 "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg",
 *                 "username": "joe__marquez"
 *             },
 *             "twitter": {
 *                 "display_name": "Joel Márquez",
 *                 "picture": "http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg",
 *                 "username": "joelmarquez90"
 *             },
 *             "facebook": {
 *                 "display_name": "Joel Márquez",
 *                 "email": "90joelmarquez@gmail.com",
 *                 "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *             },
 *             "valid_local_user": true,
 *             "verified": true
 *         }
 *     }
 */
localRoutes.post('/login', localController.login);

/**
 * @api {post} /auth/signup Signup
 * @apiGroup Autenticacion
 *
 * @apiParam {String} email Email del usuario
 * @apiParam {String} name Nombre del usuario
 * @apiParam {String} password Password del usuario, debera tener 6 caracteres como minimo
 * @apiParam {String} confirm_password Tiene que ser igual que el password
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "email":"unify.argentina@gmail.com",
 *      "name":"Juan Losa",
 *      "confirm_password":"hola1234",
 *      "password":"hola1234"
 *    }
 *
 * @apiSuccess {String} token Token de acceso valido
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI4M2VkM2Y0NjAxZmMxMTFhYjcyMWY",
 *         "user": {
 *             "main_circle": {
 *                 "__v": 0,
 *                 "user": "55b83ed3f4601fc111ab721f",
 *                 "name": "Main Circle",
 *                 "_id": "55b83ed4f4601fc111ab7220",
 *                 "ancestors": [
 *                 ]
 *             },
 *             "__v": 0,
 *             "email": "90joelmarquez2@gmail.com",
 *             "name": "Joel",
 *             "_id": "55b83ed3f4601fc111ab721f",
 *             "valid_local_user": true,
 *             "verified": false
 *         }
 *     }
 */
localRoutes.post('/signup', localController.signup);

module.exports = localRoutes;