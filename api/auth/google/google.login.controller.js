/*
 * Este módulo se encarga de manejar la autenticación del usuario vía Google
 * @author Joel Márquez
 * */
'use strict';

// requires
var jwt = require('./../util/jwt');
var request = require('request');
var randomstring = require('randomstring');
var logger = require('../../../config/logger');
var notificationsController = require('../../email/notifications.controller');
var googleErrors = require('./google.errors');
var googleUtils = require('./google.utils');

// modelos
var User = require('../../user/user.model');

// Desconecta la cuenta de Google de la de Unify
module.exports.unlinkAccount = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user_id })
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user_id);
        return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
      }
      else {
        user.toggleSocialAccount('google', false, function(err) {
          if (err) {
            logger.warn('There was an error trying to unlink Google: ' + req.user_id);
            return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar desvincular tu cuenta de Google' }]});
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

    var qs = googleUtils.getAccessTokenParams(req);
    logger.info('Access token params: ' + JSON.stringify(qs));

    // Primero intercambiamos el código de autorización para obtener el access token
    request.post(googleUtils.getOauthURL(), { json: true, form: qs }, function(err, response, token) {

      var oauthError = googleErrors.hasError(err, response);
      if (oauthError.hasError) {
        logger.error('Google oauth error: ' + JSON.stringify(oauthError.error));
        return res.status(response.statusCode).send({ errors: [ oauthError.error ] });
      }

      // Necesitamos este refresh token para poder pedir futuros access_tokens
      var refresh_token = token.refresh_token;

      var access_token = token.access_token;
      logger.info('Access token: ' + access_token);

      var headers = { Authorization: 'Bearer ' + access_token };

      // Una vez que tenemos el access_token, obtenemos información del usuario actual
      request.get({ url: googleUtils.getUserProfileURL(), headers: headers, json: true }, function(err, response, profile) {

        var profileError = googleErrors.hasError(err, response);
        if (profileError.hasError) {
          logger.error('Google profile error: ' + JSON.stringify(profileError.error));
          return res.status(response.statusCode).send({ errors: [ profileError.error ] });
        }

        logger.info('Google profile: ' + JSON.stringify(profile));

        // Si tiene el header de authorization, ya es un usuario registrado
        if (req.headers.authorization) {
          logger.info('Authenticated user');
          handleAuthenticatedUser(res, jwt.getUnifyToken(req), profile, refresh_token);
        }
        // Si no tiene el header de authorization, es porque es un nuevo usuario
        else {
          logger.info('Not authenticated user');
          handleNotAuthenticatedUser(res, profile, refresh_token);
        }
      });
    });
  });
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, googleProfile, refresh_token) {

  // Primero verificamos el Unify token
  var payload = null;
  try {
    payload = jwt.verify(unifyToken);
  }
  catch (err) {
    return res.status(401).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
  }

  // En caso de que exista ese usuario, nos fijamos si el id de Google ya está asociado con otra cuenta
  User.findOne({ _id: payload.sub}, User.socialFields())
    .populate('main_circle')
    .exec(function(err, unifyUser) {

    if (err || !unifyUser) {
      logger.warn('User not found: ' + payload.sub);
      return res.status(400).send({ errors: [{ msg: 'No pudimos encontrar el usuario que estás buscando' }] });
    }

    // Si existe un usuario de Unify, nos fijamos si no tiene su cuenta asociada con Google
    else if (!unifyUser.hasLinkedAccount('google')) {

      // Y si no la tiene, nos fijamos que no haya otro usuario en Unify con ese Google id
      User.findOne({ 'google.id': googleProfile.sub })
        .populate('main_circle')
        .exec(function(err, existingUser) {

        // Si ya existe un usuario con ese id devolvemos error ya que no queremos desvincular la cuenta ya vinculada de ese usuario
        if (existingUser) {
          logger.warn('User with Google social account already exists: ' + existingUser.toString());
          return res.status(400).send({ errors: [{ msg: 'La cuenta de Google ya está asociada con otro usuario de Unify' }] });
        }

        // Si no existe un usuario de Unify con ese Google id entonces le asociamos la cuenta al usuario
        else {

          // Al hacer un login con Instagram o con Twitter el usuario no tiene mail, por lo que debemos usar el de Google
          if (unifyUser.email === undefined) {
            unifyUser.email = googleProfile.email;
          }
          logger.info('Existing Unify user: ' + unifyUser.toString());
          linkGoogleData(unifyUser, googleProfile, refresh_token);
          unifyUser.toggleSocialAccount('google', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Google: ' + unifyUser._id);
              return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar vincular tu cuenta de Google' }]});
            }
            else {
              logger.info('Successfully linked Google account for user: ' + unifyUser.toString());
              return saveUser(res, unifyUser);
            }
          });
        }
      });
    }

    // Si ya tiene linkeada su cuenta no hacemos nada y devolvemos el token mas el usuario
    else {
      logger.info('Existing Google user: ' + unifyUser.toString());
      return jwt.createJWT(res, unifyUser);
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, googleProfile, refresh_token) {
  User.findOne({ 'google.id': googleProfile.sub })
    .populate('main_circle')
    .exec(function(err, existingGoogleUser) {
    // Si encuentra a uno con el id de Google, es un usuario registrado con Google
    // pero no loggeado, generamos el token y se lo enviamos
    if (existingGoogleUser) {
      logger.info('Existing Google user: ' + existingGoogleUser.toString());
      linkGoogleData(existingGoogleUser, googleProfile, refresh_token);
      return saveUser(res, existingGoogleUser);
    }
    else {
      User.findOne({ 'email': googleProfile.email })
        .populate('main_circle')
        .exec(function(err, existingUnifyUser) {
        // Si encuentra a uno con el email de Google, vincula la cuenta local con la de Google
        if (existingUnifyUser) {
          logger.info('Existing Unify user: ' + existingUnifyUser);
          linkGoogleData(existingUnifyUser, googleProfile, refresh_token);
          // Habilitamos los posibles contactos que haya creado el usuario previamente al deslinkear la cuenta
          existingUnifyUser.toggleSocialAccount('google', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Google: ' + existingUnifyUser._id);
              return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar vincular tu cuenta de Google' }]});
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
          logger.info('New Google user!: ' + user);
          linkGoogleData(user, googleProfile, refresh_token);
          user.save(function(err) {
            if (err) {
              logger.error('Google Error saving on DB: ' + JSON.stringify(err));
              return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
            }
            else {
              user.password = undefined;
              notificationsController.sendSignupEmailToUser(user);
              return jwt.createJWT(res, user);
            }
          });
        }
      });
    }
  });
};

// Salva el usuario en la base de datos y devuelve un Json Web Token si todo salió bien
var saveUser = function(res, user) {
  user.save(function(err) {
    if (err) {
      logger.error('Google Error saving on DB: ' + JSON.stringify(err));
      return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
    }
    else {
      user.password = undefined;
      return jwt.createJWT(res, user);
    }
  });
};

// Copia los datos de Google en la cuenta de Unify
var linkGoogleData = function(unifyUser, googleProfile, refresh_token) {
  unifyUser.google.id = googleProfile.sub;
  unifyUser.google.email = googleProfile.email;
  if (refresh_token !== undefined) {
    unifyUser.google.refresh_token = refresh_token;
  }
  unifyUser.google.picture = googleProfile.picture.replace('sz=50', 'sz=200');
  unifyUser.google.display_name = googleProfile.name;
};