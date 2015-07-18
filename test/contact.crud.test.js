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
      Contact.create({ name: 'contacto1', circle: user.mainCircle, user: user }, function(err, contact) {
        Contact.find({}, function(err, contacts) {
          contacts.length.should.equal(1);
          contacts[0].name.should.equal('contacto1');
          done();
        });
      });
    });
  });
});