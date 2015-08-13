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
    return res.status(400).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }

  // Buscamos que el contacto pedido pertenezca al usuario loggeado
  Contact.findOne({ _id: contactId, user: req.user }, function(err, contact) {
    if (err || !contact) {
      logger.warn("You are trying to find a contact=" + contactId + " that doesn't belong to you");
      return res.status(400).send({ errors: [{ msg: "You are trying to find a contact that doesn't belong to you" }] });
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
 * @apiParam {String} [facebook_display_name] Nombre del perfil de facebook del contacto
 * @apiParam {String} [twitter_id] Id del perfil de twitter del contacto
 * @apiParam {String} [twitter_username] Username del perfil de twitter del contacto
 * @apiParam {String} [instagram_id] Id del perfil de instagram del contacto
 * @apiParam {String} [instagram_username] Username del perfil de instagram del contacto
 *
 * @apiDescription Aclaración: si bien los ids de las redes sociales son opcionales,
 * al menos uno es requerido para poder crear un contacto y obtener contenido de esa red
 * social asignada.
 *
 * @apiParamExample {json} Ejemplo de request
 *     {
 *       "name":"Alejo",
 *       "picture":"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10832234_314287438773030_212898401_a.jpg",
 *       "facebook_id": "10205153877979641",
 *       "facebook_display_name": "Alejo García",
 *       "instagram_id":"1574863419",
 *       "instagram_username": "aleagb23",
 *       "twitter_id": "261365528",
 *       "twitter_username": "aleagb23",
 *       "circle_id":"55c02cc80cce13ec28bd7ec2"
 *     }
 *
 * @apiSuccess {Object} contact Contacto creado
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "contact": {
 *             "__v": 0,
 *             "user": "55c02cc70cce13ec28bd7ec1",
 *             "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10832234_314287438773030_212898401_a.jpg",
 *             "name": "Alejo",
 *             "_id": "55c0316dccab88ba31786d73",
 *             "parents": [
 *                 {
 *                     "circle": "55c02cc80cce13ec28bd7ec2",
 *                     "_id": "55c0316dccab88ba31786d74",
 *                     "ancestors": [
 *                         "55c02cc80cce13ec28bd7ec2"
 *                     ]
 *                 }
 *             ],
 *             "instagram": {
 *                 "username": "aleagb23",
 *                 "id": "1574863419"
 *             },
 *             "twitter": {
 *                 "username": "aleagb23",
 *                 "id": "261365528"
 *             },
 *             "facebook": {
 *                 "display_name": "Alejo García",
 *                 "id": "10205153877979641"
 *             }
 *         }
 *     }
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
 *     {
 *         "contact": {
 *             "user": "55c421354037f03842898378",
 *             "picture": "https://graph.facebook.com/v2.3/10206413202905994/picture?type=large",
 *             "name": "Flore Joffré",
 *             "_id": "55cab7542337df552818e540",
 *             "__v": 0,
 *             "parents": [
 *                 {
 *                     "circle": "55c421364037f03842898379",
 *                     "_id": "55cab7542337df552818e541",
 *                     "ancestors": [
 *                         "55c421364037f03842898379"
 *                     ]
 *                 }
 *             ],
 *             "instagram": {
 *                 "username": "florejoffre",
 *                 "id": "1244524526"
 *             },
 *             "twitter": {
 *                 "username": "FloreJoffre",
 *                 "id": "197249917"
 *             },
 *             "facebook": {
 *                 "display_name": "Flore Joffré",
 *                 "id": "10206413202905994"
 *             }
 *         }
 *     }
 */
contactRoutes.get('/:contact_id', contactController.getById);

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
 *     {
 *       "contact":{
 *         "user":"55a1f39737bc05b2257c6ae0",
 *         "circle":"55a1f39937bc05b2257c6ae1",
 *         "twitter_id":"261365528",
 *         "facebook_id":"10205153877979641",
 *         "picture":"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large",
 *         "name":"Alejo",
 *         "_id":"55a1f47e71912f3c26602dbe",
 *         "__v":0
 *       }
 *     }
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
 *     {
 *       "contact":"55936a0460bb409c379800b7"
 *     }
 */
contactRoutes.delete('/:contact_id', contactController.delete);

/**
 * @api {get} /api/user/:user_id/contact/:contact_id/media Obtener contenido de un contacto
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
 *     {
 *         "media": {
 *             "count": 3,
 *             "list": [
 *                 {
 *                     "provider": "instagram",
 *                     "id": "1045056700312632485_1244524526",
 *                     "type": "image",
 *                     "created_time": 1438800488,
 *                     "link": "https://instagram.com/p/6AyYgwRryl/",
 *                     "likes": 21,
 *                     "media_url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/e15/11821140_1458199127814596_2044349920_n.jpg",
 *                     "text": "40 meses y más a tu lado. \nGracias por estar a mi lado y amarme como lo haces. \nNo existe nadie como vos! Te amo para siempre 💕\n\"Ahora cambiemos el mundo, amigo, que tu ya has cambiado el mio\"",
 *                     "user_has_liked": true
 *                 },
 *                 {
 *                     "provider": "twitter",
 *                     "id": "628942328963702784",
 *                     "type": "text",
 *                     "created_time": 1438786511,
 *                     "link": "https://twitter.com/statuses/628942328963702784",
 *                     "likes": 0,
 *                     "text": "@eugeniiazarco no te rias del niño acento que el viernes voy a pasar a ser yo ``````````",
 *                     "user_has_liked": false
 *                 },
 *                 {
 *                     "provider": "twitter",
 *                     "id": "628927833134530560",
 *                     "type": "video",
 *                     "created_time": 1438783054,
 *                     "link": "https://twitter.com/statuses/628927833134530560",
 *                     "likes": 0,
 *                     "text": "@eugeniiazarco euchi don't goooo http://t.co/vabQtQzV1Y",
 *                     "user_has_liked": false
 *                 }
 *             ]
 *         }
 *     }
 */
contactRoutes.get('/:contact_id/media', mediaController.getMedia);

module.exports = contactRoutes;
