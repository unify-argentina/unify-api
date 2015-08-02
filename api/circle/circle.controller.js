/*
 * Este es el módulo que se encarga de controlar las acciones sobre un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var logger = require('../../config/logger');
var _ = require('lodash');

// modelos
var User = require('../user/user.model');
var Circle = require('./circle.model');
var Contact = require('../contact/contact.model');

// Crea un círculo
module.exports.create = function(req, res) {

  process.nextTick(function() {
    validateParams(req, res);

    // Encontramos al parent circle y verificamos que pertenezca al usuario loggeado
    Circle.findOne({ _id: req.body.parent_id, user: req.user })
      .populate('user')
      .exec(function(err, parentCircle) {
        if (err || !parentCircle) {
          logger.warn("Paren't circle=" + req.body.parent_id + " doesn't exists or doesn't belong to current user=" + req.user);
          return res.status(401).send({ errors: [{ msg: "Paren't circle doesn't exists or doesn't belong to current user" }] });
        }
        else {
          var circle = new Circle();
          circle.user = parentCircle.user._id;
          saveCircleData(req, res, circle, parentCircle);
        }
      });
  });
};

// Devuelve el círculo pedido por Id
module.exports.getById = function(req, res) {

  process.nextTick(function() {

    Contact.find({ circle: req.circle._id }, function(err, contacts) {
      if (err || !contacts) {
        logger.warn('Could not find contacts for circle=' + req.circle._id);
        return res.status(401).send({ errors: [{ msg: 'Could not find contacts for specified circle' }] });
      }
      else {
        var contactsObject = {
          contacts: contacts
        };
        var result = _.merge(contactsObject, req.circle.toJSON());
        result.user = undefined;
        return res.send({ circle: result });
      }
    });
  });
};

// Se encarga de actualizar el circulo en base al id que se le pase por parámetro
module.exports.update = function (req, res) {

  process.nextTick(function () {
    validateParams(req, res);

    // Si el círculo a modificar es el principal, devolvemos error
    if (req.circle._id.equals(req.circle.user.main_circle)) {
      logger.warn("Main circle can't be modified for user=" + req.circle.user._id);
      return res.status(401).send({ errors: [{ msg: "Main circle can't be modified" }] });
    }
    // Sino, encontramos el circulo padre, verificamos que pertenezca al usuario y lo actualizamos
    else {
      Circle.findOne({ _id: req.body.parent_id, user: req.user })
        .populate('user')
        .exec(function(err, parentCircle) {
          if (err || !parentCircle) {
            logger
              .warn("Paren't circle=" + req.body.parent_id + " doesn't exists or doesn't belong to current user=" + req.user);
            return res.status(401)
              .send({errors: [{msg: "Paren't circle doesn't exists or doesn't belong to current user"}]});
          }
          else {
            saveCircleData(req, res, req.circle, parentCircle);
          }
        });
    }
  });
};

// Borra el círculo pasado por parámetro
module.exports.delete = function(req, res) {

  process.nextTick(function() {
    // Primero buscamos el usuario loggeado, para luego ver si el círculo pasado por parámetro
    // no es el círculo principal del usuario
    User.findOne({ _id: req.user })
      .populate('main_circle')
      .exec(function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        var circle = req.circle;
        if (user.main_circle._id.equals(circle._id)) {
          logger.warn('Cannot delete users main circle: ' + circle._id);
          return res.status(400).send({ errors: [{ msg: 'Cannot delete users main circle' }] });
        }
        // Si no es el círculo principal, lo borramos y devolvemos el id del círculo recientemente borrado
        else {
          circle.remove(function(err) {
            if (err) {
              logger.err(err);
              return res.status(401).send({ errors: [{ msg: 'Error removing circle ' + err }] });
            }
            else {
              return res.send({ circle: circle._id });
            }
          });
        }
      }
    });
  });
};

// Valida que los parámetros sean correctos
var validateParams = function(req, res) {
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
  if (typeof req.body.name !== 'string' || typeof req.body.parent_id !== 'string') {
    logger.warn('No SQL injection - name: ' + req.body.name + ' parentId: ' + req.body.parent_id);
    return res.status(401).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }
};

// Salva el círculo pasado por parámetro y lo envía al cliente
var saveCircleData = function(req, res, circle, foundCircle) {
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
      return res.send({ circle: circle });
    }
  });
};