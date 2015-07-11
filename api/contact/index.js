/*
 * Este es el módulo que se encarga de manejar las rutas de un contacto
 * @author Joel Márquez
 * */
'use strict';

// requires
var contactRoutes = require('express').Router();
var contactController = require('./contact.controller');
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

contactRoutes.post('/', contactController.create);

contactRoutes.get('/:contact_id', contactController.getById);

contactRoutes.put('/:contact_id', contactController.update);

contactRoutes.delete('/:contact_id', contactController.delete);

module.exports = contactRoutes;
