/*
 * Tests de creación de un usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var assert = require('assert');
var mongoose = require('mongoose');
var config = require('../config');

// models
var User = require('../api/user/user.model');
var Circle = require('../api/circle/circle.model');

// constants
var PASSWORD = 'This is not my real password';

var defaultUser = function() {
  return {
    name: 'Juan Losa',
    email: 'unify.argentina@gmail.com',
    password: PASSWORD
  };
};

describe('User', function() {

  // Antes de comenzar los tests, nos conectamos a la base
  before(function(done) {
    mongoose.connect(config.MONGODB_TEST);
    done();
  });

  // Al finalizar cada test, borramos todas las cuentas de la base
  afterEach(function(done) {
    User.find({}, function(err, users) {
      users.forEach(function(user) {
        user.remove();
      });
      done();
    });
  });

  // Al finalizar todos los tests, nos desconectamos de la base
  after(function(done) {
    mongoose.connection.close(done);
  });

  it('should create ok', function(done) {
    User.create(defaultUser(), function (err, user) {
      if (err) {
        done();
      }
      else {
        User.find({}, function(err, users1) {
          users1.length.should.equal(1);
          done();
        });
      }
    });
  });

  it('should hash password before saving to database', function(done) {
    User.create(defaultUser(), function (err, user) {
      if (err) {
        done();
      }
      else {
        assert.notEqual(user.password, PASSWORD);
        user.comparePassword(PASSWORD, function(err, isMatch) {
          assert.equal(isMatch, true);
          done();
        });
      }
    });
  });

  it('should remove asociated main user circle when removing a user instance', function(done) {
    User.create({ name: 'Juan Losa', email: 'unify.argentina@gmail.com', password: 'Holaja' }, function (err, user) {
      Circle.count({}, function(err, count) {
        count.should.equal(1);
        user.remove(function(err) {
          Circle.count({}, function(err, count) {
            count.should.equal(0);
            done();
          });
        });
      });
    });
  });

  it('should not allow to create two accounts with the same email', function(done) {
    User.create(defaultUser(), function (err, user) {
      User.create(defaultUser(), function (err, user2) {
        User.count({}, function(err, count) {
          count.should.equal(1);
          done();
        });
      });
    });
  });
});