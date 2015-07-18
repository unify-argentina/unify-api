/*
 * Tests de ABM de un circulo
 * @author Joel Márquez
 * */
'use strict';

// requires
var assert = require('assert');
var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../config/logger');

var Circle = require('../api/circle/circle.model');

describe('Circle', function() {

  // Antes de comenzar los tests, nos conectamos a la base
  before(function(done) {
    mongoose.connect(config.MONGODB_TEST);
    Circle.remove().exec(done);
  });

  // Al finalizar todos los tests, nos desconectamos de la base
  after(function(done) {
    mongoose.connection.close(done);
  });

  it('should create ok', function(done) {
    Circle.create({ name: 'Friends' }, function(err, circle) {
      Circle.find({}, function(err, circles) {
        circles.length.should.equal(1);
        circles[0].name.should.equal('Friends');
        done();
      });
    });
  });

  it('should check for an ancestor ok', function(done) {
    Circle.create({ name: 'Family' }, function(err, familyCircle) {
      Circle.create({ name: 'Grands', parent: familyCircle._id, ancestors: [familyCircle._id] }, function(err, grandsCircle) {
        Circle.create({ name: 'Main Circle' }, function(err, mainCircle) {
          grandsCircle.hasAncestor(familyCircle).should.equal(true);
          grandsCircle.hasAncestor(mainCircle).should.equal(false);
          done();
        });
      });
      });
  });
});