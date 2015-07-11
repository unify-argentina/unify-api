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
    validateParams(req, res);

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
            saveCircleData(req, res, circle, foundCircle);
          }
          else {
            logger.warn("Paren't circle=" + req.body.parent_id + " doesn't exists or doesn't belong to current user=" + req.user);
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
    return res.status(200).send({ circle: req.circle });
  });
};

// Se encarga de actualizar el circulo en base al id que se le pase por parámetro
module.exports.updateCircle = function (req, res) {

  process.nextTick(function () {
    validateParams(req, res);

    // Encontramos al usuario y chequeamos que el parent_id pertenezca a un círculo del usuario
    User.findOne({ _id: req.user }, function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        // Luego, si el parent_id existe y pertenece al usuario loggeado, actualizamos el subcírculo
        user.hasCircleWithId(req.body.parent_id, function(success, foundCircle) {
          if (success) {
            saveCircleData(req, res, req.circle, foundCircle);
          }
          else {
            logger
              .warn("Paren't circle=" + req.body.parent_id + " doesn't exists or doesn't belong to current user=" + req.user);
            return res.status(401)
              .send({ errors: [{ msg: "Paren't circle doesn't exists or doesn't belong to current user" }] });
          }
        });
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
      return res.status(200).send({ circle: circle });
    }
  });
};

// Borra el círculo pasado por parámetro
module.exports.deleteCircle = function(req, res) {

  process.nextTick(function() {
    // Primero buscamos el usuario loggeado, para luego ver si el círculo pasado por parámetro
    // no es el círculo principal del usuario
    User.findOne({ _id: req.user })
      .populate('mainCircle')
      .exec(function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        var circle = req.circle;
        if (user.mainCircle._id.equals(circle._id)) {
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
              res.status(200).send({ circle: circle._id });
            }
          });
        }
      }
    });
  });
};