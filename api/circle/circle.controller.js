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
          return res.status(400).send({ errors: [{ msg: "Paren't circle doesn't exists or doesn't belong to current user" }] });
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

    Contact.find({ 'parents.circle': req.circle._id, user: req.user }, function(err, contacts) {
      if (err || !contacts) {
        logger.warn('Could not find contacts for circle=' + req.circle._id);
        return res.status(400).send({ errors: [{ msg: 'Could not find contacts for specified circle' }] });
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
      return res.status(400).send({ errors: [{ msg: "Main circle can't be modified" }] });
    }
    // Sino, encontramos el circulo padre, verificamos que pertenezca al usuario y lo actualizamos
    else {
      Circle.findOne({ _id: req.body.parent_id, user: req.user })
        .populate('user')
        .exec(function(err, parentCircle) {
          if (err || !parentCircle) {
            logger.warn("Paren't circle=" + req.body.parent_id + " doesn't exists or doesn't belong to current user=" + req.user);
            return res.status(400).send({errors: [{msg: "Paren't circle doesn't exists or doesn't belong to current user"}]});
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
              return res.status(400).send({ errors: [{ msg: 'Error removing circle ' + err }] });
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
  req.assert('picture', 'It must be a valid URL').optional().isURL();
  req.assert('parent_id', 'Required').notEmpty();

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + req.validationErrors());
    return res.status(400).send({ errors: req.validationErrors()});
  }

  // Validamos nosql injection
  if (typeof req.body.name !== 'string' || typeof req.body.parent_id !== 'string') {
    logger.warn('No SQL injection - name: ' + req.body.name + ' parentId: ' + req.body.parent_id);
    return res.status(400).send({ errors: [{ msg: "You're trying to send invalid data types" }] });
  }
};

// Salva el círculo pasado por parámetro y lo envía al cliente
var saveCircleData = function(req, res, circle, foundCircle) {
  circle.name = req.body.name;
  circle.parent = req.body.parent_id;
  circle.picture = req.body.picture;
  var ancestors = [req.body.parent_id];
  ancestors.push.apply(ancestors, foundCircle.ancestors);
  circle.ancestors = ancestors;
  circle.save(function(err) {
    if (err) {
      logger.err(err);
      return res.status(400).send({ errors: [{ msg: 'Error saving data ' + err }] });
    }
    else {
      logger.debug('Circle for user: ' + req.user + ' created successfully: ' + circle.toString());
      circle.created_at = undefined;
      circle.updated_at = undefined;
      return res.send({ circle: circle });
    }
  });
};

// Este metodo devuelve los subcirculos en una estructura de arbol del circulo pedido
module.exports.getTree = function (req, res) {

  process.nextTick(function () {
    Circle.find({ ancestors: req.circle._id }, 'picture parent name _id')
      .lean()
      .exec(function(err, circles) {
      if (err || !circles) {
        logger.warn('Could not find subcircles for circle=' + req.circle._id);
        return res.status(400).send({ errors: [{ msg: 'Could not find subcircles for specified circle' }] });
      }
      else {
        logger.debug('Subcircles for circle=' + req.circle._id + ' for user=' + req.user);
        circles.push(req.circle);
        var mappedIdCircles = circles.map(function(circle) {
          return {
            _id: circle._id.toString(),
            name: circle.name,
            picture: circle.picture,
            parent: circle.parent ? circle.parent.toString() : undefined
          };
        });

        var tree = makeTree({ q: mappedIdCircles });
        res.send({ tree: tree });
      }
    });
  });
};

// Que noche mágica Ciudad de Buenos ires
var makeTree = function(options) {
  var children, e, i, id, j, len, len1, o, pid, ref, ref1, temp;
  id = options.id || "_id";
  pid = options.parentid || "parent";
  children = options.children || "subcircles";
  temp = {};
  ref = options.q;
  for (i = 0, len = ref.length; i < len; i++) {
    e = ref[i];
    e[children] = [];
    temp[e[id]] = e;
  }
  o = [];
  ref1 = options.q;
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    e = ref1[j];
    if (temp[e[pid]] !== undefined) {
      temp[e[pid]][children].push(e);
    }
    else {
      o.push(e);
    }
  }
  return o;
};