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
    accessToken: {
      token: { type: String, select: false },
      tokenSecret: { type: String, select: false }
    },
    picture: String,
    displayName: String,
    userName: String
  },

  instagram: {
    id: { type: String, index: true, select: false },
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
      next();
    });
  });
});

// Recién cuando el usuario haya sido creado exitosamente creamos el círculo principal
userSchema.post('save', function(user, next) {
  if (user.mainCircle === undefined) {
    var mainCircle = new Circle();
    mainCircle.name = 'Main Circle';
    mainCircle.save(function(err) {
      user.mainCircle = mainCircle;
      user.save(function(err) {
        next();
      });
    });
  }
  else {
    next();
  }
});

// Este 'hook' se encarga de eliminar el círculo principal del usuario cuando este se elimina
userSchema.pre('remove', function(next) {
  Circle.remove({ _id: this.mainCircle }).exec();
  next();
});

// Este método compara la password que se pasa por parámetro con la hasheada
userSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

// Chequea que el usuario efectivamente tenga la cuenta asociada
userSchema.methods.hasLinkedAccount = function(account) {
  var hasFields = this[account] && this[account].accessToken && this[account].id;
  // El access token de Twitter es un objeto con dos campos
  if (account === 'twitter') {
    hasFields = hasFields && this.twitter.accessToken.token && this.twitter.accessToken.tokenSecret;
  }
  return hasFields;
};

userSchema.methods.toString = function() {
  return 'Name: ' + this.name + ' email: ' + this.email + ' id: ' + this._id;
};

module.exports = mongoose.model('User', userSchema);