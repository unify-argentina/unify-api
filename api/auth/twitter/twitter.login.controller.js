/*
 * Este módulo se encarga de manejar la autenticación del usuario vía Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var jwt = require('./../util/jwt');
var request = require('request');
var config = require('../../../config');
var qs = require('querystring');
var randomstring = require('randomstring');
var logger = require('../../../config/logger');
var twitterErrors = require('./twitter.errors');

// modelos
var User = require('../../user/user.model');

// constantes
var REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
var ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
var PROFILE_URL = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

// Desconecta la cuenta de Twitter de la de Unify
module.exports.unlinkAccount = function(req, res) {

  process.nextTick(function() {
    User.findOne({ _id: req.user }, User.socialFields())
      .populate('main_circle')
      .exec(function(err, user) {
      if (err || !user) {
        logger.warn('User not found: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'User not found' }]});
      }
      // Si el usuario no tiene email ni tiene la cuenta de instagram linkeada, no puede deslinkear twitter
      // ya que no vamos a tener forma de identificarlo después
      else if (!user.isValidToRemoveAccount('twitter')) {
        logger.warn('Cannot unlink Twitter for user: ' + req.user);
        return res.status(400).send({ errors: [{ msg: 'Cannot unlink Twitter' }]});
      }
      else {
        user.toggleSocialAccount('twitter', false, function(err) {
          if (err) {
            logger.warn('There was an error trying to unlink Twitter: ' + req.user);
            return res.status(400).send({ errors: [{ msg: 'There was an error trying to unlink Twitter' }]});
          }
          else {
            logger.info('Successfully unlinked Twitter account for user: ' + user.toString());
            return saveUser(res, user);
          }
        });
      }
    });
  });
};

// Maneja el callback
module.exports.handleCallback = function(req, res) {

  process.nextTick(function() {
    handleTokenRequest(req, res);
  });
};

// Chequea que el request tenga el oauth token y el oauth verifier, sino los tiene los pide
module.exports.linkAccount = function(req, res) {

  process.nextTick(function() {
    // Request inicial del cliente
    if (!req.body.oauth_token || !req.body.oauth_verifier) {

      logger.info('Requesting oauth_token and oauth_verifier');
      // Obtenemos el request token para el popup de autorización
      request.post({ url: REQUEST_TOKEN_URL, oauth: getRequestTokenParams() }, function(err, response, body) {
        var oauthToken = qs.parse(body);

        logger.info('Twitter oauth_token: ' + JSON.stringify(oauthToken));
        // Enviamos el token de OAuth para abrir la pantalla de autorización en el cliente
        return res.send(oauthToken);
      });
    }
    else {
      handleTokenRequest(req, res);
    }
  });
};

// Maneja la lógica principal del login con Twitter
var handleTokenRequest = function(req, res) {
  // Intercambiamos el oauth token y el oauth verifier para obtener el access token
  var oauth = getAccessTokenParams(req);
  logger.info('Access token params: ' + JSON.stringify(oauth));

  request.post({ url: ACCESS_TOKEN_URL, oauth: oauth }, function(err, response, access_token) {

    var oauthError = twitterErrors.hasError(err, response);
    if (oauthError.hasError) {
      logger.error('Twitter oauth error: ' + JSON.stringify(oauthError.error));
      return res.status(response.statusCode).send({ errors: [ oauthError.error ] });
    }

    access_token = qs.parse(access_token);
    logger.info('Access token: ' + JSON.stringify(access_token));

    // Una vez tenemos el access token, obtenemos la información del usuario a vincular
    var profileOauth = getProfileParams(access_token.oauth_token);

    request.get({ url: PROFILE_URL + access_token.screen_name, oauth: profileOauth, json: true }, function(err, response, profile) {

      var profileError = twitterErrors.hasError(err, response);
      if (profileError.hasError) {
        logger.error('Twitter profile error ' + JSON.stringify(profileError));
        return res.status(response.statusCode).send({ errors: [ profileError.error ] });
      }

      logger.info('Twitter profile: ' + JSON.stringify(profile));

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
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, twitterProfile, access_token) {

  // Primero verificamos el Unify token
  var payload = null;
  try {
    payload = jwt.verify(unifyToken);
  }
  catch (err) {
    return res.status(401).send({ errors: [{ msg: 'Error verifying json web token' }] });
  }

  // En caso de que exista ese usuario, nos fijamos si el id de Twitter ya está asociado con otra cuenta
  User.findOne({ _id: payload.sub}, User.socialFields())
    .populate('main_circle')
    .exec(function(err, unifyUser) {

      if (err || !unifyUser) {
        logger.warn('User not found: ' + payload.sub);
        return res.status(400).send({ errors: [{ msg: 'User not found' }] });
      }

      // Si existe un usuario de Unify, nos fijamos si no tiene su cuenta asociada con Twitter
      else if (!unifyUser.hasLinkedAccount('twitter')) {

        // Y si no la tiene, nos fijamos que no haya otro usuario en Unify con ese Twitter id
        User.findOne({ 'twitter.id': twitterProfile.id })
          .populate('main_circle')
          .exec(function(err, existingUser) {

            // Si ya existe un usuario con ese id devolvemos error ya que no queremos desvincular la cuenta ya vinculada de ese usuario
            if (existingUser) {
              logger.warn('User with Twitter social account already exists: ' + existingUser.toString());
              return res.status(400).send({ errors: [{ msg: "Can't disassociate Twitter account for existing user" }] });
            }

            // Si no existe un usuario de Unify con ese Twitter id entonces le asociamos la cuenta al usuario
            else {

              logger.info('Existing unify user: ' + unifyUser.toString());
              linkTwitterData(unifyUser, twitterProfile, access_token);
              // Habilitamos los posibles contactos que haya creado el usuario previamente al deslinkear la cuenta
              unifyUser.toggleSocialAccount('twitter', true, function(err) {
                if (err) {
                  logger.warn('There was an error trying to link Twitter: ' + unifyUser._id);
                  return res.status(400).send({ errors: [{ msg: 'There was an error trying to link Twitter' }]});
                }
                else {
                  logger.info('Successfully linked Twitter account for user: ' + unifyUser.toString());
                  return saveUser(res, unifyUser);
                }
              });
            }
          });
      }

      // Si ya tiene linkeada su cuenta no hacemos nada y devolvemos el token mas el usuario
      else {
        logger.info('Existing Twitter user: ' + unifyUser.toString());
        return jwt.createJWT(res, unifyUser);
      }
    });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, twitterProfile, access_token) {
  User.findOne({ 'twitter.id': twitterProfile.id })
    .populate('main_circle')
    .exec(function(err, existingTwitterUser) {
    // Si encuentra a uno con el id de Twitter, es un usuario registrado con Twitter
    // pero no loggeado, generamos el token y se lo enviamos
    if (existingTwitterUser) {
      logger.info('Existing twitter user: ' + existingTwitterUser.toString());
      return jwt.createJWT(res, existingTwitterUser);
    }
    // Si no encuentra a uno, no tenemos forma de saber el email de Twitter, ya que es algo que la API
    // no lo provee, entonces damos de alta un nuevo usuario de Unify sin email
    else {
      // No le ponemos email para que si llegara a vincular la cuenta con facebook o gmail, use ese email.
      var user = new User();
      user.name = twitterProfile.name;
      user.password = randomstring.generate(20);
      logger.info('New twitter user!: ' + user);
      linkTwitterData(user, twitterProfile, access_token);
      return saveUser(res, user);
    }
  });
};

// Salva el usuario en la base de datos y devuelve un Json Web Token si todo salió bien
var saveUser = function(res, user) {
  user.save(function(err) {
    if (err) {
      logger.error('Twitter Error saving on DB: ' + err);
      return res.status(400).send({ errors: [{ msg: 'Error saving on DB: ' + err }] });
    }
    else {
      user.password = undefined;
      return jwt.createJWT(res, user);
    }
  });
};

// Copia los datos de Twitter en la cuenta de Unify
var linkTwitterData = function(unifyUser, twitterProfile, access_token) {
  unifyUser.twitter.id = twitterProfile.id;
  unifyUser.twitter.access_token.token = access_token.oauth_token;
  unifyUser.twitter.access_token.token_secret = access_token.oauth_token_secret;
  unifyUser.twitter.picture = twitterProfile.profile_image_url.replace('_normal', '_bigger');
  unifyUser.twitter.display_name = twitterProfile.name;
  unifyUser.twitter.username = twitterProfile.screen_name;
};

// Devuelve un objeto para obtener el oauth token
var getRequestTokenParams = function() {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    callback: config.TWITTER_CALLBACK
  };
};

// Devuelve un objeto para obtener el access token
var getAccessTokenParams = function(req) {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    token: req.query.oauth_token || req.body.oauth_token,
    verifier: req.query.oauth_verifier || req.body.oauth_verifier
  };
};

// Devuelve un objeto para obtener información del perfil del usuario de Twitter
var getProfileParams = function(oauthToken) {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    oauth_token: oauthToken
  };
};