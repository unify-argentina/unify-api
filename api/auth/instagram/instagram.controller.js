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

// Maneja la lógica principal del login con Instagram
module.exports.linkAccount = function (req, res) {

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
var handleAuthenticatedUser = function(res, unifyToken, instagramProfile, accessToken) {
  User.findOne({ 'instagram.id': instagramProfile.id }, function(err, existingUser) {
    // Si ya existe un usuario con ese id generamos un nuevo unifyToken
    if (existingUser) {
      return res.send({ token: jwt.createJWT(existingUser) });
    }
    // Si no existe uno, buscamos el usuario de Unify autenticado para vincularle la cuenta de Instagram
    else {
      var payload = null;
      try {
        payload = jwt.verify(unifyToken, config.TOKEN_SECRET);
      }
      catch(err) {
        return res.status(401).send({ errors: [{ msg: err.message }] });
      }
      User.findById(payload.sub, function (err, user) {
        if (!user) {
          return res.status(400).send({errors: [{msg: 'User not found'}]});
        }
        // Si existe un usuario de Unify, vinculamos su cuenta con la de Instagram
        else {
          linkInstagramData(user, instagramProfile, accessToken);
          return saveUser(res, user);
        }
      });
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, instagramProfile, accessToken) {
  // Si encuentra a uno con el id de Instagram, es un usuario registrado con Twitter
  // pero no loggeado, generamos el token y se lo enviamos
  User.findOne({ 'instagram.id': instagramProfile.id }, function(err, existingInstagramUser) {
    if (existingInstagramUser) {
      return res.send({ token: jwt.createJWT(existingInstagramUser )});
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
      linkInstagramData(user, instagramProfile, accessToken);
      return saveUser(res, user);
    }
  });
};

// Salva el usuario en la base de datos y devuelve un Json Web Token si todo salió bien
var saveUser = function(res, user) {
  user.save(function (err) {
    if (err) {
      return res.send({ errors: [{ msg: 'Error saving on DB: ' + err }] });
    }
    else {
      return res.send({ token: jwt.createJWT(user) });
    }
  });
};

// Copia los datos de Instagram en la cuenta de Unify
var linkInstagramData = function(unifyUser, instagramProfile, accessToken) {
  unifyUser.instagram.id = instagramProfile.id;
  unifyUser.instagram.userName = instagramProfile.username;
  unifyUser.instagram.displayName = instagramProfile.full_name;
  unifyUser.instagram.picture = instagramProfile.profile_picture;
  unifyUser.instagram.accessToken = accessToken;
};

// Devuelve los parámetros necesarios para el intercambio del accessToken
var getAccessTokenParams = function(req) {
  return {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.INSTAGRAM_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
};