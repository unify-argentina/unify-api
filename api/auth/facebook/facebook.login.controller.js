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
var notificationsController = require('../../email/notifications.controller');

// modelos
var User = require('../../user/user.model');

// constantes
var ACCESS_TOKEN_URL = facebookUtils.getBaseURL() + '/oauth/access_token';
var GRAPH_USER_URL = facebookUtils.getBaseURL() + '/me';

// Desconecta la cuenta de Facebook de la de Unify
module.exports.unlinkAccount = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user })
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
      }
      else {
        user.toggleSocialAccount('facebook', false, function(err) {
          if (err) {
            logger.warn('There was an error trying to unlink Facebook: ' + req.user);
            return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar desvincular tu cuenta de Facebook' }]});
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

  // Primero verificamos el Unify token
  var payload = null;
  try {
    payload = jwt.verify(unifyToken);
  }
  catch (err) {
    return res.status(401).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
  }

  // En caso de que exista ese usuario, nos fijamos si el id de Facebook ya está asociado con otra cuenta
  User.findOne({ _id: payload.sub}, User.socialFields())
    .populate('main_circle')
    .exec(function(err, unifyUser) {

    if (err || !unifyUser) {
      logger.warn('User not found: ' + payload.sub);
      return res.status(400).send({ errors: [{ msg: 'El usuario no ha podido ser encontrado' }] });
    }

    // Si existe un usuario de Unify, nos fijamos si no tiene su cuenta asociada con Facebook
    else if (!unifyUser.hasLinkedAccount('facebook')) {

      // Y si no la tiene, nos fijamos que no haya otro usuario en Unifycon ese Facebook id
      User.findOne({ 'facebook.id': facebookProfile.id })
        .populate('main_circle')
        .exec(function(err, existingUser) {

        // Si ya existe un usuario con ese id devolvemos error ya que no queremos desvincular la cuenta ya vinculada de ese usuario
        if (existingUser) {
          logger.warn('User with Facebook social account already exists: ' + existingUser.toString());
          return res.status(400).send({ errors: [{ msg: 'La cuenta de Facebook ya está asociada con otro usuario de Unify' }] });
        }

        // Si no existe un usuario de Unify con ese Facebook id entonces le asociamos la cuenta al usuario
        else {

          // Al hacer un login con Instagram o con Twitter el usuario no tiene mail, por lo que debemos usar el de Facebook
          if (unifyUser.email === undefined) {
            unifyUser.email = facebookProfile.email;
          }
          logger.info('Existing Unify user: ' + unifyUser.toString());
          linkFacebookData(unifyUser, facebookProfile, access_token);

          // Habilitamos los posibles contactos que haya creado el usuario previamente al deslinkear la cuenta
          unifyUser.toggleSocialAccount('facebook', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Facebook: ' + unifyUser._id);
              return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar vincular tu cuenta de Facebook' }]});
            }
            else {
              logger.info('Successfully linked Facebook account for user: ' + unifyUser.toString());
              return saveUser(res, unifyUser);
            }
          });
        }
      });
    }

    // Si ya tiene linkeada su cuenta no hacemos nada y devolvemos el token mas el usuario
    else {
      logger.info('Existing Facebook user: ' + unifyUser.toString());
      return jwt.createJWT(res, unifyUser);
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, facebookProfile, access_token) {
  User.findOne({ 'facebook.id': facebookProfile.id })
    .populate('main_circle')
    .exec(function(err, existingFacebookUser) {
    // Si encuentra a uno con el id de Facebook, es un usuario registrado con Facebook
    // pero no loggeado, generamos el token y se lo enviamos
    if (existingFacebookUser) {
      logger.info('Existing Facebook user: ' + existingFacebookUser.toString());
      return jwt.createJWT(res, existingFacebookUser);
    }
    else {
      User.findOne({ 'email': facebookProfile.email })
        .populate('main_circle')
        .exec(function(err, existingUnifyUser) {
        // Si encuentra a uno con el email de Facebook, vincula la cuenta local con la de Facebook
        if (existingUnifyUser) {
          logger.info('Existing Unify user: ' + existingUnifyUser);
          linkFacebookData(existingUnifyUser, facebookProfile, access_token);
          // Habilitamos los posibles contactos que haya creado el usuario previamente al deslinkear la cuenta
          existingUnifyUser.toggleSocialAccount('facebook', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Facebook: ' + existingUnifyUser._id);
              return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar vincular tu cuenta de Facebook' }]});
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
          logger.info('New Facebook user!: ' + user);
          linkFacebookData(user, facebookProfile, access_token);
          user.save(function(err) {
            if (err) {
              logger.error('Facebook Error saving on DB: ' + err);
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
      logger.error('Facebook Error saving on DB: ' + err);
      return res.status(400).send({ errors: [{ msg: 'Hubo un error inesperado' }] });
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