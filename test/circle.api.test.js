/*
 * Tests de la API de circulos
 * @author Joel Márquez
 * */
'use strict';

// requires
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config');
var util = require('util');
var logger = require('../config/logger');

// modelos
var User = require('../api/user/user.model');
var Circle = require('../api/circle/circle.model');

// constantes
var API_URL = 'http://localhost:8000';
var LOGIN_PATH = '/auth/login';
var CIRCLES_PATH = '/api/user/%s/circle/%s';

// Esta función sirve para hacer un login y devolverle al callback el user_id y el token de Unify
var login = function(callback) {
  User.findOne({ email: 'unify.argentina@gmail.com' })
    .populate('main_circle')
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

describe('Circles API', function() {

  before(function (done) {
    mongoose.connect(config.MONGODB_TEST);
    User.remove().exec(function(err) {
      User.create({
        name: 'Juan Losa',
        email: 'unify.argentina@gmail.com',
        password: 'This is not my real password'
      }, function(err, user) {
        Circle.create({ name: 'Familia', parent: user.main_circle, ancestors: [user.main_circle], user: user._id }, done);
      });
    });
  });

  after(function (done) {
    mongoose.connection.close(done);
  });

  describe('POST /api/user/:user_id/circle', function() {
    it('should not allow to create a circle without token', function(done) {
      User.findOne({ email: 'unify.argentina@gmail.com' }, function(err, user) {
        request(API_URL)
          .post(util.format(CIRCLES_PATH, user._id, ''))
          .send({})
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
            done();
          });
      });
    });

    it('should not allow to create a circle with empty data', function(done) {
      login(function(user, token) {
        request(API_URL)
          .post(util.format(CIRCLES_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            var errors = data.res.body.errors;
            var error = errors[0];
            error.param.should.equal('name');
            error.msg.should.equal('Required');
            error = errors[1];
            error.param.should.equal('parent_id');
            error.msg.should.equal('Required');
            done();
          });
      });
    });

    it('should not allow to create a circle with wrong data', function(done) {
      login(function(user, token) {
        request(API_URL)
          .post(util.format(CIRCLES_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 234, parent_id: 234 })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
            done();
          });
      });
    });

    it('should not allow to create a circle with injection data', function(done) {
      login(function(user, token) {
        request(API_URL)
          .post(util.format(CIRCLES_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: {"$gt": "undefined"}, parent_id: {"$gt": "undefined"} })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
            done();
          });
      });
    });

    it('should not allow to create a circle with an invalid parent circle', function(done) {
      login(function(user, token) {
        request(API_URL)
          .post(util.format(CIRCLES_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 'Amigos', parent_id: 'aksdm8zxkcmaksd9343' })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            data.res.body.errors[0].msg.should.equal("Paren't circle doesn't exists or doesn't belong to current user");
            done();
          });
      });
    });

    it('should not allow to create a circle with an invalid picture', function(done) {
      login(function(user, token) {
        request(API_URL)
          .post(util.format(CIRCLES_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 'Amigos', parent_id: user.main_circle._id, picture: 123 })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            var errors = data.res.body.errors;
            var error = errors[0];
            error.param.should.equal('picture');
            error.msg.should.equal('It must be a valid URL');
            done();
          });
      });
    });

    it('should allow to create a circle with valid parent circle', function(done) {
      login(function(user, token) {
        request(API_URL)
          .post(util.format(CIRCLES_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 'Amigos', parent_id: user.main_circle._id })
          .end(function(err, data) {
            data.res.statusCode.should.equal(200);
            var jsonCircle = data.res.body.circle;
            jsonCircle.parent.should.equal(user.main_circle._id.toString());
            jsonCircle.name.should.equal('Amigos');
            jsonCircle.ancestors[0].should.equal(user.main_circle._id.toString());
            done();
          });
      });
    });
  });

  describe('GET /api/user/:user_id/circle/:circle_id', function() {
    it('should not allow to get a circle without token', function(done) {
      request(API_URL)
        .get(util.format(CIRCLES_PATH, 'a', 'b'))
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
          done();
        });
    });

    it("should not allow to get a circle that doesn't belong to user", function(done) {
      login(function(user, token) {
        request(API_URL)
          .get(util.format(CIRCLES_PATH, user._id, 'asdasdads'))
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            data.res.body.errors[0].msg.should.equal("You are trying to find a circle that doesn't belong to you");
            done();
          });
      });
    });

    it('should allow to get a circle that belong to user', function(done) {
      login(function(user, token) {
        request(API_URL)
          .get(util.format(CIRCLES_PATH, user._id, user.main_circle._id))
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, data) {
            data.res.statusCode.should.equal(200);
            var jsonCircle = data.res.body.circle;
            jsonCircle.name.should.equal('Main Circle');
            jsonCircle._id.should.equal(user.main_circle._id.toString());
            done();
          });
      });
    });
  });

  describe('PUT /api/user/:user_id/circle/:circle_id', function() {
    it('should not allow to update a circle without token', function(done) {
      request(API_URL)
        .put(util.format(CIRCLES_PATH, 'a', 'b'))
        .send({})
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
          done();
        });
    });

    it('should not allow to update a circle with empty data', function(done) {
      login(function(user, token) {
        Circle.findOne({ name: 'Familia', parent: user.main_circle }, function(err, circle) {
          request(API_URL)
            .put(util.format(CIRCLES_PATH, user._id, circle._id))
            .set('Authorization', 'Bearer ' + token)
            .send({})
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
              var errors = data.res.body.errors;
              var error = errors[0];
              error.param.should.equal('name');
              error.msg.should.equal('Required');
              error = errors[1];
              error.param.should.equal('parent_id');
              error.msg.should.equal('Required');
              done();
            });
        });
      });
    });

    it('should not allow to update a circle with wrong data', function(done) {
      login(function(user, token) {
        Circle.findOne({ name: 'Familia', parent: user.main_circle }, function(err, circle) {
          request(API_URL)
            .put(util.format(CIRCLES_PATH, user._id, circle._id))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 234, parent_id: 234 })
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
              data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
              done();
            });
        });
      });
    });

    it('should not allow to update a circle with injection data', function(done) {
      login(function(user, token) {
        Circle.findOne({ name: 'Familia', parent: user.main_circle }, function(err, circle) {
          request(API_URL)
            .put(util.format(CIRCLES_PATH, user._id, circle._id))
            .set('Authorization', 'Bearer ' + token)
            .send({name: {"$gt": "undefined"}, parent_id: {"$gt": "undefined"}})
            .end(function (err, data) {
              data.res.statusCode.should.equal(400);
              data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
              done();
            });
        });
      });
    });

    it('should not allow to update a circle with an invalid parent circle', function(done) {
      login(function(user, token) {
        Circle.findOne({ name: 'Familia', parent: user.main_circle }, function(err, circle) {
          request(API_URL)
            .put(util.format(CIRCLES_PATH, user._id, circle._id))
            .set('Authorization', 'Bearer ' + token)
            .send({name: 'Second', parent_id: 'asdasdasdadasd'})
            .end(function (err, data) {
              data.res.statusCode.should.equal(400);
              data.res.body.errors[0].msg.should.equal("Paren't circle doesn't exists or doesn't belong to current user");
              done();
            });
        });
      });
    });

    it('should not allow to update users main circle', function(done) {
      login(function(user, token) {
        Circle.create({
          name: 'Familia',
          parent: user.main_circle._id,
          ancestors: [user.main_circle._id],
          user: user._id
        }, function(err, first_subcircle) {

          request(API_URL)
            .put(util.format(CIRCLES_PATH, user._id, user.main_circle._id))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Amigos', parent_id: first_subcircle._id })
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
              data.res.body.errors[0].msg.should.equal("Main circle can't be modified");
              done();
            });
        });
      });
    });

    it('should allow to update a circle with valid parent circle', function(done) {
      login(function(user, token) {
        Circle.create({
          name: 'Familia',
          parent: user.main_circle._id,
          ancestors: [user.main_circle._id],
          user: user._id
        }, function(err, first_subcircle) {

          Circle.create({
            name: 'Materna',
            parent: first_subcircle._id,
            ancestors: [user.main_circle._id, first_subcircle._id],
            user: user._id
          }, function(err, secondSubcircle) {

            request(API_URL)
              .put(util.format(CIRCLES_PATH, user._id, secondSubcircle._id))
              .set('Authorization', 'Bearer ' + token)
              .send({ name: 'Amigos', parent_id: user.main_circle._id, picture: 123 })
              .end(function(err, data) {
                data.res.statusCode.should.equal(400);
                var errors = data.res.body.errors;
                var error = errors[0];
                error.param.should.equal('picture');
                error.msg.should.equal('It must be a valid URL');
                done();
              });
          });
        });
      });
    });

    it('should allow to update a circle with valid parent circle', function(done) {
      login(function(user, token) {
        Circle.create({
          name: 'Familia',
          parent: user.main_circle._id,
          ancestors: [user.main_circle._id],
          user: user._id
        }, function(err, first_subcircle) {

          Circle.create({
            name: 'Materna',
            parent: first_subcircle._id,
            ancestors: [user.main_circle._id, first_subcircle._id],
            user: user._id
          }, function(err, secondSubcircle) {

            request(API_URL)
              .put(util.format(CIRCLES_PATH, user._id, secondSubcircle._id))
              .set('Authorization', 'Bearer ' + token)
              .send({ name: 'Amigos', parent_id: user.main_circle._id })
              .end(function(err, data) {
                data.res.statusCode.should.equal(200);
                var jsonCircle = data.res.body.circle;
                jsonCircle.name.should.equal('Amigos');
                jsonCircle._id.should.equal(secondSubcircle._id.toString());
                jsonCircle.parent.should.equal(user.main_circle._id.toString());
                jsonCircle.ancestors[0].should.equal(user.main_circle._id.toString());
                done();
              });
          });
        });
      });
    });
  });

  describe('DELETE /api/user/:user_id/circle/:circle_id', function() {
    it('should not allow to delete a circle without token', function(done) {
      request(API_URL)
        .delete(util.format(CIRCLES_PATH, 'a', 'a'))
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
          done();
        });
    });

    it('should not allow to delete users main circle', function(done) {
      login(function(user, token) {
        request(API_URL)
          .delete(util.format(CIRCLES_PATH, user._id, user.main_circle._id))
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            data.res.body.errors[0].msg.should.equal('Cannot delete users main circle');
            done();
          });
      });
    });

    it('should allow to delete users subcircle', function(done) {
      login(function(user, token) {
        Circle.create({
          name: 'Familia',
          parent: user.main_circle._id,
          ancestors: [user.main_circle._id],
          user: user._id
        }, function(err, subcircle) {
          request(API_URL)
            .delete(util.format(CIRCLES_PATH, user._id, subcircle._id))
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, data) {
              data.res.statusCode.should.equal(200);
              data.res.body.circle.should.equal(subcircle._id.toString());
              done();
            });
        });
      });
    });
  });
});