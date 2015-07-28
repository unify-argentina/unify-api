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
var User = require('../api/user/user.model');

describe('Circle', function() {

  // Antes de comenzar los tests, nos conectamos a la base
  before(function(done) {
    mongoose.connect(config.MONGODB_TEST);
    User.remove().exec(function(err) {
      Circle.remove().exec(done);
    });
  });

  // Al finalizar todos los tests, nos desconectamos de la base
  after(function(done) {
    mongoose.connection.close(done);
  });

  it('should create ok', function(done) {
    User.create({ name: 'Juan Losa', email: 'unify.argentina@gmail.com', password: 'password' }, function(err, user) {
      Circle.count({}, function(err, originalCount) {
        Circle.create({ name: 'Friends', user: user._id }, function(err, circle) {
          Circle.find({}, function(err, circles) {
            circles.length.should.equal(originalCount + 1);
            circles[1].name.should.equal('Friends');
            done();
          });
        });
      });
    });
  });
});