/*
 * Tests de ABM de un circulo
 * @author Joel Márquez
 * */
'use strict';

// requires
var assert = require('assert');
var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../config/logger');

var Contact = require('../api/contact/contact.model');
var User = require('../api/user/user.model');

describe('Contact', function() {

  // Antes de comenzar los tests, nos conectamos a la base
  before(function(done) {
    mongoose.connect(config.MONGODB_TEST);
    Contact.remove().exec(function(err) {
      User.remove().exec(done);
    });
  });

  // Al finalizar todos los tests, nos desconectamos de la base
  after(function(done) {
    mongoose.connection.close(done);
  });

  it('should create ok', function(done) {
    User.create({ name: 'Juan Losa', email: 'unify.argentina@gmail.com', password: 'password' }, function(err, user) {
      var parents = [];
      var contactAncestors = [user.main_circle._id];
      parents.push({
        circle: user.main_circle._id,
        ancestors: contactAncestors
      });
      Contact.create({ name: 'contacto1', circle: user.main_circle, user: user, picture: 'https://www.google.com.ar', parents: parents },
        function(err, contact) {
        Contact.find({}, function(err, contacts) {
          contacts.length.should.equal(1);
          var contact2 = contacts[0];
          contact2.name.should.equal('contacto1');
          contact2.picture.should.equal('https://www.google.com.ar');
          contact2.parents.length.should.equal(1);
          contact2.parents[0].circle.toString().should.equal(user.main_circle._id.toString());
          contact2.parents[0].ancestors.length.should.equal(1);
          contact2.parents[0].ancestors[0].toString().should.equal(user.main_circle._id.toString());
          done();
        });
      });
    });
  });
});