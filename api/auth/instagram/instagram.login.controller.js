/*
 * Este módulo se encarga de manejar la autenticación del usuario vía Instagram
 * @author Joel Márquez
 * */
'use strict';

// requires
var jwt = require('./../util/jwt');
var request = require('request');
var config = require('../../../config');
var randomstring = require('randomstring');

// modelos
var User = require('../../user/user.model');

// constantes
var ACCESS_TOKEN_URL = 'https://api.instagram.com/oauth/access_token';

// Desconecta la cuenta de Instagram de la de Unify
module.exports.unlinkAccount = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user }, function(err, user) {
      if (err || !user) {
        return res.status(400).send({ errors: [{ msg: 'User not found' }]});
      }
      else {
        user.instagram = undefined;
        return saveUser(res, user);
      }
    });
  });
};

// Maneja la lógica principal del login con Instagram
module.exports.linkAccount = function(req, res) {

  process.nextTick(function() {
    // Intercambiamos el código de autorización para obtener el access token
    request.post({ url: ACCESS_TOKEN_URL, form: getAccessTokenParams(req), json: true }, function(error, response, body) {
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).send({ errors: [{ msg: error.message }] });
      }
      // Si tiene el header de authorization, ya es un usuario registrado
      if (req.headers.authorization) {
        handleAuthenticatedUser(res, jwt.getUnifyToken(req), body.user, body.access_token);
      }
      // Si no tiene el header de authorization, es porque es un nuevo usuario
      else {
        handleNotAuthenticatedUser(res, body.user, body.access_token);
      }
    });
  });
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, instagramProfile, access_token) {
  User.findOne({ 'instagram.id': instagramProfile.id }, function(err, existingUser) {
    // Si ya existe un usuario con ese id generamos un nuevo unifyToken
    if (existingUser) {
      return jwt.createJWT(res, existingUser);
    }
    // Si no existe uno, buscamos el usuario de Unify autenticado para vincularle la cuenta de Instagram
    else {
      var payload = null;
      try {
        payload = jwt.verify(unifyToken);
      }
      catch(err) {
        return res.status(401).send({ errors: [{ msg: 'Error verifying json web token' }] });
      }
      User.findById(payload.sub, function(err, user) {
        if (err || !user) {
          return res.status(400).send({ errors: [{ msg: 'User not found' }] });
        }
        // Si existe un usuario de Unify, vinculamos su cuenta con la de Instagram
        else {
          linkInstagramData(user, instagramProfile, access_token);
          return saveUser(res, user);
        }
      });
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, instagramProfile, access_token) {
  // Si encuentra a uno con el id de Instagram, es un usuario registrado con Twitter
  // pero no loggeado, generamos el token y se lo enviamos
  User.findOne({ 'instagram.id': instagramProfile.id }, function(err, existingInstagramUser) {
    if (existingInstagramUser) {
      return jwt.createJWT(res, existingInstagramUser);
    }
    // Si no encuentra a uno, no tenemos forma de saber el email de Instagram, ya que es algo que la API
    // no lo provee, entonces damos de alta un nuevo usuario de Unify sin email
    else {
      var user = new User();
      user.name = instagramProfile.full_name;
      // Le ponemos este email para que si llegara a vincular la cuenta con facebook,
      // use ese email. Tiene que ser distinto sí o sí ya que en MongoDB tenemos una
      // restricción de que el email tiene que ser único
      user.email = 'no-email' + randomstring.generate(10) + '@gmail.com';
      user.password = randomstring.generate(20);
      linkInstagramData(user, instagramProfile, access_token);
      return saveUser(res, user);
    }
  });
};

// Salva el usuario en la base de datos y devuelve un Json Web Token si todo salió bien
var saveUser = function(res, user) {
  user.save(function(err) {
    if (err) {
      return res.status(400).send({ errors: [{ msg: 'Error saving on DB: ' + err }] });
    }
    else {
      user.password = undefined;
      return jwt.createJWT(res, user);
    }
  });
};

// Copia los datos de Instagram en la cuenta de Unify
var linkInstagramData = function(unifyUser, instagramProfile, access_token) {
  unifyUser.instagram.id = instagramProfile.id;
  unifyUser.instagram.userName = instagramProfile.username;
  unifyUser.instagram.display_name = instagramProfile.full_name;
  unifyUser.instagram.picture = instagramProfile.profile_picture;
  unifyUser.instagram.access_token = access_token;
};

// Devuelve los parámetros necesarios para el intercambio del access_token
var getAccessTokenParams = function(req) {
  return {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.INSTAGRAM_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
};