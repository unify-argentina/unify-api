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
var logger = require('../../../config/logger');
var facebookUtils = require('./facebook.utils');
var facebookErrors = require('./facebook.errors');

// modelos
var User = require('../../user/user.model');

// constantes
var ACCESS_TOKEN_URL = facebookUtils.getBaseURL() + '/oauth/access_token';
var GRAPH_USER_URL = facebookUtils.getBaseURL() + '/me';

// Desconecta la cuenta de Facebook de la de Unify
module.exports.unlinkAccount = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user }, function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        user.toggleSocialAccount('facebook', false, function(err) {
          if (err) {
            logger.warn('There was an error trying to unlink Facebook: ' + req.user);
            return res.status(400).send({ errors: [{ msg: 'There was an error trying to unlink Facebook' }]});
          }
          else {
            logger.info('Successfully unlinked Facebook account for user: ' + user.toString());
            return saveUser(res, user);
          }
        });
      }
    });
  });
};

// Maneja la lógica principal del login con Facebook
module.exports.linkAccount = function(req, res) {

  process.nextTick(function() {

    var qs = getAccessTokenParams(req);
    logger.info('Access token params: ' + JSON.stringify(qs));

    // Primero intercambiamos el código de autorización para obtener el access token
    request.get({ url: ACCESS_TOKEN_URL, qs: qs, json: true }, function(err, response, access_token) {

      var oauthError = facebookErrors.hasError(err, response);
      if (oauthError.hasError) {
        logger.error('Facebook oauth error: ' + JSON.stringify(oauthError.error));
        return res.status(response.statusCode).send({ errors: [ oauthError.error ] });
      }

      logger.info('Access token: ' + JSON.stringify(access_token));

      // Una vez que tenemos el access_token, obtenemos información del usuario actual
      request.get({ url: GRAPH_USER_URL, qs: access_token, json: true }, function(err, response, profile) {

        var profileError = facebookErrors.hasError(err, response);
        if (profileError.hasError) {
          logger.error('Facebook profile error: ' + JSON.stringify(profileError.error));
          return res.status(response.statusCode).send({ errors: [ profileError.error ] });
        }

        logger.info('Facebook profile: ' + JSON.stringify(profile));

        // Si tiene el header de authorization, ya es un usuario registrado
        if (req.headers.authorization) {
          logger.info('Authenticated user');
          handleAuthenticatedUser(res, jwt.getUnifyToken(req), profile, access_token.access_token);
        }
        // Si no tiene el header de authorization, es porque es un nuevo usuario
        else {
          logger.info('Not authenticated user');
          handleNotAuthenticatedUser(res, profile, access_token.access_token);
        }
      });
    });
  });
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, facebookProfile, access_token) {
  User.findOne({ 'facebook.id': facebookProfile.id }, function(err, existingUser) {
    // Si ya existe un usuario con ese id generamos un nuevo unifyToken
    if (existingUser) {
      logger.info('Existing facebook user: ' + existingUser.toString());
      return jwt.createJWT(res, existingUser);
    }
    // Si no existe uno, buscamos el usuario de Unify autenticado para vincularle la cuenta de Facebook
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
          logger.warn('User not found: ' + payload.sub);
          return res.status(400).send({ errors: [{ msg: 'User not found' }] });
        }
        // Si existe un usuario de Unify, vinculamos su cuenta con la de Facebook
        else {
          // Al hacer un login con Instagram o con Twitter el usuario no tiene mail, por lo que debemos usar el de Facebook
          if (user.email === undefined) {
            user.email = facebookProfile.email;
          }
          logger.info('Existing unify user: ' + user.toString());
          linkFacebookData(user, facebookProfile, access_token);
          // Habilitamos los posibles contactos que haya creado el usuario previamente al deslinkear la cuenta
          user.toggleSocialAccount('facebook', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Facebook: ' + user._id);
              return res.status(400).send({ errors: [{ msg: 'There was an error trying to link Facebook' }]});
            }
            else {
              logger.info('Successfully linked Facebook account for user: ' + user.toString());
              return saveUser(res, user);
            }
          });
        }
      });
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, facebookProfile, access_token) {
  User.findOne({ 'facebook.id': facebookProfile.id }, function(err, existingFacebookUser) {
    // Si encuentra a uno con el id de Facebook, es un usuario registrado con Facebook
    // pero no loggeado, generamos el token y se lo enviamos
    if (existingFacebookUser) {
      logger.info('Existing facebook user: ' + existingFacebookUser.toString());
      return jwt.createJWT(res, existingFacebookUser);
    }
    else {
      User.findOne({ 'email': facebookProfile.email }, function(err, existingUnifyUser) {
        // Si encuentra a uno con el email de Facebook, vincula la cuenta local con la de Facebook
        if (existingUnifyUser) {
          logger.info('Existing unify user: ' + existingUnifyUser);
          linkFacebookData(existingUnifyUser, facebookProfile, access_token);
          // Habilitamos los posibles contactos que haya creado el usuario previamente al deslinkear la cuenta
          existingUnifyUser.toggleSocialAccount('facebook', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Facebook: ' + existingUnifyUser._id);
              return res.status(400).send({ errors: [{ msg: 'There was an error trying to link Facebook' }]});
            }
            else {
              logger.info('Successfully linked Facebook account for user: ' + existingUnifyUser.toString());
              return saveUser(res, existingUnifyUser);
            }
          });
        }
        // Si no encuentra a uno, es un usuario nuevo haciendo un login con Facebook
        else {
          var user = new User();
          user.name = facebookProfile.name;
          user.email = facebookProfile.email;
          user.password = randomstring.generate(20);
          logger.info('New facebook user!: ' + user);
          linkFacebookData(user, facebookProfile, access_token);
          return saveUser(res, user);
        }
      });
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

// Copia los datos de Facebook en la cuenta de Unify
var linkFacebookData = function(unifyUser, facebookProfile, access_token) {
  unifyUser.facebook.id = facebookProfile.id;
  unifyUser.facebook.email = facebookProfile.email;
  unifyUser.facebook.access_token = access_token;
  unifyUser.facebook.picture = facebookUtils.getFacebookPicture(facebookProfile.id);
  unifyUser.facebook.display_name = facebookProfile.name;
};

// Devuelve los parámetros necesarios para el intercambio del access_token
var getAccessTokenParams = function(req) {
  return {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };
};