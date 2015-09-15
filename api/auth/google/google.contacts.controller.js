/*
 * Este módulo se encarga de manejar los contactos de Google del usuario
 * @author Joel Márquez
 * */
'use strict';

// requires
var util = require('util');
var request = require('request');
var async = require('async');
var _ = require('lodash');
var logger = require('../../../config/logger');
var googleErrors = require('./google.errors');
var googleAuth = require('./google.auth.helper');

// Devuelve los amigos de Google del usuario loggeado
module.exports.getContacts = function(refresh_token, googleId, callback) {

  var url = 'https://www.google.com/m8/feeds/contacts/default/full?alt=json&max-results=10000';

  // Aquí iremos almacenando los usuarios que nos devuelva el servicio paginado de Google
  var contacts = [];

  googleAuth.getAccessToken(refresh_token, function(err, access_token) {

    if (err) {
      callback(null, err);
    }
    else {
      getGoogleData(url, access_token, contacts, function(err, googleContacts) {

        if (err) {
          callback(null, err);
        }
        else {
          // Filtramos los usuarios que no tengan email
          async.filter(googleContacts, filter, function(emailContacts) {

            // Mapeamos los usuarios para que sean homogéneos a las 4 cuentas
            async.map(emailContacts, mapContact, function(err, mappedUsers) {

              var result = {
                list: mappedUsers,
                count: mappedUsers.length
              };
              logger.debug('Google Contacts: ' + JSON.stringify(result));
              callback(null, result);
            });
          });
        }
      });
    }
  });
};

// Le pega a la API de Google y en el response, si fue exitoso, van a estar los contactos del usuario
// forma paginada, por lo que será recursiva hasta que ya no haya paginado
var getGoogleData = function(url, access_token, contacts, callback) {

  logger.info('URL: ' + url);

  var headers = { Authorization: 'Bearer ' + access_token };

  request.get({ url: url, headers: headers, json: true }, function(err, response) {

    var result = googleErrors.hasError(err, response);
    if (result.hasError) {
      callback(result.error, null);
    }
    else if (response.body.feed.entry.length === 0) {
      callback(null, contacts);
    }
    // Ya tengo los contactos y los devuelvo en el callback
    else {
      contacts.push.apply(contacts, response.body.feed.entry);
      callback(null, contacts);
    }
  });
};

// Esta función filtra aquellos contactos que tengan un email y un nombre válido
var filter = function(googleContact, callback) {
  callback(googleContact.gd$email !== undefined && googleContact.gd$email.length > 0 &&
    googleContact.title.$t !== '');
};

// Recibe un objeto de contacto de Google y devuelve uno homogéneo a las 3 redes sociales
var mapContact = function(googleContact, callback) {
  var contact = {
    id: googleContact.id.$t,
    name: googleContact.title.$t,
    email: googleContact.gd$email[0].address
  };
  callback(null, contact);
};