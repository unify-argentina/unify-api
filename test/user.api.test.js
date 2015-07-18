/*
 * Tests de la API de usuarios
 * @author Joel Márquez
 * */
'use strict';

// requires
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config');

// modelos
var User = require('../api/user/user.model');
var Circle = require('../api/circle/circle.model');

// constantes
var API_URL = 'http://localhost:8000';
var USERS_PATH = '/api/user/';
var LOGIN_PATH = '/auth/login';

// Esta función sirve para hacer un login y devolverle al callback el user_id y el token de Unify
var login = function(callback) {
  User.findOne({ email: 'unify.argentina@gmail.com' })
    .populate('mainCircle')
    .exec(function(err, user) {
    request(API_URL)
      .post(LOGIN_PATH)
      .send({
        email: 'unify.argentina@gmail.com',
        password: 'This is not my real password'
      })
      .end(function(err, data) {
        callback(user, data.res.body.token);
      });
  });
};

describe('Users API', function() {

  before(function(done) {
    mongoose.connect(config.MONGODB_TEST);
    User.remove().exec(function(err) {
      User.create({
        name: 'Juan Losa',
        email: 'unify.argentina@gmail.com',
        password: 'This is not my real password'
      }, done);
    });
  });

  after(function(done) {
    User.remove().exec(function(err) {
      mongoose.connection.close(done);
    });
  });

  describe('GET /api/user/:user_id', function() {
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
          .end(function(err, data) {
            data.res.body.errors[0].msg.should.equal('Error verifying json web token');
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
                .end(function(err, data) {
                  data.res.statusCode.should.equal(401);
                  data.res.body.errors[0].msg.should.equal('You are trying to find a different user');
                  done();
                });
            });
          });
      });
    });

    it('should allow to get user information with valid access token', function(done) {
      login(function(user, token) {
        request(API_URL)
          .get(USERS_PATH + user._id)
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, data) {
            data.res.statusCode.should.equal(200);
            var jsonUser = data.res.body.user;
            jsonUser._id.should.equal(user._id.toString());
            jsonUser.email.should.equal(user.email);
            jsonUser.name.should.equal(user.name);
            jsonUser.mainCircle.name.should.equal(user.mainCircle.name);
            done();
          });
      });
    });
  });

  describe('PUT /api/user/:user_id', function() {
    it('should not allow to update user information without token', function(done) {
      User.findOne({ email: 'unify.argentina@gmail.com' }, function(err, user) {
        request(API_URL)
          .put(USERS_PATH + user._id)
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
            done();
          });
      });
    });

    it('should not allow to update user information with empty data', function(done) {
      login(function(user, token) {
        request(API_URL)
          .put(USERS_PATH + user._id)
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            var errors = data.res.body.errors;
            var error = errors[0];
            error.param.should.equal('email');
            error.msg.should.equal('Required');
            error = errors[1];
            error.param.should.equal('email');
            error.msg.should.equal('Valid email required');
            error = errors[2];
            error.param.should.equal('password');
            error.msg.should.equal('Password should have at least 6 characters of length');
            error = errors[3];
            error.param.should.equal('confirm_password');
            error.msg.should.equal('Required');
            done();
          });
      });
    });

    it('should not allow to update user information with wrong data', function(done) {
      login(function(user, token) {
        request(API_URL)
          .put(USERS_PATH + user._id)
          .set('Authorization', 'Bearer ' + token)
          .send({
            email: 'a',
            name: 'b',
            password: 'a',
            confirm_password: 'b'
          })
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            var errors = data.res.body.errors;
            var error = errors[0];
            error.param.should.equal('email');
            error.msg.should.equal('Valid email required');
            error = errors[1];
            error.param.should.equal('password');
            error.msg.should.equal('Password should have at least 6 characters of length');
            error = errors[2];
            error.param.should.equal('confirm_password');
            error.msg.should.equal('Confirm password must be equal to password');
            done();
          });
      });
    });

    it('should not allow to update user information with injection data', function(done) {
      login(function(user, token) {
        request(API_URL)
          .put(USERS_PATH + user._id)
          .set('Authorization', 'Bearer ' + token)
          .send({
            "email":"unify.argentina@gmail.com",
            "name":"Joel",
            "password":{"$gt": "undefined"},
            "confirm_password":{"$gt": "undefined"}
          })
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
            done();
          });
      });
    });

    it('should not allow to update user information with existent email', function(done) {
      login(function(user, token) {
        request(API_URL)
          .put(USERS_PATH + user._id)
          .set('Authorization', 'Bearer ' + token)
          .send({
            email: 'unify.argentina@gmail.com',
            name: 'b',
            password: 'aaaaaa',
            confirm_password: 'aaaaaa'
          })
          .end(function(err, data) {
            data.res.statusCode.should.equal(409);
            data.res.body.errors[0].param.should.equal('email');
            data.res.body.errors[0].msg.should.equal('Email is already taken');
            done();
          });
      });
    });

    it('should allow to update user information with unexistent email', function(done) {
      login(function(user, token) {
        request(API_URL)
          .put(USERS_PATH + user._id)
          .set('Authorization', 'Bearer ' + token)
          .send({
            email: 'unexistentemail@gmail.com',
            name: 'name',
            password: 'aaaaaa',
            confirm_password: 'aaaaaa'
          })
          .end(function(err, data) {
            data.res.statusCode.should.equal(200);
            var jsonUser = data.res.body.user;
            jsonUser._id.should.equal(user._id.toString());
            jsonUser.email.should.equal('unexistentemail@gmail.com');
            jsonUser.name.should.equal('name');
            jsonUser.mainCircle.name.should.equal(user.mainCircle.name);
            done();
          });
      });
    });
  });
});