/*
 * Este módulo se encarga de manejar la autenticación del usuario vía Facebook
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
var ACCESS_TOKEN_URL = 'https://graph.facebook.com/v2.3/oauth/access_token';
var GRAPH_USER_URL = 'https://graph.facebook.com/v2.3/me';

// Desconecta la cuenta de Facebook de la de Unify
module.exports.unlinkAccount = function (req, res) {

  process.nextTick(function () {
    User.findOne({ _id: req.user }, function(err, user) {
      if (err || !user) {
        return res.status(400).send({ errors: [{ msg: 'User not found' }]});
      }
      else {
        user.facebook = undefined;
        return saveUser(res, user);
      }
    });
  });
};

// Maneja la lógica principal del login con Facebook
module.exports.linkAccount = function (req, res) {

  process.nextTick(function() {
    // Primero intercambiamos el código de autorización para obtener el access token
    request.get({ url: ACCESS_TOKEN_URL, qs: getAccessTokenParams(req), json: true }, function (err, response, accessToken) {
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).send({ errors: [{ msg: accessToken.error.message }] });
      }

      // Una vez que tenemos el accessToken, obtenemos información del usuario actual
      request.get({ url: GRAPH_USER_URL, qs: accessToken, json: true }, function (err, response, profile) {
        if (response.statusCode !== 200) {
          return res.status(response.statusCode).send({ errors: [{ msg: accessToken.error.message }] });
        }

        // Si tiene el header de authorization, ya es un usuario registrado
        if (req.headers.authorization) {
          handleAuthenticatedUser(res, jwt.getUnifyToken(req), profile, accessToken.access_token);
        }
        // Si no tiene el header de authorization, es porque es un nuevo usuario
        else {
          handleNotAuthenticatedUser(res, profile, accessToken.access_token);
        }
      });
    });
  });
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, facebookProfile, accessToken) {
  User.findOne({ 'facebook.id': facebookProfile.id }, function (err, existingUser) {
    // Si ya existe un usuario con ese id generamos un nuevo unifyToken
    if (existingUser) {
      return res.send({ token: jwt.createJWT(existingUser) });
    }
    // Si no existe uno, buscamos el usuario de Unify autenticado para vincularle la cuenta de Facebook
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
        // Si existe un usuario de Unify, vinculamos su cuenta con la de Facebook
        else {
          // Este email puede haber sido generado al hacer un login con Instagram o con Twitter,
          // por lo que debemos pisarlo y usar un email verdadero
          if (user.email.indexOf('no-email') > -1) {
            user.email = facebookProfile.email;
          }
          linkFacebookData(user, facebookProfile, accessToken);
          return saveUser(res, user);
        }
      });
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, facebookProfile, accessToken) {
  User.findOne({ 'facebook.id': facebookProfile.id }, function (err, existingFacebookUser) {
    // Si encuentra a uno con el id de Facebook, es un usuario registrado con Facebook
    // pero no loggeado, generamos el token y se lo enviamos
    if (existingFacebookUser) {
      return res.send({ token: jwt.createJWT(existingFacebookUser) });
    }
    else {
      User.findOne({ 'email': facebookProfile.email }, function(err, existingUnifyUser) {
        // Si encuentra a uno con el email de Facebook, vincula la cuenta local con la de Facebook
        if (existingUnifyUser) {
          linkFacebookData(existingUnifyUser, facebookProfile, accessToken);
          return saveUser(res, existingUnifyUser);
        }
        // Si no encuentra a uno, es un usuario nuevo haciendo un login con Facebook
        else {
          var user = new User();
          user.name = facebookProfile.name;
          user.email = facebookProfile.email;
          user.password = randomstring.generate(20);
          linkFacebookData(user, facebookProfile, accessToken);
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

// Copia los datos de Facebook en la cuenta de Unify
var linkFacebookData = function(unifyUser, facebookProfile, accessToken) {
  unifyUser.facebook.id = facebookProfile.id;
  unifyUser.facebook.email = facebookProfile.email;
  unifyUser.facebook.accessToken = accessToken;
  unifyUser.facebook.picture = getFacebookPicture(facebookProfile.id);
  unifyUser.facebook.displayName = facebookProfile.name;
};

// Devuelve los parámetros necesarios para el intercambio del accessToken
var getAccessTokenParams = function(req) {
  return {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };
};

// Devuelve la url de la imagen del perfil del usuario con id = profileId
var getFacebookPicture = function(profileId) {
  return 'https://graph.facebook.com/v2.3/' + profileId + '/picture?type=large';
};