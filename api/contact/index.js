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

contactRoutes.get('/:contact_id/media', mediaController.getMedia);

module.exports = contactRoutes;
