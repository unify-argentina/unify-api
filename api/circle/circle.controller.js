/*
 * Este es el módulo que se encarga de controlar las acciones sobre un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var logger = require('../../config/logger');

// modelos
var User = require('../user/user.model');
var Circle = require('./circle.model');
var Contact = require('../contact/contact.model');

// Crea un círculo
module.exports.createCircle = function(req, res) {

  process.nextTick(function() {
    req.assert('name', 'Required').notEmpty();
    req.assert('name', 'Only alphanumeric characters are allowed').isAscii();
    req.assert('parent_id', 'Required').notEmpty();
    req.assert('parent_id', 'Only alphanumeric characters are allowed').isAscii();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + req.validationErrors());
      return res.status(401).send({ errors: req.validationErrors()});
    }

    // Validamos nosql injection
    if (typeof req.body.name === 'object' || typeof req.body.parent_id === 'object') {
      logger.warn('No SQL injection - name: ' + req.body.name+ ' parentId: ' + req.body.parent_id);
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    // Primero encontramos al usuario loggeado
    User.findOne({ _id: req.user }, function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        // Luego, si el parent_id existe y pertenece al usuario loggeado, creamos un subcírculo
        user.hasCircleWithId(req.body.parent_id, function(success, foundCircle) {
          if (success) {
            var circle = new Circle();
            circle.name = req.body.name;
            circle.parent = req.body.parent_id;
            var ancestors = foundCircle.ancestors;
            ancestors.push(req.body.parent_id);
            circle.ancestors = ancestors;
            circle.save(function(err) {
              if (err) {
                logger.err(err);
                return res.status(401).send({ errors: [{ msg: 'Error saving data ' + err }] });
              }
              else {
                logger.debug('Circle for user: ' + req.user + ' created successfully: ' + circle.toString());
                return res.status(200).send({ circle: circle });
              }
            });
          }
          else {
            return res.status(401).send({ errors: [{ msg: "Paren't circle doesn't exists or doesn't belong to current user" }] });
          }
        });
      }
    });
  });
};

// Devuelve el círculo pedido
module.exports.getCircleById = function(req, res) {

  process.nextTick(function() {
    Circle.findOne({ _id: req.circle }, function(err, circle) {
      if (err || !circle) {
        logger.warn('Circle not found: ' + req.circle);
        return res.status(400).send({ errors: [{ msg: 'Circle not found' }] });
      }
      else {
        return res.status(200).send({ circle: circle });
      }
    });
  });
};