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
    return res.status(400).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }

  // Buscamos el usuario del request y verificamos que el circle_id pertenezca a este usuario
  Circle.findOne({ _id: circleId, user: req.user })
    .populate('user ancestors')
    .exec(function(err, circle) {
      if (err || !circle) {
        logger.warn("You are trying to find a circle=" + circleId + " that doesn't belong to you");
        return res.status(400).send({ errors: [{ msg: "You are trying to find a circle that doesn't belong to you" }] });
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
 * @apiParam {String} [picture] URL de la imagen del circulo
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "name":"Amigos",
 *      "parent_id":"55936a0460bb409c379800b7",
 *      "picture":"http://www.sabiask.com/images/Image/perro.jpg"
 *    }
 *
 * @apiSuccess {Object} circle Circulo creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "circle":{
 *         "parent":"55936a0460bb409c379800b7",
 *         "name":"Amigos",
 *         "picture":"http://www.sabiask.com/images/Image/perro.jpg",
 *         "_id":"559ebc91dc9167e815a750b7",
 *         "__v":0,
 *         "ancestors":[
 *           "559eba8109b6aee614e3f733",
 *           "559ebc0ddc9167e815a750b5",
 *           "55936a0460bb409c379800b7"
 *         ]
 *       }
 *     }
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
 *                     "user": "55c421354037f03842898378",
 *                     "picture": "https://graph.facebook.com/v2.3/176063032413299/picture?type=large",
 *                     "name": "Leo Messi",
 *                     "_id": "55c778f417d75075277f3b48",
 *                     "__v": 0,
 *                     "parents": [
 *                         {
 *                             "circle": "55c421364037f03842898379",
 *                             "_id": "55c778f417d75075277f3b49",
 *                             "ancestors": [
 *                                 "55c421364037f03842898379"
 *                             ]
 *                         }
 *                     ],
 *                     "instagram": {
 *                         "username": "leomessi",
 *                         "id": "427553890"
 *                     },
 *                     "facebook": {
 *                         "display_name": "Leo Messi",
 *                         "id": "176063032413299"
 *                     }
 *                 },
 *                 {
 *                     "user": "55c421354037f03842898378",
 *                     "picture": "https://graph.facebook.com/v2.3/10206413202905994/picture?type=large",
 *                     "name": "Flore Joffré",
 *                     "_id": "55cab7542337df552818e540",
 *                     "__v": 0,
 *                     "parents": [
 *                         {
 *                             "circle": "55c421364037f03842898379",
 *                             "_id": "55cab7542337df552818e541",
 *                             "ancestors": [
 *                                 "55c421364037f03842898379"
 *                             ]
 *                         }
 *                     ],
 *                     "instagram": {
 *                         "username": "florejoffre",
 *                         "id": "1244524526"
 *                     },
 *                     "twitter": {
 *                         "username": "FloreJoffre",
 *                         "id": "197249917"
 *                     },
 *                     "facebook": {
 *                         "display_name": "Flore Joffré",
 *                         "id": "10206413202905994"
 *                     }
 *                 }
 *             ],
 *             "name": "Main Circle",
 *             "_id": "55c421364037f03842898379",
 *             "__v": 0,
 *             "ancestors": [
 *             ]
 *         }
 *     }
 */
circleRoutes.get('/:circle_id', circleController.getById);

/**
 * @api {get} /api/user/:user_id/circle/:circle_id/tree Obtener subcirculos
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
 * @apiSuccess {Object} tree Subcirculos
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "tree": [
 *             {
 *                 "_id": "55c421364037f03842898379",
 *                 "name": "Main Circle",
 *                 "subcircles": [
 *                     {
 *                         "_id": "55c427f69ad9fb6848a1fa72",
 *                         "name": "Familia",
 *                         "picture": "http://www.granada.escolapiosemaus.org/blogs/primariaingles/wp-content/uploads/sites/9/2014/10/family-home.png",
 *                         "parent": "55c421364037f03842898379",
 *                         "subcircles": [
 *                             {
 *                                 "_id": "55c4284c9ad9fb6848a1fa73",
 *                                 "name": "Materna",
 *                                 "picture": "http://www.healthyplace.com/blogs/relationshipsandmentalillness/files/2015/05/3d-happy-family-1.jpg",
 *                                 "parent": "55c427f69ad9fb6848a1fa72",
 *                                 "subcircles": [
 *                                 ]
 *                             },
 *                             {
 *                                 "_id": "55c4285b9ad9fb6848a1fa74",
 *                                 "name": "Paterna",
 *                                 "picture": "http://www.mindfuljourneycenter.com/wp-content/uploads/2014/07/couples-family-therapy.jpg",
 *                                 "parent": "55c427f69ad9fb6848a1fa72",
 *                                 "subcircles": [
 *                                 ]
 *                             }
 *                         ]
 *                     },
 *                     {
 *                         "_id": "55c428849ad9fb6848a1fa75",
 *                         "name": "Amigos",
 *                         "picture": "http://blackfriendconnect.com/wp-content/uploads/2013/07/rent-a-black-friend-picture-new1.jpg",
 *                         "parent": "55c421364037f03842898379",
 *                         "subcircles": [
 *                             {
 *                                 "_id": "55c428989ad9fb6848a1fa76",
 *                                 "name": "Facu",
 *                                 "picture": "http://www.unialliance.ac.uk/wp-content/uploads/2012/12/Caerleon-Lawn-21.jpg",
 *                                 "parent": "55c428849ad9fb6848a1fa75",
 *                                 "subcircles": [
 *                                     {
 *                                         "_id": "55c580811b6268f35b007af8",
 *                                         "name": "Primer Año",
 *                                         "parent": "55c428989ad9fb6848a1fa76",
 *                                         "subcircles": [
 *                                             {
 *                                                 "_id": "55c5819455fdcea25c9f5607",
 *                                                 "name": "Primer cuatrimestre",
 *                                                 "parent": "55c580811b6268f35b007af8",
 *                                                 "subcircles": [
 *                                                 ]
 *                                             }
 *                                         ]
 *                                     }
 *                                 ]
 *                             },
 *                             {
 *                                 "_id": "55c428a69ad9fb6848a1fa77",
 *                                 "name": "Cole",
 *                                 "picture": "http://images.idiva.com/media/content/2011/Dec/hot_to_make_friends_at_college.jpg",
 *                                 "parent": "55c428849ad9fb6848a1fa75",
 *                                 "subcircles": [
 *                                 ]
 *                             }
 *                         ]
 *                     }
 *                 ]
 *             }
 *         ]
 *     }
 */
circleRoutes.get('/:circle_id/tree', circleController.getTree);

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
 * @apiParam {String} [picture] URL de la imagen del circulo
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "name":"Amigos",
 *      "parent_id":"55936a0460bb409c379800b7",
 *      "picture":"http://www.sabiask.com/images/Image/perro.jpg"
 *    }
 *
 * @apiSuccess {Object} circle Circulo creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *       "circle":{
 *         "parent":"55936a0460bb409c379800b7",
 *         "name":"Amigos",
 *         "picture":"http://www.sabiask.com/images/Image/perro.jpg",
 *         "_id":"559ebc91dc9167e815a750b7",
 *         "__v":0,
 *         "ancestors":[
 *           "559eba8109b6aee614e3f733",
 *           "559ebc0ddc9167e815a750b5",
 *           "55936a0460bb409c379800b7"
 *         ]
 *       }
 *     }
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
 *     {
 *       "circle":"55936a0460bb409c379800b7"
 *     }
 */
circleRoutes.delete('/:circle_id', circleController.delete);

/**
 * @api {get} /api/user/:user_id/circle/:circle_id/media Obtener contenido de un circulo
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
 *         "circle_id": "55da99dff7c2a1864235b6fb",
 *         "media": {
 *             "count": 4,
 *             "list": [
 *                 {
 *                     "provider": "facebook",
 *                     "id": "1078735248812735",
 *                     "type": "image",
 *                     "created_time": 1439410963,
 *                     "link": "https://www.facebook.com/LeoMessi/photos/a.1078734215479505.1073741903.176063032413299/1078735248812735/?type=1",
 *                     "likes": 7896,
 *                     "media_url": "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xft1/t31.0-8/11872298_1078735248812735_5228412966569443985_o.jpg",
 *                     "text": "FC BARCELONA vs SEVILLA CF / UEFA SUPER CUP",
 *                     "contact": {
 *                         "id": "55c778f417d75075277f3b48",
 *                         "name": "Leo Messi",
 *                         "picture": "https://graph.facebook.com/v2.3/176063032413299/picture?type=large"
 *                     }
 *                 },
 *                 {
 *                     "provider": "twitter",
 *                     "id": "631552235424600064",
 *                     "type": "video",
 *                     "created_time": 1439408761,
 *                     "link": "https://twitter.com/statuses/631552235424600064",
 *                     "likes": 0,
 *                     "text": "RT @sergiolapegue: RT Esta imagen duele.Se llama Gabriel Márquez de Areco, muchos están así. Los ayudamos? Escriban a @VergaraFernando. htt…",
 *                     "user_has_liked": false,
 *                     "contact": {
 *                         "id": "55cab7542337df552818e540",
 *                         "name": "Flore Joffré",
 *                         "picture": "https://graph.facebook.com/v2.3/10206413202905994/picture?type=large"
 *                     }
 *                 },
 *                 {
 *                     "provider": "instagram",
 *                     "id": "1029692922439453727_427553890",
 *                     "type": "video",
 *                     "created_time": 1436968983,
 *                     "link": "https://instagram.com/p/5KNEHlvMwf/",
 *                     "likes": 761575,
 *                     "media_url": "https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11758526_1461106840851005_793099058_n.mp4",
 *                     "text": "",
 *                     "user_has_liked": "",
 *                     "contact": {
 *                         "id": "55c778f417d75075277f3b48",
 *                         "name": "Leo Messi",
 *                         "picture": "https://graph.facebook.com/v2.3/176063032413299/picture?type=large"
 *                     }
 *                 },
 *                 {
 *                     "provider": "instagram",
 *                     "id": "1028328237861489912_427553890",
 *                     "type": "image",
 *                     "created_time": 1436806300,
 *                     "link": "https://instagram.com/p/5FWxWCPMz4/",
 *                     "likes": 1318361,
 *                     "media_url": "https://scontent.cdninstagram.com/hphotos-xpf1/t51.2885-15/s640x640/sh0.08/e35/10005235_1454738444829608_2103646408_n.jpg",
 *                     "text": "",
 *                     "user_has_liked": "",
 *                     "contact": {
 *                         "id": "55c778f417d75075277f3b48",
 *                         "name": "Leo Messi",
 *                         "picture": "https://graph.facebook.com/v2.3/176063032413299/picture?type=large"
 *                     }
 *                 }
 *             ]
 *         }
 *     }
 */
circleRoutes.get('/:circle_id/media', mediaController.getMedia);

module.exports = circleRoutes;