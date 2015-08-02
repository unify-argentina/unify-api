/*
 * Este es el módulo que se encarga de manejar las rutas de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var circleRoutes = require('express').Router();
var circleController = require('./circle.controller');
var mediaController = require('./circle.media.controller');
var logger = require('../../config/logger');

// modelos
var User = require('../user/user.model');
var Circle = require('./circle.model');

// Esto lo que hace es verificar que cada vez que se envíe un circle_id como parámetro en una ruta,
// efectivamente pertenezca al usuario loggeado
circleRoutes.param('circle_id', function(req, res, next, circleId) {
  // Validamos nosql injection
  if (typeof circleId !== 'string') {
    return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }

  // Buscamos el usuario del request y verificamos que el circle_id pertenezca a este usuario
  Circle.findOne({ _id: circleId, user: req.user })
    .populate('user ancestors')
    .exec(function(err, circle) {
      if (err || !circle) {
        logger.warn("You are trying to find a circle=" + circleId + " that doesn't belong to you");
        return res.status(401).send({ errors: [{ msg: "You are trying to find a circle that doesn't belong to you" }] });
      }
      else {
        req.circle = circle;
        next();
      }
    });
});

/**
 * @api {post} /api/user/:user_id/circle Crear un circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} name Nombre del circulo a crear
 * @apiParam {String} parent_id Id del circulo padre
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "name":"Amigos",
 *      "parent_id":"55936a0460bb409c379800b7"
 *    }
 *
 * @apiSuccess {Object} circle Circulo creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "circle":{
 *        "parent":"55936a0460bb409c379800b7",
 *        "name":"Amigos",
 *        "_id":"559ebc91dc9167e815a750b7",
 *        "__v":0,
 *        "ancestors":[
 *          "559eba8109b6aee614e3f733",
 *          "559ebc0ddc9167e815a750b5",
 *          "55936a0460bb409c379800b7"
 *        ]
 *      }
 *    }
 */
circleRoutes.post('/', circleController.create);

/**
 * @api {get} /api/user/:user_id/circle/:circle_id Obtener circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} circle_id Id del circulo
 *
 * @apiSuccess {Object} circle Circulo
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *     {
 *         "circle": {
 *             "contacts": [
 *                 {
 *                     "user": "55be9bb91f8bd56a4fab63f0",
 *                     "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large",
 *                     "name": "Joel",
 *                     "instagram_id": "993803680",
 *                     "twitter_id": "42704750",
 *                     "facebook_id": "10153267328674738",
 *                     "_id": "55bea6eaad16a7e3588b1ca7",
 *                     "__v": 0,
 *                     "parents": [
 *                         {
 *                             "circle": "55be9bbb1f8bd56a4fab63f1",
 *                             "_id": "55bea6eaad16a7e3588b1ca8",
 *                             "ancestors": [
 *                                 "55be9bbb1f8bd56a4fab63f1"
 *                             ]
 *                         }
 *                     ]
 *                 },
 *                 {
 *                     "user": "55be9bb91f8bd56a4fab63f0",
 *                     "picture": "https://graph.facebook.com/v2.3/10205153877979641/picture?type=large",
 *                     "name": "Alejo",
 *                     "instagram_id": "1574863419",
 *                     "twitter_id": "261365528",
 *                     "facebook_id": "10205153877979641",
 *                     "_id": "55beabbba6d239e95b50075b",
 *                     "__v": 0,
 *                     "parents": [
 *                         {
 *                             "circle": "55beaba5a6d239e95b50075a",
 *                             "_id": "55beabbba6d239e95b50075c",
 *                             "ancestors": [
 *                                 "55beaba5a6d239e95b50075a",
 *                                 "55be9bbb1f8bd56a4fab63f1"
 *                             ]
 *                         }
 *                     ]
 *                 }
 *             ],
 *             "media": {
 *                 "count": 6,
 *                 "list": [
 *                     {
 *                         "provider": "facebook",
 *                         "id": "10153491173094738",
 *                         "type": "image",
 *                         "created_time": 1438482468,
 *                         "link": "https://www.facebook.com/photo.php?fbid=10153491173094738&set=a.10152154863139738.1073741830.826764737&type=1",
 *                         "media_url": "https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/11817260_10153491173094738_5949918706607306589_n.jpg?oh=4f851773c7660e1ddbe34cb477627ae8&oe=5656DEED&__gda__=1448770591_84ba495cc3a3554a2bc842d1653f1ca8",
 *                         "text": "Pami, pati, pael, paella",
 *                         "contact": {
 *                             "id": "55bea6eaad16a7e3588b1ca7",
 *                             "name": "Joel",
 *                             "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *                         }
 *                     },
 *                     {
 *                         "provider": "twitter",
 *                         "id": "627667076744904704",
 *                         "type": "text",
 *                         "created_time": 1438482467,
 *                         "link": "https://twitter.com/statuses/627667076744904704",
 *                         "likes": 0,
 *                         "text": "Pami, pati, pael, paella @ Charly's House https://t.co/181HbfsaEv",
 *                         "user_has_liked": false,
 *                         "contact": {
 *                             "id": "55bea6eaad16a7e3588b1ca7",
 *                             "name": "Joel",
 *                             "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *                         }
 *                     },
 *                     {
 *                         "provider": "instagram",
 *                         "id": "1042388941278905607_993803680",
 *                         "type": "image",
 *                         "created_time": 1438482466,
 *                         "link": "https://instagram.com/p/53TzgiuYUHAinWlkLpGfEoP160Kccs90O22Es0/",
 *                         "likes": 5,
 *                         "media_url": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11376143_1476803242620418_1662626864_n.jpg",
 *                         "text": "Pami, pati, pael, paella",
 *                         "user_has_liked": "",
 *                         "contact": {
 *                             "id": "55bea6eaad16a7e3588b1ca7",
 *                             "name": "Joel",
 *                             "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *                         }
 *                     },
 *                     {
 *                         "provider": "twitter",
 *                         "id": "625702932302970882",
 *                         "type": "text",
 *                         "created_time": 1438014178,
 *                         "link": "https://twitter.com/statuses/625702932302970882",
 *                         "likes": 0,
 *                         "text": "El spot de Altamira en el que Scioli, Macri y Massa emulan los 3 Chiflados es lo más grande que hay..",
 *                         "user_has_liked": false,
 *                         "contact": {
 *                             "id": "55beabbba6d239e95b50075b",
 *                             "name": "Alejo",
 *                             "picture": "https://graph.facebook.com/v2.3/10205153877979641/picture?type=large"
 *                         }
 *                     },
 *                     {
 *                         "provider": "instagram",
 *                         "id": "1032419311030202502_1574863419",
 *                         "type": "image",
 *                         "created_time": 1437293994,
 *                         "link": "https://instagram.com/p/5T4-S1NXCG/",
 *                         "likes": 8,
 *                         "media_url": "https://scontent.cdninstagram.com/hphotos-xtp1/t51.2885-15/s640x640/sh0.08/e35/10499264_1058431774190878_494207365_n.jpg",
 *                         "text": "Gracias Carlitos por volver.. #Boca #BocaJuniors #Tevez",
 *                         "user_has_liked": "",
 *                         "contact": {
 *                             "id": "55beabbba6d239e95b50075b",
 *                             "name": "Alejo",
 *                             "picture": "https://graph.facebook.com/v2.3/10205153877979641/picture?type=large"
 *                         }
 *                     },
 *                     {
 *                         "provider": "facebook",
 *                         "id": "10205141615393084",
 *                         "type": "image",
 *                         "created_time": 1431099507,
 *                         "link": "https://www.facebook.com/photo.php?fbid=10205141615393084&set=a.10203978678240382.1073741825.1025603691&type=1",
 *                         "media_url": "https://scontent.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/11111209_10205141615393084_5968826018430732303_n.jpg?oh=97d88517956b5472d2552129273e2b86&oe=564920FF",
 *                         "text": "Cómo se pone la clínica los jueves a la noche!! #ChauChauApéndice #ÓrganoInútil",
 *                         "contact": {
 *                             "id": "55beabbba6d239e95b50075b",
 *                             "name": "Alejo",
 *                             "picture": "https://graph.facebook.com/v2.3/10205153877979641/picture?type=large"
 *                         }
 *                     }
 *                 ]
 *             },
 *             "name": "Main Circle",
 *             "_id": "55be9bbb1f8bd56a4fab63f1",
 *             "__v": 0,
 *             "ancestors": [
 *             ]
 *         }
 *     }
 */
circleRoutes.get('/:circle_id', mediaController.getMedia);

/**
 * @api {put} /api/user/:user_id/circle/:circle_id Actualizar un circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} circle_id Id del circulo a actualizar
 * @apiParam {String} name Nuevo nombre del circulo a actualizar
 * @apiParam {String} parent_id Nuevo id padre del circulo a actualizar
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "name":"Amigos",
 *      "parent_id":"55936a0460bb409c379800b7"
 *    }
 *
 * @apiSuccess {Object} circle Circulo creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "circle":{
 *        "parent":"55936a0460bb409c379800b7",
 *        "name":"Amigos",
 *        "_id":"559ebc91dc9167e815a750b7",
 *        "__v":0,
 *        "ancestors":[
 *          "559eba8109b6aee614e3f733",
 *          "559ebc0ddc9167e815a750b5",
 *          "55936a0460bb409c379800b7"
 *        ]
 *      }
 *    }
 */
circleRoutes.put('/:circle_id', circleController.update);

/**
 * @api {delete} /api/user/:user_id/circle/:circle_id Eliminar un circulo
 * @apiGroup Circulos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} circle_id Id del circulo a borrar (no puede ser el círculo principal)
 *
 * @apiSuccess {String} circle Id del circulo eliminado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "circle":"55936a0460bb409c379800b7"
 *    }
 */
circleRoutes.delete('/:circle_id', circleController.delete);

module.exports = circleRoutes;