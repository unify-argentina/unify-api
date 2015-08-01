/*
 * Tests de la API de contactos
 * @author Joel Márquez
 * */
'use strict';

// requires
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config');
var util = require('util');
var logger = require('../config/logger');

// modelos
var User = require('../api/user/user.model');
var Circle = require('../api/circle/circle.model');
var Contact = require('../api/contact/contact.model');

// constantes
var API_URL = 'http://localhost:8000';
var LOGIN_PATH = '/auth/login';
var CONTACTS_PATH = '/api/user/%s/contact/%s';

// Esta función sirve para hacer un login y devolverle al callback el user_id y el token de Unify
var login = function(email, password, callback) {
  User.findOne({ email: email })
    .populate('main_circle')
    .exec(function(err, user) {
      request(API_URL)
        .post(LOGIN_PATH)
        .send({
          email: email,
          password: password
        })
        .end(function(err, data) {
          callback(user, data.res.body.token);
        });
    });
};

describe('Contacts API', function() {

  before(function (done) {
    mongoose.connect(config.MONGODB_TEST);
    User.remove().exec(function(err) {
      User.create([{
        name: 'Juan Losa',
        email: 'unify.argentina@gmail.com',
        password: 'This is not my real password'
        }, {
          name: 'Juan Losa',
          email: 'unify.argentina2@gmail.com',
          password: 'This is not my real password',
          facebook: {
            access_token: 'asdasdasd',
            id: 'asdasd'
          }
        }], function(err, users) {
          var user = users[1];
        Contact.remove().exec(function(err) {
          Contact.create({
            name: 'Jose', facebook_id: 'asdasdasd',
            circle: user.main_circle._id, user: user._id }, done);
        });
      });
    });
  });

  after(function (done) {
    mongoose.connection.close(done);
  });

  describe('POST /api/user/:user_id/contact', function() {
    it('should not allow to create a contact without token', function(done) {
      User.findOne({ email: 'unify.argentina@gmail.com' }, function(err, user) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .send({})
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
            done();
          });
      });
    });

    it('should not allow to create a contact with empty data', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            var errors = data.res.body.errors;
            var error = errors[0];
            error.param.should.equal('name');
            error.msg.should.equal('Required');
            error = errors[1];
            error.param.should.equal('name');
            error.msg.should.equal('Only alphanumeric characters are allowed');
            error = errors[2];
            error.param.should.equal('circle_id');
            error.msg.should.equal('Required');
            error = errors[3];
            error.param.should.equal('circle_id');
            error.msg.should.equal('Only alphanumeric characters are allowed');
            done();
          });
      });
    });

    it('should not allow to create a contact with wrong data', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 234, circle_id: 234 })
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
            done();
          });
      });
    });

    it('should not allow to create a contact with injection data', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: {"$gt": "undefined"}, circle_id: {"$gt": "undefined"} })
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
            done();
          });
      });
    });

    it('should not allow to create a contact without social id', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 'Juan', circle_id: 'aksdm8zxkcmaksd9343' })
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should
              .equal('You have to suply a facebook, twitter or instagram id for creating a contact');
            done();
          });
      });
    });

    it('should not allow to create a contact without a valid circle', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 'Juan', facebook_id: 'asd33223423asd', circle_id: 'aksdm8zxkcmaksd9343' })
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should.equal("Circle doesn't exists or doesn't belong to current user");
            done();
          });
      });
    });

    it('should allow to create a contact with a valid circle', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 'Juan', facebook_id: 'asd33223423asd', circle_id: user.main_circle._id })
          .end(function(err, data) {
            data.res.statusCode.should.equal(200);
            var jsonContact = data.res.body.contact;
            jsonContact.user.should.equal(user._id.toString());
            jsonContact.circle.should.equal(user.main_circle._id.toString());
            jsonContact.name.should.equal('Juan');
            jsonContact.facebook_id.should.equal('asd33223423asd');
            done();
          });
      });
    });
  });

  describe('GET /api/user/:user_id/contact/:contact_id', function() {
    it('should not allow to get a contact without token', function(done) {
      request(API_URL)
        .get(util.format(CONTACTS_PATH, 'a', 'b'))
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
          done();
        });
    });

    it("should not allow to get a contact that doesn't belong to user", function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .get(util.format(CONTACTS_PATH, user._id, 'basdasdasd'))
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, data) {
            data.res.statusCode.should.equal(401);
            data.res.body.errors[0].msg.should.equal("You are trying to find a contact that doesn't belong to you");
            done();
          });
      });
    });

    it('should allow to get a contact that belong to user', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .get(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, data) {
              data.res.statusCode.should.equal(200);
              var jsonContact = data.res.body.contact;
              jsonContact.user.should.equal(user._id.toString());
              jsonContact.circle.should.equal(user.main_circle._id.toString());
              jsonContact.name.should.equal('Jose');
              jsonContact.facebook_id.should.equal('asdasdasd');
              done();
            });
        });
      });
    });
  });

  describe('PUT /api/user/:user_id/contact/:contact_id', function() {
    it('should not allow to update a contact without token', function(done) {
      request(API_URL)
        .put(util.format(CONTACTS_PATH, 'a', 'a'))
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
          done();
        });
    });

    it('should not allow to update a contact with empty data', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({})
            .end(function(err, data) {
              data.res.statusCode.should.equal(401);
              var errors = data.res.body.errors;
              var error = errors[0];
              error.param.should.equal('name');
              error.msg.should.equal('Required');
              error = errors[1];
              error.param.should.equal('name');
              error.msg.should.equal('Only alphanumeric characters are allowed');
              error = errors[2];
              error.param.should.equal('circle_id');
              error.msg.should.equal('Required');
              error = errors[3];
              error.param.should.equal('circle_id');
              error.msg.should.equal('Only alphanumeric characters are allowed');
              done();
            });
        });
      });
    });

    it('should not allow to update a contact with wrong data', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 234, circle_id: 234 })
            .end(function(err, data) {
              data.res.statusCode.should.equal(401);
              data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
              done();
            });
        });
      });
    });

    it('should not allow to update a contact with injection data', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: {"$gt": "undefined"}, circle_id: {"$gt": "undefined"} })
            .end(function(err, data) {
              data.res.statusCode.should.equal(401);
              data.res.body.errors[0].msg.should.equal("You're trying to send invalid data types");
              done();
            });
        });
      });
    });

    it('should not allow to update a contact without social id', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Joaquin', circle_id: 'asdasdasdasd' })
            .end(function(err, data) {
              data.res.statusCode.should.equal(401);
               data.res.body.errors[0].msg.should
                 .equal('You have to suply a facebook, twitter or instagram id for updating a contact');
              done();
            });
        });
      });
    });

    it('should not allow to update a contact with an invalid circle', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Joaquin', facebook_id: 'asdasdasd', circle_id: 'asdasdasdasd' })
            .end(function(err, data) {
              data.res.statusCode.should.equal(401);
              data.res.body.errors[0].msg.should.equal("Circle doesn't exists or doesn't belong to current user");
              done();
            });
        });
      });
    });

    it('should allow to update a contact with valid circle', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Joaquin', facebook_id: 'ansdjnj23234', circle_id: user.main_circle._id })
            .end(function(err, data) {
              data.res.statusCode.should.equal(200);
              var jsonContact = data.res.body.contact;
              jsonContact.user.should.equal(user._id.toString());
              jsonContact.circle.should.equal(user.main_circle._id.toString());
              jsonContact.name.should.equal('Joaquin');
              jsonContact.facebook_id.should.equal('ansdjnj23234');
              done();
            });
        });
      });
    });
  });

  describe('DELETE /api/user/:user_id/contact/:contact_id', function() {
    it('should not allow to delete a contact without token', function(done) {
      request(API_URL)
        .delete(util.format(CONTACTS_PATH, 'a', 'a'))
        .end(function(err, data) {
          data.res.statusCode.should.equal(401);
          data.res.body.errors[0].msg.should.equal('Please make sure your request has an Authorization header');
          done();
        });
    });

    it('should allow to delete users contact', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Joaquin' }, function (err, contact) {
          request(API_URL)
            .delete(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, data) {
              data.res.statusCode.should.equal(200);
              data.res.body.contact.should.equal(contact._id.toString());
              done();
            });
        });
      });
    });
  });
});