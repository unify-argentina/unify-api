/*
 * Este módulo se encarga de manejar la autenticación del usuario vía Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var User = require('../../user/user.model');
var jwt = require('./../util/jwt');
var request = require('request');
var config = require('../../../config');
var qs = require('querystring');
var randomstring = require('randomstring');

// Constantes
var REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
var ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
var PROFILE_URL = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

// Maneja el callback
module.exports.handleCallback = function(req, res) {

  process.nextTick(function() {
    handleTokenRequest(req, res);
  });
};

// Chequea que el request tenga el oauth token y el oauth verifier, sino los tiene los pide
module.exports.linkAccount = function (req, res) {

  process.nextTick(function() {
    // Request inicial del cliente
    if (!req.body.oauth_token || !req.body.oauth_verifier) {

      // Obtenemos el request token para el popup de autorización
      request.post({ url: REQUEST_TOKEN_URL, oauth: getRequestTokenParams() }, function(err, response, body) {
        var oauthToken = qs.parse(body);

        // Enviamos el token de OAuth para abrir la pantalla de autorización en el cliente
        res.send(oauthToken);
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
  request.post({ url: ACCESS_TOKEN_URL, oauth: oauth }, function(err, response, accessToken) {

    accessToken = qs.parse(accessToken);

    // Una vez tenemos el access token, obtenemos la información del usuario a vincular
    var profileOauth = getProfileParams(accessToken.oauth_token);
    request.get({ url: PROFILE_URL + accessToken.screen_name, oauth: profileOauth, json: true },
      function(err, response, profile) {

        // Si tiene el header de authorization, ya es un usuario registrado
        if (req.headers.authorization) {
          handleAuthenticatedUser(res, req.headers.authorization.split(' ')[1], profile, accessToken.oauth_token);
        }
        // Si no tiene el header de authorization, es porque es un nuevo usuario
        else {
          handleNotAuthenticatedUser(res, profile, accessToken.oauth_token);
        }
      });
  });
};

// Maneja el caso de un autenticado con un token de Unify
var handleAuthenticatedUser = function(res, unifyToken, twitterProfile, accessToken) {
  User.findOne({ 'twitter.id': twitterProfile.id }, function (err, existingUser) {
    // Si ya existe un usuario con ese id generamos un nuevo unifyToken
    if (existingUser) {
      return res.send({ token: jwt.createJWT(existingUser) });
    }
    // Si no existe uno, buscamos el usuario de Unify autenticado para vincularle la cuenta de Twitter
    else {
      var payload = jwt.verify(unifyToken, config.TOKEN_SECRET);
      User.findById(payload.sub, function (err, user) {
        if (!user) {
          return res.status(400).send({errors: [{msg: 'User not found'}]});
        }
        else {
          linkTwitterData(user, twitterProfile, accessToken);
          return saveUser(res, user);
        }
      });
    }
  });
};

// Maneja el caso de un usuario no autenticado
var handleNotAuthenticatedUser = function(res, twitterProfile, accessToken) {
  User.findOne({ 'twitter.id': twitterProfile.id }, function(err, existingTwitterUser) {
    // Si encuentra a uno con el id de Twitter, es un usuario registrado con Twitter
    // pero no loggeado, generamos el token y se lo enviamos
    if (existingTwitterUser) {
      return res.send({token: jwt.createJWT(existingTwitterUser)});
    }
    // Si no encuentra a uno, no tenemos forma de saber el email de Twitter, ya que es algo que la API
    // no lo provee, entonces damos de alta un nuevo usuario de Unify sin email
    else {
      var user = new User();
      user.name = twitterProfile.name;
      user.email = randomstring.generate(10) + '@gmail.com';
      user.password = randomstring.generate(20);
      linkTwitterData(user, twitterProfile, accessToken);
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

// Copia los datos de Twitter en la cuenta de Unify
var linkTwitterData = function(unifyUser, twitterProfile, accessToken) {
  unifyUser.twitter.id = twitterProfile.id;
  unifyUser.twitter.accessToken = accessToken;
  unifyUser.twitter.picture = twitterProfile.profile_image_url.replace('_normal', '');
  unifyUser.twitter.displayName = twitterProfile.name;
  unifyUser.twitter.userName = twitterProfile.screen_name;
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
    token: req.query.oauth_token,
    verifier: req.query.oauth_verifier
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