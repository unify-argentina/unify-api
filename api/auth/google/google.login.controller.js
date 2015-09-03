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
var logger = require('../../../config/logger');
var googleErrors = require('./google.errors');

// modelos
var User = require('../../user/user.model');

// constantes
var ACCESS_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token';
var PEOPLE_API_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

// Desconecta la cuenta de Google de la de Unify
module.exports.unlinkAccount = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user }, function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }
      else {
        user.toggleSocialAccount('google', false, function(err) {
          if (err) {
            logger.warn('There was an error trying to unlink Google: ' + req.user);
            return res.status(400).send({ errors: [{ msg: 'There was an error trying to unlink Google' }]});
          }
          else {
            logger.info('Successfully unlinked Google account for user: ' + user.toString());
            return saveUser(res, user);
          }
        });
      }
    });
  });
};

// Maneja la lógica principal del login con Google
module.exports.linkAccount = function(req, res) {

  process.nextTick(function() {

    var qs = getAccessTokenParams(req);
    logger.info('Access token params: ' + JSON.stringify(qs));

    // Primero intercambiamos el código de autorización para obtener el access token
    request.post(ACCESS_TOKEN_URL, { json: true, form: qs }, function(err, response, token) {

      var oauthError = googleErrors.hasError(err, response);
      if (oauthError.hasError) {
        logger.error('Google oauth error: ' + JSON.stringify(oauthError.error));
        return res.status(response.statusCode).send({ errors: [ oauthError.error ] });
      }

      var access_token = token.access_token;
      logger.info('Access token: ' + access_token);

      var headers = { Authorization: 'Bearer ' + access_token };

      // Una vez que tenemos el access_token, obtenemos información del usuario actual
      request.get({ url: PEOPLE_API_URL, headers: headers, json: true }, function(err, response, profile) {

        var profileError = googleErrors.hasError(err, response);
        if (profileError.hasError) {
          logger.error('Google profile error: ' + JSON.stringify(profileError.error));
          return res.status(response.statusCode).send({ errors: [ profileError.error ] });
        }

        logger.info('Google profile: ' + JSON.stringify(profile));

        // Si tiene el header de authorization, ya es un usuario registrado
        if (req.headers.authorization) {
          logger.info('Authenticated user');
          handleAuthenticatedUser(res, jwt.getUnifyToken(req), profile, access_token);
        }
        // Si no tiene el header de authorization, es porque es un nuevo usuario
        else {
          logger.info('Not authenticated user');
          handleNotAuthenticatedUser(res, profile, access_token);
        }
      });
    });
  });
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, googleProfile, access_token) {
  User.findOne({ 'google.id': googleProfile.sub }, function(err, existingUser) {
    // Si ya existe un usuario con ese id generamos un nuevo unifyToken
    if (existingUser) {
      logger.info('Existing google user: ' + existingUser.toString());
      return jwt.createJWT(res, existingUser);
    }
    // Si no existe uno, buscamos el usuario de Unify autenticado para vincularle la cuenta de Google
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
        else {
          // Al hacer un login con Instagram o con Twitter el usuario no tiene mail, por lo que debemos usar el de Google
          if (user.email === undefined) {
            user.email = googleProfile.email;
          }
          logger.info('Existing unify user: ' + user.toString());
          linkGoogleData(user, googleProfile, access_token);
          user.toggleSocialAccount('google', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Google: ' + user._id);
              return res.status(400).send({ errors: [{ msg: 'There was an error trying to link Google' }]});
            }
            else {
              logger.info('Successfully linked Google account for user: ' + user.toString());
              return saveUser(res, user);
            }
          });
        }
      });
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, googleProfile, access_token) {
  User.findOne({ 'google.id': googleProfile.sub }, function(err, existingGoogleUser) {
    // Si encuentra a uno con el id de Google, es un usuario registrado con Google
    // pero no loggeado, generamos el token y se lo enviamos
    if (existingGoogleUser) {
      logger.info('Existing google user: ' + existingGoogleUser.toString());
      return jwt.createJWT(res, existingGoogleUser);
    }
    else {
      User.findOne({ 'email': googleProfile.email }, function(err, existingUnifyUser) {
        // Si encuentra a uno con el email de Google, vincula la cuenta local con la de Google
        if (existingUnifyUser) {
          logger.info('Existing unify user: ' + existingUnifyUser);
          linkGoogleData(existingUnifyUser, googleProfile, access_token);
          // Habilitamos los posibles contactos que haya creado el usuario previamente al deslinkear la cuenta
          existingUnifyUser.toggleSocialAccount('google', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Google: ' + existingUnifyUser._id);
              return res.status(400).send({ errors: [{ msg: 'There was an error trying to link Google' }]});
            }
            else {
              logger.info('Successfully linked Google account for user: ' + existingUnifyUser.toString());
              return saveUser(res, existingUnifyUser);
            }
          });
        }
        // Si no encuentra a uno, es un usuario nuevo haciendo un login con Google
        else {
          var user = new User();
          user.name = googleProfile.name;
          user.email = googleProfile.email;
          user.password = randomstring.generate(20);
          logger.info('New google user!: ' + user);
          linkGoogleData(user, googleProfile, access_token);
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
      logger.error('Google Error saving on DB: ' + err);
      return res.status(400).send({ errors: [{ msg: 'Error saving on DB: ' + err }] });
    }
    else {
      user.password = undefined;
      return jwt.createJWT(res, user);
    }
  });
};

// Copia los datos de Google en la cuenta de Unify
var linkGoogleData = function(unifyUser, googleProfile, access_token) {
  unifyUser.google.id = googleProfile.sub;
  unifyUser.google.email = googleProfile.email;
  unifyUser.google.access_token = access_token;
  unifyUser.google.picture = googleProfile.picture.replace('sz=50', 'sz=200');
  unifyUser.google.display_name = googleProfile.name;
};

// Devuelve los parámetros necesarios para el intercambio del access_token
var getAccessTokenParams = function(req) {
  return {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
};