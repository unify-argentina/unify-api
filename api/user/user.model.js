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
var bcrypt = require('bcryptjs');
var logger = require('../../config/logger');

// modelos
var Circle = require('../circle/circle.model');
var Contact = require('../contact/contact.model');

var userSchema = mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  valid_local_user: { type: Boolean, default: false },
  birth_date: Date,
  main_circle: { type: ObjectId, ref: 'Circle' },

  facebook: {
    id: { type: String, index: true, select: false },
    email: String,
    access_token: { type: String, select: false },
    picture: String,
    display_name: String
  },

  twitter: {
    id: { type: String, index: true, select: false },
    access_token: {
      token: { type: String, select: false },
      token_secret: { type: String, select: false }
    },
    picture: String,
    display_name: String,
    username: String
  },

  instagram: {
    id: { type: String, index: true, select: false },
    access_token: { type: String, select: false },
    picture: String,
    display_name: String,
    username: String
  },

  google: {
    id: { type: String, index: true, select: false },
    access_token: { type: String, select: false },
    email: String,
    picture: String,
    display_name: String
  },

  created_at: { type: Date, select: false },
  updated_at: { type: Date, select: false }
});

// Este 'hook' se encarga de hacer un hash de la password para guardarla y
// actualiza la fecha de update y la de creación en caso de ser la primera vez
userSchema.pre('save', function(next) {

  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

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
  if (user.main_circle === undefined) {
    var main_circle = new Circle();
    main_circle.name = 'Main Circle';
    main_circle.user = user._id;
    main_circle.save(function(err) {
      user.main_circle = main_circle;
      user.save(function(err) {
        next();
      });
    });
  }
  else {
    next();
  }
});

// Este 'hook' se encarga de eliminar los círculos/contactos del usuario
userSchema.pre('remove', function(next) {
  var userId = this._id;
  Circle.remove({ user: userId }, function(err) {
    Contact.remove({ user: userId }, function(err) {
      next();
    });
  });
});

userSchema.methods.toString = function() {
  return 'ID: ' + this._id + ' Name: ' + this.name + ' email: ' + this.email + ' main_circle: ' + this.main_circle;
};

// Este método compara la password que se pasa por parámetro con la hasheada
userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

// Chequea que el usuario efectivamente tenga la cuenta asociada
userSchema.methods.hasLinkedAccount = function(account) {
  var hasFields = false;

  if (this[account]) {
    // El access token de Twitter es un objeto con dos campos
    if (account === 'twitter') {
      hasFields = typeof this.twitter.access_token.token === 'string' &&
        typeof this.twitter.access_token.token_secret === 'string';
    }
    else {
      hasFields = typeof this[account].access_token === 'string' && typeof this[account].id === 'string';
    }
  }

  return hasFields;
};

// Verifica que tenga al menos alguna cuenta vinculada y si es la ultima, que tenga email por lo menos
userSchema.methods.isValidToRemoveAccount = function(account) {

  // Como instagram y twitter no proveen del email del usuario, al linkear una cuenta de estas, si es
  // la única, y si no tienen el email seteado, no le permitiremos al usuario deslinkear la misma ya que
  // no va a poder ser identificado más adelante
  var valid = true;
  if (account === 'twitter') {
    valid = this.email !== undefined || this.hasLinkedAccount('instagram');
  }
  else if (account === 'instagram') {
    valid = this.email !== undefined || this.hasLinkedAccount('twitter');
  }

  return valid;
};

// Este método se encarga de habilitar/deshabilitar el campo válido de la cuenta de cada contacto creado
userSchema.methods.toggleSocialAccount = function(account, toggle, callback) {

  if (!toggle) {
    this[account] = undefined;
  }
  Contact.find({ user: this._id }, function(err, contacts) {
    if (err || !contacts) {
      callback(err);
    }
    else {
      // Filtramos los contactos del usuario que tengan linkeada la cuenta
      var linkedContacts = contacts.filter(function(contact) {
        return contact.hasLinkedAccount(account);
      });
      if (linkedContacts.length > 0) {
        var count = 0;
        // Por cada contacto, le habilitamos/deshabilitamos esa cuenta y lo salvamos
        linkedContacts.forEach(function(contact) {
          contact.toggleAccount(account, toggle);
          contact.save(function(err) {
            count++;
            if (err) {
              callback(err);
            }
            else if (count === linkedContacts.length ) {
              callback(null);
            }
          });
        });
      }
      // Si no hay contactos con esa cuenta retornamos
      else {
        callback(null);
      }
    }
  });
};

// Devuelve los campos del usuario que van a servir para traer a los amigos de las redes sociales
userSchema.statics.socialFields = function() {
  return '+twitter.id +twitter.access_token.token +twitter.access_token.token_secret +facebook.id ' +
    '+facebook.access_token +instagram.id +instagram.access_token +google.id +google.access_token';
};

module.exports = mongoose.model('User', userSchema);