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
var _ = require('lodash');
var logger = require('../../config/logger');

// modelos
var Circle = require('../circle/circle.model');
var Contact = require('../contact/contact.model');

var userSchema = mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, lowercase: true },
  password: { type: String, required: true, select: false },
  valid_local_user: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  birth_date: Date,
  main_circle: { type: ObjectId, ref: 'Circle' },
  picture: String,

  facebook: {
    id: { type: String, index: true, select: false },
    email: String,
    access_token: { type: String, select: false },
    picture: String,
    display_name: String,

    last_content_date_photo: String,
    last_content_date_video: String,
    last_content_date_status: String
  },

  twitter: {
    id: { type: String, index: true, select: false },
    access_token: {
      token: { type: String, select: false },
      token_secret: { type: String, select: false }
    },
    picture: String,
    display_name: String,
    username: String,

    last_content_id: String,

    last_search_id: String,
    last_search_term: String
  },

  instagram: {
    id: { type: String, index: true, select: false },
    access_token: { type: String, select: false },
    picture: String,
    display_name: String,
    username: String,

    last_content_date: String,

    last_search_id: String,
    last_search_term: String
  },

  google: {
    id: { type: String, index: true, select: false },
    refresh_token: { type: String, select: false },
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

// Recién cuando el usuario haya sido creado exitosamente creamos el grupo principal
userSchema.post('save', function(user, next) {
  if (user.main_circle === undefined) {
    var main_circle = new Circle();
    main_circle.name = 'Principal';
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

// Este 'hook' se encarga de eliminar los grupos/contactos del usuario
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
      hasFields = typeof this[account].id === 'string';
    }
  }

  return hasFields;
};

// Verifica que tenga al menos alguna cuenta vinculada y si es la ultima, que tenga email por lo menos
userSchema.methods.isValidToRemoveAccount = function(account) {

  // Como Instagram y Twitter no proveen del email del usuario, al linkear una cuenta de estas, si es
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
    // Si es Google, el refresh_token lo debemos dejar por las dudas de que linkee de nuevo la cuenta
    if (account === 'google') {
      this.google.id = undefined;
      this.google.email = undefined;
      this.google.picture = undefined;
      this.google.display_name = undefined;
    }
    else {
      this[account] = undefined;
    }
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
            else if (count === linkedContacts.length) {
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

// Controla que el email no sea el mismo del usuario y que en el request haya venido el email
userSchema.methods.shouldResetVerificatedAccount = function(email) {
  return typeof email !== undefined && this.email !== email;
};

// Elimina el last_content_date de todas las redes del usuario
userSchema.methods.removeLastContentDate = function() {
  this.facebook.last_content_date_photo = undefined;
  this.facebook.last_content_date_video = undefined;
  this.facebook.last_content_date_status = undefined;
  this.twitter.last_content_id = undefined;
  this.instagram.last_content_date = undefined;
};

// Guarda los last_content_date de cada red social
userSchema.methods.saveLastContentDates = function(slicedMedia, callback) {

  // Buscamos el último contenido de cada red social para guardarlo
  var facebookStatus = _.findLast(slicedMedia, function(media) {
    return media.provider === 'facebook' && media.type === 'text';
  });
  if (facebookStatus) {
    this.facebook.last_content_date_status = facebookStatus.created_time;
  }

  var facebookPhoto = _.findLast(slicedMedia, function(media) {
    return media.provider === 'facebook' && media.type === 'image';
  });
  if (facebookPhoto) {
    this.facebook.last_content_date_photo = facebookPhoto.created_time;
  }

  var facebookVideo = _.findLast(slicedMedia, function(media) {
    return media.provider === 'facebook' && media.type === 'video';
  });
  if (facebookVideo) {
    this.facebook.last_content_date_video = facebookVideo.created_time;
  }

  var instagramMedia = _.findLast(slicedMedia, function(media) {
    return media.provider === 'instagram';
  });
  if (instagramMedia) {
    this.instagram.last_content_date = instagramMedia.created_time;
  }

  var twitterMedia = _.findLast(slicedMedia, function(media) {
    return media.provider === 'twitter';
  });
  if (twitterMedia) {
    this.twitter.last_content_id = twitterMedia.id;
  }

  this.save(callback);
};

// Guarda los last_search_date de cada red social
userSchema.methods.saveLastSearchDates = function(slicedSearches, query, callback) {

  // Buscamos el último contenido de cada red social para guardarlo
  var instagramSearch = _.findLast(slicedSearches, function(media) {
    return media.provider === 'instagram';
  });
  if (instagramSearch) {
    this.instagram.last_search_id = instagramSearch.created_time;
    if (query) {
      this.instagram.last_search_term = query;
    }
  }

  var twitterSearch = _.findLast(slicedSearches, function(media) {
    return media.provider === 'twitter';
  });
  if (twitterSearch) {
    this.twitter.last_search_id = twitterSearch.id;
    if (query) {
      this.twitter.last_search_term = query;
    }
  }

  this.save(callback);
};

// Elimina el last_content_date de todas las redes del usuario
userSchema.methods.removeLastSearchDate = function() {
  this.twitter.last_search_id = undefined;
  this.twitter.last_search_term = undefined;
  this.instagram.last_search_id = undefined;
  this.instagram.last_search_term = undefined;
};

userSchema.methods.hasSavedSearch = function(provider) {
  return typeof this[provider].last_search_id === 'string' && typeof this[provider].last_search_term  === 'string';
};

// Devuelve los campos del usuario que van a servir para traer a los amigos de las redes sociales
userSchema.statics.socialFields = function() {
  return '+twitter.id +twitter.access_token.token +twitter.access_token.token_secret +facebook.id ' +
    '+facebook.access_token +instagram.id +instagram.access_token +google.id +google.refresh_token';
};

module.exports = mongoose.model('User', userSchema);