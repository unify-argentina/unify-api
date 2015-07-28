/*
 * Este es el módulo que se encarga de manejar las rutas de un contacto
 * @author Joel Márquez
 * */
'use strict';

// requires
var contactRoutes = require('express').Router();
var contactController = require('./contact.controller');
var mediaController = require('./contact.media.controller');
var logger = require('../../config/logger');

// modelos
var User = require('../user/user.model');
var Contact = require('./contact.model');

// Este método chequea que el contact_id pasado por parámetro pertenezca al usuario loggeado
contactRoutes.param('contact_id', function(req, res, next, contactId) {
  // Validamos nosql injection
  if (typeof contactId !== 'string') {
    return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }

  // Buscamos que el contacto pedido pertenezca al usuario loggeado
  Contact.findOne({ _id: contactId, user: req.user }, function(err, contact) {
    if (err || !contact) {
      logger.warn("You are trying to find a contact=" + contactId + " that doesn't belong to you");
      return res.status(401).send({ errors: [{ msg: "You are trying to find a contact that doesn't belong to you" }] });
    }
    // Si pertenece, incorporamos el id al request y continuamos
    else {
      req.contact = contact;
      next();
    }
  });
});

/**
 * @api {post} /api/user/:user_id/contact Crear un contacto
 * @apiGroup Contactos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} name Nombre del contacto a crear
 * @apiParam {String} picture URL de la imagen del contacto
 * @apiParam {String} circle_id Id del círculo en el cual el contacto va a ser creado
 * @apiParam {String} [facebook_id] Id del perfil de facebook del contacto
 * @apiParam {String} [twitter_id] Id del perfil de twitter del contacto
 * @apiParam {String} [instagram_id] Id del perfil de instagram del contacto
 *
 * @apiDescription Aclaración: si bien los ids de las redes sociales son opcionales,
 * al menos uno es requerido para poder crear un contacto y obtener contenido de esa red
 * social asignada.
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "name":"Alejo",
 *      "picture":"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large",
 *      "facebook_id":"10205153877979641",
 *      "twitter_id":"261365528",
 *      "instagram_id":"1574863419",
 *      "circle_id":"55a1f0d9d3dc50a522cd0aff"
 *    }
 *
 * @apiSuccess {Object} contact Contacto creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "contact":{
 *        "user":"55a1f39737bc05b2257c6ae0",
 *        "circle":"55a1f39937bc05b2257c6ae1",
 *        "twitter_id":"261365528",
 *        "facebook_id":"10205153877979641",
 *        "picture":"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large",
 *        "name":"Alejo",
 *        "_id":"55a1f47e71912f3c26602dbe",
 *        "__v":0
 *      }
 *    }
 */
contactRoutes.post('/', contactController.create);

/**
 * @api {get} /api/user/:user_id/contact/:contact_id Obtener contacto
 * @apiGroup Contactos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} contact_id Id del contacto
 *
 * @apiSuccess {Object} contact Contacto
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *     {
 *         "contact": {
 *             "user": "55b3a9f7a748942e223f7399",
 *             "circle": "55b3a9f8a748942e223f739a",
 *             "picture": "graph.facebook.com/v2.3/10153267328674738/picture?type=large",
 *             "name": "Joel",
 *             "instagram_id": "993803680",
 *             "twitter_id": "42704750",
 *             "facebook_id": "10153267328674738",
 *             "_id": "55b3ac25a748942e223f739b",
 *             "__v": 0,
 *             "media": {
 *                 "count": 139,
 *                 "list": [
 *                     {
 *                         "provider": "facebook",
 *                         "id": "104231789737",
 *                         "type": "video",
 *                         "created_time": 1248316817,
 *                         "link": "",
 *                         "media_url": "https://video.xx.fbcdn.net/hvideo-xpa1/v/t42.1790-2/1128968_10151770969524738_48281_n.mp4?oh=7bac0be2bc4d52e84f95708b606b78a8&oe=55B92464",
 *                         "text": ""
 *                     },
 *                     {
 *                         "provider": "facebook",
 *                         "id": "10152546867159738",
 *                         "type": "image",
 *                         "created_time": 1405276732,
 *                         "text": "Lio hace lio en Rio te lo pido!!! VAMOS ARGENTINA CARAJO!!!"
 *                     },
 *                     {
 *                         "provider": "instagram",
 *                         "id": "942358663471400364_993803680",
 *                         "type": "image",
 *                         "created_time": 1426557928,
 *                         "link": "https://instagram.com/p/0T7jYrOYWs/",
 *                         "likes": 9,
 *                         "media_url": "https://scontent.cdninstagram.com/hphotos-xfp1/t51.2885-15/e15/10894975_1551551221769247_142889237_n.jpg",
 *                         "text": "A brindar se ha dicho! @florejoffre",
 *                         "user_has_liked": ""
 *                     },
 *                     {
 *                         "provider": "twitter",
 *                         "id": "584556327738847233",
 *                         "type": "text",
 *                         "created_time": 1428204063,
 *                         "link": "https://twitter.com/statuses/584556327738847233",
 *                         "likes": 0,
 *                         "text": "Brindo porque recién vamos 3 años y nos queda toda una vida por delante juntos. Te amo con todo mi… https://t.co/LBC7sRYkhD",
 *                         "user_has_liked": false
 *                     },
 *                     {
 *                         "provider": "twitter",
 *                         "id": "591574551441571840",
 *                         "type": "video",
 *                         "created_time": 1429877338,
 *                         "link": "https://twitter.com/statuses/591574551441571840",
 *                         "likes": 0,
 *                         "text": "@jotaleonetti puente de victor hugo para cruzar la gral paz cerrado todo un quilombo evitar esa zona http://t.co/lM23tKSMeP",
 *                         "user_has_liked": false
 *                     },
 *                     {
 *                         "provider": "instagram",
 *                         "id": "1004621806268155504_993803680",
 *                         "type": "video",
 *                         "created_time": 1433980273,
 *                         "link": "https://instagram.com/p/3xIjXIOYZw/",
 *                         "likes": 8,
 *                         "media_url": "https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11424155_495429683938569_221343300_n.mp4",
 *                         "text": "Franchu rockstar dedicando canciones",
 *                         "user_has_liked": ""
 *                     }
 *                 ]
 *             }
 *         }
 *     }
 */
contactRoutes.get('/:contact_id', mediaController.getMedia);//contactController.getById);

/**
 * @api {put} /api/user/:user_id/contact/:contact_id Actualizar un contacto
 * @apiGroup Contactos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} contact_id Id del contacto a actualizar
 * @apiParam {String} name Nuevo nombre del contacto a actualizar
 * @apiParam {String} picture URL de la imagen del contacto
 * @apiParam {String} circle_id Id del círculo en el cual el contacto va a ser actualizado
 * @apiParam {String} [facebook_id] Id del perfil de facebook del contacto
 * @apiParam {String} [twitter_id] Id del perfil de twitter del contacto
 * @apiParam {String} [instagram_id] Id del perfil de instagram del contacto
 *
 * @apiDescription Aclaración: si bien los ids de las redes sociales son opcionales,
 * al menos uno es requerido para poder actualizar un contacto y obtener contenido de esa red
 * social asignada.
 *
 * @apiParamExample {json} Ejemplo de request
 *    {
 *      "name":"Alejo",
 *      "picture":"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large",
 *      "facebook_id":"10205153877979641",
 *      "twitter_id":"261365528",
 *      "instagram_id":"1574863419",
 *      "circle_id":"55a1f0d9d3dc50a522cd0aff"
 *    }
 *
 * @apiSuccess {Object} contact Contacto actualizado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "contact":{
 *        "user":"55a1f39737bc05b2257c6ae0",
 *        "circle":"55a1f39937bc05b2257c6ae1",
 *        "twitter_id":"261365528",
 *        "facebook_id":"10205153877979641",
 *        "picture":"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large",
 *        "name":"Alejo",
 *        "_id":"55a1f47e71912f3c26602dbe",
 *        "__v":0
 *      }
 *    }
 */
contactRoutes.put('/:contact_id', contactController.update);

/**
 * @api {delete} /api/user/:user_id/contact/:contact_id Eliminar un contacto
 * @apiGroup Contactos
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {String} contact_id Id del contacto a borrar
 *
 * @apiSuccess {String} circle Id del contacto eliminado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *
 *    {
 *      "contact":"55936a0460bb409c379800b7"
 *    }
 */
contactRoutes.delete('/:contact_id', contactController.delete);

module.exports = contactRoutes;
