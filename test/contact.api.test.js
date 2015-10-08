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
var GOOGLE_URL = 'https://www.google.com.ar';

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

  before(function(done) {
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

          var parents = [];
          var contactAncestors = [user.main_circle._id];
          parents.push({
            circle: user.main_circle._id,
            ancestors: contactAncestors
          });
          Contact.create([{ name: 'Jose', circle: user.main_circle, user: user,
            picture: GOOGLE_URL, parents: parents, facebook: { id: 'abc123', display_name: 'Jose' } },
            { name: 'Joaquin', circle: user.main_circle, user: user,
              picture: GOOGLE_URL, parents: parents, facebook: { id: 'abc123', display_name: 'Joaquin' } }], done);
        });
      });
    });
  });

  after(function(done) {
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
            data.res.statusCode.should.equal(400);
            var errors = data.res.body.errors;
            var error = errors[0];
            error.param.should.equal('name');
            error.msg.should.equal('Required');
            error = errors[1];
            error.param.should.equal('picture');
            error.msg.should.equal('Required');
            error = errors[2];
            error.param.should.equal('picture');
            error.msg.should.equal('It must be a valid URL');
            error = errors[3];
            error.param.should.equal('circles_ids');
            error.msg.should.equal('Required');
            done();
          });
      });
    });

    it('should not allow to create a contact with invalid picture url', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 234, picture: 'asdasdasd', circles_ids: 234 })
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

    it('should not allow to create a contact with invalid circles_ids', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 234, picture: GOOGLE_URL, circles_ids: 234 })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            var errors = data.res.body.errors;
            var error = errors[0];
            error.msg.should.equal('You must provide an array of circles_ids');
            done();
          });
      });
    });

    it('should not allow to create a contact with injection circles_ids', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 234, picture: GOOGLE_URL, circles_ids: [{"$gt": "undefined"}] })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            data.res.body.errors[0].msg.should.equal('You must provide a string array of circles_ids');
            done();
          });
      });
    });

    it('should not allow to create a contact with empty circles_ids', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 234, picture: GOOGLE_URL, circles_ids: [] })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            var errors = data.res.body.errors;
            var error = errors[0];
            error.param.should.equal('circles_ids');
            error.msg.should.equal('Required');
            done();
          });
      });
    });

    it('should not allow to create a contact with wrong data', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 234, picture: GOOGLE_URL, circles_ids: ['asdasdads'] })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
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
          .send({ name: {"$gt": "undefined"}, picture: GOOGLE_URL, circles_ids: ['asdasdads'] })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
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
          .send({ name: 'Juan', picture: GOOGLE_URL, circles_ids: ['asdasdads'] })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            data.res.body.errors[0].msg.should
              .equal('You have to suply a Facebook, Twitter or Instagram id for creating a contact');
            done();
          });
      });
    });

    it('should not allow to create a contact without a valid circle', function(done) {
      login('unify.argentina@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 'Juan', picture: GOOGLE_URL,
            facebook_id: 'asd33223423asd', facebook_display_name: 'Juan', circles_ids: ['asdasdads'] })
          .end(function(err, data) {
            data.res.statusCode.should.equal(400);
            data.res.body.errors[0].msg.should.equal("Circles don't exists or don't belong to current user");
            done();
          });
      });
    });

    it('should not allow to create a contact with missing valid circle', function(done) {
      User.findOne({ email: 'unify.argentina@gmail.com' })
        .populate('main_circle')
        .exec(function(err, user) {
        login('unify.argentina2@gmail.com', 'This is not my real password', function(user2, token) {
          request(API_URL)
            .post(util.format(CONTACTS_PATH, user2._id, ''))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'Juan', picture: GOOGLE_URL,
              facebook_id: 'asd33223423asd', facebook_display_name: 'Juan',
              circles_ids: [user2.main_circle._id, user.main_circle._id] })
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
              data.res.body.errors[0].msg.should.equal("One of the circles doesn't belong to current user");
              done();
            });
        });
      });
    });

    it('should allow to create a contact with a valid circle', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        request(API_URL)
          .post(util.format(CONTACTS_PATH, user._id, ''))
          .set('Authorization', 'Bearer ' + token)
          .send({ name: 'Juan', picture: GOOGLE_URL,
            facebook_id: 'asd33223423asd', facebook_display_name: 'Juan', circles_ids: [user.main_circle._id] })
          .end(function(err, data) {
            data.res.statusCode.should.equal(200);
            var jsonContact = data.res.body.contact;
            jsonContact.user.should.equal(user._id.toString());
            jsonContact.name.should.equal('Juan');
            jsonContact.picture.should.equal(GOOGLE_URL);
            jsonContact.facebook.id.should.equal('asd33223423asd');
            jsonContact.facebook.display_name.should.equal('Juan');
            jsonContact.parents.length.should.equal(1);
            jsonContact.parents[0].circle.should.equal(user.main_circle._id.toString());
            jsonContact.parents[0].ancestors.length.should.equal(1);
            jsonContact.parents[0].ancestors[0].should.equal(user.main_circle._id.toString());
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
            data.res.statusCode.should.equal(400);
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
              jsonContact.user._id.toString().should.equal(user._id.toString());
              jsonContact.name.should.equal('Jose');
              jsonContact.picture.should.equal(GOOGLE_URL);
              jsonContact.facebook.id.should.equal('abc123');
              jsonContact.facebook.display_name.should.equal('Jose');
              jsonContact.parents.length.should.equal(1);
              jsonContact.parents[0].circle.should.equal(user.main_circle._id.toString());
              jsonContact.parents[0].ancestors.length.should.equal(1);
              jsonContact.parents[0].ancestors[0].should.equal(user.main_circle._id.toString());
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
              data.res.statusCode.should.equal(400);
              var errors = data.res.body.errors;
              var error = errors[0];
              error.param.should.equal('name');
              error.msg.should.equal('Required');
              error = errors[1];
              error.param.should.equal('picture');
              error.msg.should.equal('Required');
              error = errors[2];
              error.param.should.equal('picture');
              error.msg.should.equal('It must be a valid URL');
              error = errors[3];
              error.param.should.equal('circles_ids');
              error.msg.should.equal('Required');
              done();
            });
        });
      });
    });

    it('should not allow to create a contact with invalid picture url', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 234, picture: 233, circles_ids: 234 })
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

    it('should not allow to update a contact with invalid circles_ids', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({name: 234, picture: GOOGLE_URL, circles_ids: 234})
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
              var errors = data.res.body.errors;
              var error = errors[0];
              error.msg.should.equal('You must provide an array of circles_ids');
              done();
            });
        });
      });
    });

    it('should not allow to update a contact with injection circles_ids', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({name: 234, picture: GOOGLE_URL, circles_ids: [{"$gt": "undefined"}]})
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
              data.res.body.errors[0].msg.should.equal('You must provide a string array of circles_ids');
              done();
            });
        });
      });
    });

    it('should not allow to update a contact with empty circles_ids', function(done) {
      login('unify.argentina2@gmail.com', 'This is not my real password', function(user, token) {
        Contact.findOne({ name: 'Jose' }, function(err, contact) {
          request(API_URL)
            .put(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .send({name: 234, picture: GOOGLE_URL, circles_ids: []})
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
              var errors = data.res.body.errors;
              var error = errors[0];
              error.param.should.equal('circles_ids');
              error.msg.should.equal('Required');
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
            .send({ name: 234, picture: GOOGLE_URL, circles_ids: ['asdasdasda'] })
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
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
            .send({ name: {"$gt": "undefined"}, picture: GOOGLE_URL, circles_ids: ['asdasdasda'] })
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
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
            .send({ name: 'Joaquin', picture: GOOGLE_URL, circles_ids: ['asdasdasdasd'] })
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
               data.res.body.errors[0].msg.should
                 .equal('You have to suply a Facebook, Twitter or Instagram id for updating a contact');
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
            .send({ name: 'Joaquin', picture: GOOGLE_URL,
              facebook_id: 'asdasdasd', facebook_display_name: 'Juan', circles_ids: ['asdasdasdasd'] })
            .end(function(err, data) {
              data.res.statusCode.should.equal(400);
              data.res.body.errors[0].msg.should.equal("Circles don't exists or don't belong to current user");
              done();
            });
        });
      });
    });

    it('should not allow to update a contact with missing valid circle', function(done) {
      User.findOne({ email: 'unify.argentina@gmail.com' })
        .populate('main_circle')
        .exec(function(err, user) {
          login('unify.argentina2@gmail.com', 'This is not my real password', function(user2, token) {
            Contact.findOne({ name: 'Jose' }, function(err, contact) {
              request(API_URL)
                .put(util.format(CONTACTS_PATH, user2._id, contact._id))
                .set('Authorization', 'Bearer ' + token)
                .send({ name: 'Juan', picture: GOOGLE_URL,
                  facebook_id: 'asd33223423asd', facebook_display_name: 'Juan',
                  circles_ids: [user2.main_circle._id, user.main_circle._id] })
                .end(function(err, data) {
                  data.res.statusCode.should.equal(400);
                  data.res.body.errors[0].msg.should.equal("One of the circles doesn't belong to current user");
                  done();
                });
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
            .send({ name: 'Joaquin', picture: 'http://www.facebook.com',
              facebook_id: 'ansdjnj23234', facebook_display_name: 'Juan', circles_ids: [user.main_circle._id] })
            .end(function(err, data) {
              data.res.statusCode.should.equal(200);
              var jsonContact = data.res.body.contact;
              jsonContact.user.should.equal(user._id.toString());
              jsonContact.name.should.equal('Joaquin');
              jsonContact.picture.should.equal('http://www.facebook.com');
              jsonContact.facebook.id.should.equal('ansdjnj23234');
              jsonContact.facebook.display_name.should.equal('Juan');
              jsonContact.parents.length.should.equal(1);
              jsonContact.parents[0].circle.should.equal(user.main_circle._id.toString());
              jsonContact.parents[0].ancestors.length.should.equal(1);
              jsonContact.parents[0].ancestors[0].should.equal(user.main_circle._id.toString());
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
        Contact.findOne({ name: 'Joaquin' }, function(err, contact) {
          request(API_URL)
            .delete(util.format(CONTACTS_PATH, user._id, contact._id))
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, data) {
              data.res.statusCode.should.equal(200);
              data.res.body.contact.should.equal(contact._id.toString());
              done();
            });
        });
      });
    });
  });
});