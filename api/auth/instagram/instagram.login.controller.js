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
var logger = require('../../../config/logger');
var instagramErrors = require('./instagram.errors');

// modelos
var User = require('../../user/user.model');

// constantes
var ACCESS_TOKEN_URL = 'https://api.instagram.com/oauth/access_token';

// Desconecta la cuenta de Instagram de la de Unify
module.exports.unlinkAccount = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user }, User.socialFields(), function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }]});
      }
      // Si el usuario no tiene email ni tiene la cuenta de twitter linkeada, no puede deslinkear instagram
      // ya que no vamos a tener forma de identificarlo después
      else if (!user.isValidToRemoveAccount('instagram')) {
        logger.warn('Cannot unlink Instagram for user: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'Cannot unlink Instagram' }]});
      }
      else {
        user.toggleSocialAccount('instagram', false, function(err) {
          if (err) {
            logger.warn('There was an error trying to unlink Instagram: ' + req.user);
            return res.status(400).send({ errors: [{ msg: 'There was an error trying to unlink Instagram' }]});
          }
          else {
            logger.info('Successfully unlinked Instagram account for user: ' + user.toString());
            return saveUser(res, user);
          }
        });
      }
    });
  });
};

// Maneja la lógica principal del login con Instagram
module.exports.linkAccount = function(req, res) {

  process.nextTick(function() {

    var qs = getAccessTokenParams(req);
    logger.info('Access token params: ' + JSON.stringify(qs));

    // Intercambiamos el código de autorización para obtener el access token
    request.post({ url: ACCESS_TOKEN_URL, form: qs, json: true }, function(err, response, body) {

      var oauthError = instagramErrors.hasError(err, response);
      if (oauthError.hasError) {
        logger.error('Instagram oauth error: ' + JSON.stringify(oauthError.error));
        return res.status(response.statusCode).send({ errors: [ oauthError.error ] });
      }

      logger.info('Access token: ' + JSON.stringify(body.access_token));
      logger.info('Instagram profile: ' + JSON.stringify(body.user));

      // Si tiene el header de authorization, ya es un usuario registrado
      if (req.headers.authorization) {
        logger.info('Authenticated user');
        handleAuthenticatedUser(res, jwt.getUnifyToken(req), body.user, body.access_token);
      }
      // Si no tiene el header de authorization, es porque es un nuevo usuario
      else {
        logger.info('Not authenticated user');
        handleNotAuthenticatedUser(res, body.user, body.access_token);
      }
    });
  });
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, instagramProfile, access_token) {
  User.findOne({ 'instagram.id': instagramProfile.id })
    .populate('main_circle')
    .exec(function(err, existingUser) {
    // Si ya existe un usuario con ese id generamos un nuevo unifyToken
    if (existingUser) {
      logger.info('Existing instagram user: ' + existingUser.toString());
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
      User.findOne({ _id: payload.sub })
        .populate('main_circle')
        .exec(function(err, user) {
        if (err || !user) {
          logger.warn('User not found: ' + payload.sub);
          return res.status(400).send({ errors: [{ msg: 'User not found' }] });
        }
        // Si existe un usuario de Unify, vinculamos su cuenta con la de Instagram
        else {
          logger.info('Existing unify user: ' + user.toString());
          linkInstagramData(user, instagramProfile, access_token);
          // Habilitamos los posibles contactos que haya creado el usuario previamente al deslinkear la cuenta
          user.toggleSocialAccount('instagram', true, function(err) {
            if (err) {
              logger.warn('There was an error trying to link Instagram: ' + user._id);
              return res.status(400).send({ errors: [{ msg: 'There was an error trying to link Instagram' }]});
            }
            else {
              logger.info('Successfully linked Instagram account for user: ' + user.toString());
              return saveUser(res, user);
            }
          });
        }
      });
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, instagramProfile, access_token) {
  // Si encuentra a uno con el id de Instagram, es un usuario registrado con Twitter
  // pero no loggeado, generamos el token y se lo enviamos
  User.findOne({ 'instagram.id': instagramProfile.id })
    .populate('main_circle')
    .exec(function(err, existingInstagramUser) {
    if (existingInstagramUser) {
      logger.info('Existing instagram user: ' + existingInstagramUser.toString());
      return jwt.createJWT(res, existingInstagramUser);
    }
    // Si no encuentra a uno, no tenemos forma de saber el email de Instagram, ya que es algo que la API
    // no lo provee, entonces damos de alta un nuevo usuario de Unify sin email
    else {
      // No le ponemos email para que si llegara a vincular la cuenta con facebook o gmail, use ese email.
      var user = new User();
      user.name = instagramProfile.full_name;
      user.password = randomstring.generate(20);
      logger.info('New instagram user!: ' + user);
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
  unifyUser.instagram.username = instagramProfile.username;
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