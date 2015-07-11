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
var logger = require('../../config/logger');

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
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
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
  Circle.findOne({ _id: this.mainCircle }, function(err, circle) {
    if (err) {
      next();
    }
    else {
      circle.remove(next);
    }
  });
});

// Este método compara la password que se pasa por parámetro con la hasheada
userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

// Chequea que el usuario efectivamente tenga la cuenta asociada
userSchema.methods.hasLinkedAccount = function(account) {
  var hasFields = false;
  // El access token de Twitter es un objeto con dos campos
  if (account === 'twitter') {
    hasFields = typeof this.twitter.accessToken.token === 'string' && typeof this.twitter.accessToken.tokenSecret === 'string';
  }
  else {
    hasFields = typeof this[account].accessToken === 'string' && typeof this[account].id === 'string';
  }
  return hasFields;
};

// Este método verifica que el circleId pasado por parámetro sea el id de un
// círculo o subcírculo del usuario
userSchema.methods.hasCircleWithId = function(circleId, callback) {
  // Primero buscamos el círculo principal del usuario
  var self = this;
  logger.debug('Trying to find a circle with id=' + circleId);
  Circle.findOne({ _id: self.mainCircle }, function(err, circle) {
    if (err || !circle) {
      callback(false, null);
    }
    else {
      // Para luego poder verificar que el círculo pasado por parámetro
      // tiene como ancestro al círculo principal
      Circle.findOne({ _id: circleId }, function(err, subCircle) {
        var exists = !err && subCircle !== null;
        var isMainCircle = exists && subCircle.ancestors.length === 0 && subCircle._id.equals(self.mainCircle);
        var isValidSubcircle = exists && subCircle.ancestors.length > 0 && subCircle.hasAncestor(circle);
        var result = isMainCircle || isValidSubcircle;
        logger.debug('Circle=' + circleId + ' belongs to current user=' + self._id + ' ? result=' + result);
        callback(result, subCircle);
      });
    }
  });
};

userSchema.methods.toString = function() {
  return 'ID: ' + this._id + ' Name: ' + this.name + ' email: ' + this.email + ' mainCircle: ' + this.mainCircle;
};

module.exports = mongoose.model('User', userSchema);