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
    Circle.findOne({ _id: req.body.parent_id, user: req.user_id })
      .populate('user')
      .exec(function(err, parentCircle) {
        if (err || !parentCircle) {
          logger.warn("Paren't circle=" + req.body.parent_id + " doesn't exists or doesn't belong to current user=" + req.user_id);
          return res.status(400).send({ errors: [{ msg: 'El círculo padre no existe o no le pertenece al usuario actual' }] });
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

    Contact.find({ 'parents.circle': req.circle._id, user: req.user_id })
      .populate('parents.circle')
      .populate('parents.ancestors')
      .exec(function(err, contacts) {
      if (err || !contacts) {
        logger.warn('Could not find contacts for circle=' + req.circle._id);
        return res.status(400).send({ errors: [{ msg: 'Hubo un error al encontrar contactos para el círculo especificado' }] });
      }
      else {
        // Luego buscamos la cantidad de contactos que lo tengan como ancestro para enviar el empty_circle
        Contact.count({ 'parents.ancestors' : req.circle._id, user: req.user_id }, function(err, count) {
          if (err) {
            logger.warn('Could not count subcontacts for circle=' + req.circle._id);
            return res.status(400).send({ errors: [{ msg: 'Hubo un error al encontrar contactos para el círculo especificado' }] });
          }
          else {
            var contactsObject = {
              contacts: contacts,
              empty_circle: count === 0
            };
            var result = _.merge(contactsObject, req.circle.toJSON());
            result.user = undefined;
            return res.send({ circle: result });
          }
        });
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
      var circle = req.circle;
      circle.name = req.body.name;
      circle.picture = req.body.picture;
      circle.save(function(err) {
        if (err) {
          logger.err(err);
          return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
        }
        else {
          logger.debug('Circle for user: ' + req.user_id + ' updated successfully: ' + circle.toString());
          circle.created_at = undefined;
          circle.updated_at = undefined;
          return res.send({ circle: circle });
        }
      });
    }
    // Sino, encontramos el circulo padre, verificamos que pertenezca al usuario y lo actualizamos
    else {
      // TODO validar que haya venido el parent_id y q no sea hijo del círculo a modificar
      Circle.findOne({ _id: req.body.parent_id, user: req.user_id })
        .populate('user')
        .exec(function(err, parentCircle) {
        if (err || !parentCircle) {
          logger.warn("Paren't circle=" + req.body.parent_id + " doesn't exists or doesn't belong to current user=" + req.user_id);
          return res.status(400).send({ errors: [{ msg: 'El círculo padre no existe o no le pertenece al usuario actual' }] });
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
    User.findOne({ _id: req.user_id })
      .populate('main_circle')
      .exec(function (err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
      }
      else {
        var circle = req.circle;
        if (user.main_circle._id.equals(circle._id)) {
          logger.warn('Cannot delete users main circle: ' + circle._id);
          return res.status(400).send({ errors: [{ msg: 'El círculo principal no puede ser eliminado' }] });
        }
        // Si no es el círculo principal, lo borramos y devolvemos el id del círculo recientemente borrado
        else {
          circle.remove(function(err) {
            if (err) {
              logger.err(err);
              return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar eliminar el círculo especificado' }] });
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
  req.assert('name', 'Nombre válido requerido').isString();
  req.assert('picture', 'URL de foto válida').optional().isURL();
  req.assert('parent_id', 'Id del padre válido requerido').optional().isString();

  // Validamos errores
  if (req.validationErrors()) {
    logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
    return res.status(400).send({ errors: req.validationErrors()});
  }
};

// Salva el círculo pasado por parámetro y lo envía al cliente
var saveCircleData = function(req, res, circle, foundCircle) {
  circle.name = req.body.name;
  circle.parent = req.body.parent_id;
  circle.picture = req.body.picture;
  var ancestors = [foundCircle._id];
  ancestors.push.apply(ancestors, foundCircle.ancestors);
  circle.ancestors = ancestors;
  circle.hook_enabled = true;
  circle.save(function(err) {
    if (err) {
      logger.err(err);
      return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
    }
    else {
      logger.debug('Circle for user: ' + req.user_id + ' created successfully: ' + circle.toString());
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
        return res.status(400).send({ errors: [{ msg: 'No se pudieron encontrar subcírculos para el círculo especificado' }] });
      }
      else {
        logger.debug('Subcircles for circle=' + req.circle._id + ' for user=' + req.user_id);
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

// Construye el árbol de círculos y subcírculos
var makeTree = function(options) {
  var tempCircle, firstIndex, secondIndex;
  var id = options.id || "_id";
  var pid = options.parentid || "parent";
  var children = options.children || "subcircles";
  var circlesIds = {};
  var firstArray = options.q;
  for (firstIndex = 0; firstIndex < firstArray.length; firstIndex++) {
    /* En tempCircle se guarda cada círculo
    * _id = 43532532532425
    * name = "Principal"
    * picture = "http://www.google.com/"
    * parent = 3245324234234
    * */
    tempCircle = firstArray[firstIndex];

    /*
    * Luego creamos un array vacío llamado subcircles dentro del circulo
    * _id = 43532532532425
    * name = "Principal"
    * picture = "http://www.google.com/"
    * parent = 3245324234234
    * subcircles = []
    * */
    tempCircle[children] = [];

    /*
    * Por último, en circlesIds vamos a almacenar un objeto que va a tener como claves los ids
    * de cada circulo y como valores el circulo propiamente dicho
    * circlesIds[43532532532425] = {
    *   _id = 43532532532425
    *   name = "Principal"
    *   picture = "http://www.google.com/"
    *   parent = 3245324234234
    *   subcircles = []
    * }
    * */
    circlesIds[tempCircle[id]] = tempCircle;
  }
  /*
  * result va a ser el array de círculos que va a tener un sólo elemento, el círculo raíz
  * */
  var result = [];
  var secondArray = options.q;
  for (secondIndex = 0; secondIndex < secondArray.length; secondIndex++) {
    /* En tempCircle se guarda cada círculo nuevamente
     * _id = 43532532532425
     * name = "Principal"
     * picture = "http://www.google.com/"
     * parent = 3245324234234
     * */
    tempCircle = secondArray[secondIndex];

    /*
    * Luego nos fijamos si en el objeto de ids, se encuentra el círculo padre del círculo en tempCircle
    * */
    if (circlesIds[tempCircle[pid]] !== undefined) {
      /*
      * Si se encuentra, entonces a ese círculo padre le pusheamos en el array de childrens, tempCircle
      * */
      circlesIds[tempCircle[pid]][children].push(tempCircle);
    }
    else {
      /*
      * Si no se encuentra, quiere decir que es el círculo padre, por lo que lo agregamos y será
      * el círculo principal que va a tener a todos los subcirculos
      * */
      result.push(tempCircle);
    }
  }
  return result;
};