/*
 * Tests de creación de un usuario
 * @author Joel Márquez
 * */
'use strict';

var assert = require('assert');
var mongoose = require('mongoose');
var config = require('../config/config');
var User = require('../api/user/user.js');
var Circle = require('../api/circle/circle.js');

describe('User', function() {

  // Antes de comenzar los tests, nos conectamos a la base
  before(function(done) {
    mongoose.connect(config.MONGODB_TEST);
    done();
  });

  // Al finalizar cada test, borramos todas las cuentas de la base
  afterEach(function(done) {
    User.remove({}, function(err) {
      Circle.remove({}, done);
    });
  });

  // Al finalizar todos los tests, nos desconectamos de la base
  after(function(done) {
    mongoose.connection.close(done);
  });

  it('should create ok', function(done) {
    User.find({}, function(err, users0) {
      users0.length.should.equal(0);
      User.create({ name: 'Juan Losa', email: 'unify.argentina@gmail.com', password: 'Holaja' }, function (err, user) {
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
  });

  it('should hash password before saving to database', function(done) {
    var PASSWORD = 'HOLAMIVIDACOMOTEVA';
    User.find({}, function(err, users0) {
      users0.length.should.equal(0);
      User.create({ name: 'Juan Losa', email: 'unify.argentina@gmail.com', password: PASSWORD }, function (err, user) {
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
  });

  it('should not allow to create two accounts with the same email', function(done) {
    User.find({}, function(err, users0) {
      users0.length.should.equal(0);
      User.create({ name: 'Juan Losa', email: 'unify.argentina@gmail.com', password: 'Holaja' }, function (err, user) {
        if (err) {
          done();
        }
        else {
          User.create({ name: 'Juan Losa', email: 'unify.argentina@gmail.com', password: 'Holaja' }, function (err, user2) {
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
        }
      });
    });
  });
});