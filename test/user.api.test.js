/*
 * Tests de la API de usuarios
 * @author Joel Márquez
 * */
'use strict';

// requires
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config');

// models
var User = require('../api/user/user.model');
var Circle = require('../api/circle/circle.model');

// constants
var API_URL = 'http://localhost:8000';
var USERS_PATH = '/api/user/';
var LOGIN_PATH = '/auth/login';

describe('Users API', function() {

  before(function(done) {
    mongoose.connect(config.MONGODB_TEST);
    User.create({ name: 'Juan Losa', email: 'unify.argentina@gmail.com', password: 'This is not my real password' }, done);
  });

  after(function(done) {
    User.findOne({ email: 'unify.argentina@gmail.com' }, function(err, user) {
      user.remove(function(err) {
        User.findOne({ email: 'unify.argentina2@gmail.com' }, function(err, user) {
          user.remove(function(err) {
            mongoose.connection.close(done);
          });
        });
      });
    });
  });

  it('should not allow to get user information without token', function(done) {
    User.findOne({ email: 'unify.argentina@gmail.com' }, function(err, user) {
      request(API_URL)
        .get(USERS_PATH + user._id)
        .end(function(err, data) {
          data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
          done();
        });
    });
  });

  it('should not allow to get user information with an invalid token', function(done) {
    User.findOne({ email: 'unify.argentina@gmail.com' }, function(err, user) {
      request(API_URL)
        .get(USERS_PATH + user._id)
        .set('Authorization', 'Bearer 1234567890')
        .end(function (err, data) {
          data.res.body.errors[0].msg.should.equal('jwt malformed');
          done();
        });
    });
  });

  it('should not allow to get user information with other user id', function(done) {
    // Primero creamos un nuevo usuario
    User.create({
      name: 'Juan Losa',
      email: 'unify.argentina2@gmail.com',
      password: 'This is not my real password'
    }, function(err, user) {
      // Luego nos logueamos con el primer usuario, obteniendo el token de unify
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          email: 'unify.argentina@gmail.com',
          password: 'This is not my real password'
        })
        // Por último, intentamos obtener la info del nuevo usuario con el token del primer usuario
        .end(function(err, data) {
          User.findOne({ email: 'unify.argentina@gmail.com' }, function(err, user2) {
            request(API_URL)
              .get(USERS_PATH + user._id)
              .set('Authorization', 'Bearer ' + data.res.body.token)
              .end(function (err, data) {
                data.res.body.errors[0].msg.should.equal('You are trying to find a different user');
                done();
              });
          });
        });
    });
  });

  it('should allow to get user information with valid access token', function(done) {
    User.findOne({ email: 'unify.argentina@gmail.com' }, function(err, user) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          email: 'unify.argentina@gmail.com',
          password: 'This is not my real password'
        })
        .end(function(err, data) {
          request(API_URL)
            .get(USERS_PATH + user._id)
            .set('Authorization', 'Bearer ' + data.res.body.token)
            .end(function(err, data) {
              data.res.statusCode.should.equal(200);
              var jsonUser = data.res.body.user;
              jsonUser._id.should.equal(user._id.toString());
              jsonUser.email.should.equal(user.email);
              jsonUser.name.should.equal(user.name);
              jsonUser.mainCircle.name.should.equal(jsonUser.mainCircle.name);
              done();
            });
        });
      });
  });
});