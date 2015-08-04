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
 *     {
 *         "circle": {
 *             "contacts": [
 *                 {
 *                     "user": "55c02cc70cce13ec28bd7ec1",
 *                     "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large",
 *                     "name": "Joel",
 *                     "_id": "55c0315cccab88ba31786d71",
 *                     "__v": 0,
 *                     "parents": [
 *                         {
 *                             "circle": "55c02cc80cce13ec28bd7ec2",
 *                             "_id": "55c0315cccab88ba31786d72",
 *                             "ancestors": [
 *                                 "55c02cc80cce13ec28bd7ec2"
 *                             ]
 *                         }
 *                     ],
 *                     "instagram": {
 *                         "username": "joe__marquez",
 *                         "id": "993803680"
 *                     },
 *                     "twitter": {
 *                         "username": "joelmarquez90",
 *                         "id": "42704750"
 *                     },
 *                     "facebook": {
 *                         "display_name": "Joel Márquez",
 *                         "id": "10153267328674738"
 *                     }
 *                 },
 *                 {
 *                     "user": "55c02cc70cce13ec28bd7ec1",
 *                     "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10832234_314287438773030_212898401_a.jpg",
 *                     "name": "Alejo",
 *                     "_id": "55c0316dccab88ba31786d73",
 *                     "__v": 0,
 *                     "parents": [
 *                         {
 *                             "circle": "55c02cc80cce13ec28bd7ec2",
 *                             "_id": "55c0316dccab88ba31786d74",
 *                             "ancestors": [
 *                                 "55c02cc80cce13ec28bd7ec2"
 *                             ]
 *                         }
 *                     ],
 *                     "instagram": {
 *                         "username": "aleagb23",
 *                         "id": "1574863419"
 *                     },
 *                     "twitter": {
 *                         "username": "aleagb23",
 *                         "id": "261365528"
 *                     },
 *                     "facebook": {
 *                         "display_name": "Alejo García",
 *                         "id": "10205153877979641"
 *                     }
 *                 }
 *             ],
 *             "media": {
 *                 "count": 4,
 *                 "list": [
 *                     {
 *                         "provider": "twitter",
 *                         "id": "628281888210321408",
 *                         "type": "video",
 *                         "created_time": 1438629049,
 *                         "link": "https://twitter.com/statuses/628281888210321408",
 *                         "likes": 0,
 *                         "text": "http://t.co/IkL1oTkgq1",
 *                         "user_has_liked": false,
 *                         "contact": {
 *                             "id": "55c0316dccab88ba31786d73",
 *                             "name": "Alejo",
 *                             "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10832234_314287438773030_212898401_a.jpg"
 *                         }
 *                     },
 *                     {
 *                         "provider": "facebook",
 *                         "id": "10153491173094738",
 *                         "type": "image",
 *                         "created_time": 1438482468,
 *                         "link": "https://www.facebook.com/photo.php?fbid=10153491173094738&set=a.10152154863139738.1073741830.826764737&type=1",
 *                         "media_url": "https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/11817260_10153491173094738_5949918706607306589_n.jpg?oh=4f851773c7660e1ddbe34cb477627ae8&oe=5656DEED&__gda__=1448770591_84ba495cc3a3554a2bc842d1653f1ca8",
 *                         "text": "Pami, pati, pael, paella",
 *                         "contact": {
 *                             "id": "55c0315cccab88ba31786d71",
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
 *                             "id": "55c0315cccab88ba31786d71",
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
 *                             "id": "55c0315cccab88ba31786d71",
 *                             "name": "Joel",
 *                             "picture": "https://graph.facebook.com/v2.3/10153267328674738/picture?type=large"
 *                         }
 *                     }
 *                 ]
 *             },
 *             "name": "Main Circle",
 *             "_id": "55c02cc80cce13ec28bd7ec2",
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