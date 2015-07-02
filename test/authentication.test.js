/*
* Tests de autenticación
* @author Joel Márquez
* */
'use strict';

// requires
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config');

// modelos
var User = require('../api/user/user.model');
var Circle = require('../api/circle/circle.model');

// constantes
var API_URL = 'http://localhost:8000';
var LOGIN_PATH = '/auth/login';
var SIGNUP_PATH = '/auth/signup';

var defaultUser = function() {
  return {
    name: 'Juan Losa',
    email: 'unify.argentina@gmail.com',
    password: 'This is not my real password'
  };
};

describe('Authentication', function() {

  // Antes de comenzar, nos aseguramos de que exista la cuenta con la que vamos a probar el login
  before(function(done) {
    mongoose.connect(config.MONGODB_TEST);
    User.create(defaultUser(), done);
  });

  // Al finalizar los tests, debemos borrar todas las cuentas de la base y desconectarnos de la base
  after(function(done) {
    User.remove().exec(function (err) {
      mongoose.connection.close(done);
    });
  });

  describe('POST /auth/signup', function() {
    it('should not allow to signup with empty data', function(done) {
      request(API_URL)
        .post(SIGNUP_PATH)
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
          error.param.should.equal('name');
          error.msg.should.equal('Required');
          error = errors[3];
          error.param.should.equal('name');
          error.msg.should.equal('Only alphanumeric characters are allowed');
          error = errors[4];
          error.param.should.equal('password');
          error.msg.should.equal('Password should have at least 6 characters of length');
          error = errors[5];
          error.param.should.equal('confirm_password');
          error.msg.should.equal('Required');
          done();
        });
    });

    it('should not allow to signup with wrong data', function(done) {
      request(API_URL)
        .post(SIGNUP_PATH)
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

    it('should not allow to signup with injection data', function(done) {
      request(API_URL)
        .post(SIGNUP_PATH)
        .send({
          "email":"unify.argentina@gmail.com",
          "name":"Joel",
          "password":{"$gt": "undefined"},
          "confirm_password":{"$gt": "undefined"}
        })
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal("You're trying to send object data types");
          done();
        });
    });

    it('should not allow to signup with existent account', function(done) {
      request(API_URL)
        .post(SIGNUP_PATH)
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

    it('should allow to signup with unexistent account', function(done) {
      request(API_URL)
        .post(SIGNUP_PATH)
        .send({
          email: 'unexistentemail@gmail.com',
          name: 'name',
          password: 'aaaaaa',
          confirm_password: 'aaaaaa'
        })
        .end(function(err, data) {
          data.res.statusCode.should.equal(200);
          data.res.body.token.should.be.type('string');
          done();
        });
    });
  });

  describe('POST /auth/login', function() {
    it('should not allow to login with empty data', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
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
          error.msg.should.equal('Required');
          error = errors[3];
          error.param.should.equal('password');
          error.msg.should.equal('Only alphanumeric characters are allowed');
          done();
        });
    });

    it('should not allow to login with wrong data', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          email: 'a',
          password: 's'
        })
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          var error = data.res.body.errors[0];
          error.param.should.equal('email');
          error.msg.should.equal('Valid email required');
          done();
        });
    });

    it('should not allow to login with injection data', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          "email":"unify.argentina@gmail.com",
          "password": {"$gt": "undefined"}
        })
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal("You're trying to send object data types");
          done();
        });
    });

    it('should not allow to login with unexistent account', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          email: 'unexistent@gmail.com',
          password: 'validPassword'
        })
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal("User doesn't exist");
          done();
        });
    });

    it('should not allow to login with incorrect password', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          email: 'unify.argentina@gmail.com',
          password: 'incorrectPassword'
        })
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal('Wrong password');
          done();
        });
    });

    it('should allow login with correct email and password', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          email: 'unify.argentina@gmail.com',
          password: 'This is not my real password'
        })
        .end(function(err, data) {
          data.res.statusCode.should.equal(200);
          data.res.body.token.should.be.type('string');
          done();
        });
    });
  });
});