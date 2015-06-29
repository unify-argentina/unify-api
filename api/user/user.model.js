/*
* Este es el modelo de un usuario de Unify, con sus atributos y sus métodos
* para comparar una contraseña, así como también para antes de guardar un usuario,
* generar un hash de la contraseña y almacenar este valor en vez de la contraseña
* real del usuario
* @author Joel Márquez
* */
'use strict';

// requires
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var Circle = require('../circle/circle.model');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  validLocalUser: { type: Boolean, default: false },
  birthDate: Date,
  mainCircle: { type: ObjectId, ref: 'Circle' },

  facebook: {
    id: { type: String, index: true, select: false },
    email: String,
    accessToken: { type: String, select: false },
    picture: String,
    displayName: String
  },

  twitter: {
    id: { type: String, index: true, select: false },
    email: String,
    accessToken: { type: String, select: false },
    picture: String,
    displayName: String,
    userName: String
  },

  instagram: {
    id: { type: String, index: true, select: false },
    email: String,
    accessToken: { type: String, select: false },
    picture: String,
    displayName: String,
    userName: String
  },

  google: {
    id: { type: String, index: true, select: false },
    email: String,
    accessToken: { type: String, select: false },
    picture: String,
    displayName: String
  }
});

// Este 'hook' se encarga de hacer un hash de la password para guardarla
userSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      if (user.mainCircle === undefined) {
        var mainCircle = new Circle();
        mainCircle.name = 'Main Circle';
        mainCircle.save(function(err) {
          user.mainCircle = mainCircle;
          next();
        });
      }
      else {
        next();
      }
    });
  });
});

// Este método compara la password que se pasa por parámetro con la hasheada
userSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);