/*
 * Este es el módulo que se encarga de controlar las acciones sobre un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var Circle = require('./circle.model');

module.exports.createCircle = function(req, res) {

  process.nextTick(function() {
    req.assert('name', 'Required').notEmpty();
    req.assert('name', 'Only alphanumeric characters are allowed').isAscii();
    req.assert('parent_id', 'Required').notEmpty();
    req.assert('parent_id', 'Only alphanumeric characters are allowed').isAscii();

    if (req.validationErrors()) {
      return res.status(401).send({ errors: req.validationErrors()});
    }

    if (typeof req.body.name === 'object' || typeof req.body.parent_id === 'object') {
      return res.status(401).send({ errors: [{ msg: "You're trying to send object data types" }] });
    }

    var circle = new Circle();
    circle.name = req.body.name;
    circle.parent = req.body.parent_id;
    circle.save(function(err) {
      if (err) {
        return res.status(401).send({ errors: [{ msg: 'Error saving data' + err }] });
      }
      res.status(200).send({ circle: circle });
    });
  });
};