/*
 * Este módulo se encarga de manejar la autenticación del usuario vía Google
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
var ACCESS_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token';
var PEOPLE_API_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

// Desconecta la cuenta de Google de la de Unify
module.exports.unlinkAccount = function (req, res) {

  process.nextTick(function () {
    User.findOne({ _id: req.user }, function(err, user) {
      if (err) {
        return res.status(400).send({ errors: [{ msg: 'User not found' }]});
      }
      else {
        user.google = undefined;
        return saveUser(res, user);
      }
    });
  });
};

// Maneja la lógica principal del login con Google
module.exports.linkAccount = function (req, res) {

  process.nextTick(function() {
    // Primero intercambiamos el código de autorización para obtener el access token
    request.post(ACCESS_TOKEN_URL, { json: true, form: getAccessTokenParams(req) }, function(err, response, token) {
      var accessToken = token.access_token;
      var headers = { Authorization: 'Bearer ' + accessToken };

      // Una vez que tenemos el accessToken, obtenemos información del usuario actual
      request.get({ url: PEOPLE_API_URL, headers: headers, json: true }, function(err, response, profile) {

        // Si tiene el header de authorization, ya es un usuario registrado
        if (req.headers.authorization) {
          handleAuthenticatedUser(res, jwt.getUnifyToken(req), profile, accessToken);
        }
        // Si no tiene el header de authorization, es porque es un nuevo usuario
        else {
          handleNotAuthenticatedUser(res, profile, accessToken);
        }
      });
    });
  });
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, googleProfile, accessToken) {
  User.findOne({ 'google.id': googleProfile.sub }, function(err, existingUser) {
    // Si ya existe un usuario con ese id generamos un nuevo unifyToken
    if (existingUser) {
      return res.send({ token: jwt.createJWT(existingUser) });
    }
    // Si no existe uno, buscamos el usuario de Unify autenticado para vincularle la cuenta de Google
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
          return res.status(400).send({ errors: [{ msg: 'User not found' }] });
        }
        else {
          // Este email puede haber sido generado al hacer un login con Instagram o con Twitter,
          // por lo que debemos pisarlo y usar un email verdadero
          if (user.email.indexOf('no-email') > -1) {
            user.email = googleProfile.email;
          }
          linkGoogleData(user, googleProfile, accessToken);
          return saveUser(res, user);
        }
      });
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, googleProfile, accessToken) {
  User.findOne({ 'google.id': googleProfile.sub }, function(err, existingGoogleUser) {
    // Si encuentra a uno con el id de Google, es un usuario registrado con Google
    // pero no loggeado, generamos el token y se lo enviamos
    if (existingGoogleUser) {
      return res.send({ token: jwt.createJWT(existingGoogleUser) });
    }
    else {
      User.findOne({ 'email': googleProfile.email }, function(err, existingUnifyUser) {
        // Si encuentra a uno con el email de Google, vincula la cuenta local con la de Google
        if (existingUnifyUser) {
          linkGoogleData(existingUnifyUser, googleProfile, accessToken);
          return saveUser(res, existingUnifyUser);
        }
        // Si no encuentra a uno, es un usuario nuevo haciendo un login con Google
        else {
          var user = new User();
          user.name = googleProfile.name;
          user.email = googleProfile.email;
          user.password = randomstring.generate(20);
          linkGoogleData(user, googleProfile, accessToken);
          return saveUser(res, user);
        }
      });
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

// Copia los datos de Google en la cuenta de Unify
var linkGoogleData = function(unifyUser, googleProfile, accessToken) {
  unifyUser.google.id = googleProfile.sub;
  unifyUser.google.email = googleProfile.email;
  unifyUser.google.accessToken = accessToken;
  unifyUser.google.picture = googleProfile.picture.replace('sz=50', 'sz=200');
  unifyUser.google.displayName = googleProfile.name;
};

// Devuelve los parámetros necesarios para el intercambio del accessToken
var getAccessTokenParams = function(req) {
  return {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
};