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
    user.save(done);
  });

  after(function(done) {
    User.find({ email: 'unify.argentina@gmail.com' }).remove(done);
  })

  describe('/auth/login', function() {
    it('should not allow to login with empty data', function(done) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({})
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          var errors = data.res.body.errors;
          var error1 = errors[0];
          error1.param.should.equal('email');
          error1.msg.should.equal('Required');
          var error1 = errors[1];
          error1.param.should.equal('email');
          error1.msg.should.equal('Valid email required');
          var error1 = errors[2];
          error1.param.should.equal('password');
          error1.msg.should.equal('Required');
          var error1 = errors[3];
          error1.param.should.equal('password');
          error1.msg.should.equal('Only alphanumeric characters are allowed');
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