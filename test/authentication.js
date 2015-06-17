var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config/config');
var User = require('../api/user/user.model');

var API_URL = 'http://localhost:8080';
var LOGIN_PATH = '/auth/login';

describe('Authentication', function() {

  before(function(done) {
    mongoose.connect(config.MONGODB);
    var user = new User();
    user.name = 'Juan Losa';
    user.email = 'unify.argentina@gmail.com';
    user.password = 'This is not my real password';
    user.save();
    done();
  });

  describe('Login', function() {
    it('should not allow to post empty data', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({})
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.statusMessage.should.equal('Unauthorized');
          done();
        });
    });

    it('should not allow to post wrong data', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          email: 'asdasds',
          password: 's'
        })
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.statusMessage.should.equal('Unauthorized');
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
          data.res.statusMessage.should.equal('Unauthorized');
          data.res.body.message.should.equal("User doesn't exist");
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
          data.res.statusMessage.should.equal('Unauthorized');
          data.res.body.message.should.equal('Wrong password');
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
          data.res.statusMessage.should.equal('OK');
          data.res.body.token.should.be.type('string');
          done();
        });
    });
  });
});