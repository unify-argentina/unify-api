/*
 * Este módulo es un helper para devolver los parámetros de OAuth para
 * hacer un request a Twitter
 * @author Joel Márquez
 * */
'use strict';

// requires
var config = require('../../../config');

// Devuelve un objeto para obtener el oauth token
module.exports.getRequestTokenParams = function() {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    callback: config.TWITTER_CALLBACK
  };
};

// Devuelve un objeto para obtener el access token
module.exports.getAccessTokenParams = function(req) {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    token: req.query.oauth_token || req.body.oauth_token,
    verifier: req.query.oauth_verifier || req.body.oauth_verifier
  };
};

// Devuelve un objeto para obtener información del perfil del usuario de Twitter
module.exports.getProfileParams = function(oauthToken) {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    oauth_token: oauthToken
  };
};

// Devuelve el objeto OAuth necesario para hacer pedidos autenticados a la API de Twitter
module.exports.getOauthParam = function(access_token) {
  return {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    token: access_token.token,
    token_secret: access_token.token_secret
  };
};

// Devuelve el formato de fecha de Twitter
module.exports.getDateFormat = function() {
  return 'dd MMM DD HH:mm:ss ZZ YYYY';
};

// Devuelve la versión actual soportada de la API de Twitter
module.exports.getVersion = function() {
  return '1.1';
};

// Devuelve la URL Base de la API de Twitter
module.exports.getAPIBaseURL = function() {
  return 'https://api.twitter.com';
};

// Devuelve la URL principal de Twitter
module.exports.getTwitterURL = function() {
  return 'https://www.twitter.com/';
};

// Devuelve la URL Base de la API de Twitter
module.exports.getBaseURL = function() {
  return this.getAPIBaseURL() + '/' + this.getVersion();
};

// Devuelve la URL Base de la API para subir videos de Twitter
module.exports.getBasePublishMediaURL = function() {
  return 'https://upload.twitter.com/' + this.getVersion();
};

// Devuelve la URL para obtener el request token de Twitter
module.exports.getRequestTokenURL = function() {
  return this.getAPIBaseURL() + '/oauth/request_token';
};

// Devuelve la URL para obtener el access token de Twitter
module.exports.getAccessTokenURL = function() {
  return this.getAPIBaseURL() + '/oauth/access_token';
};

// Devuelve la URL para obtener el perfil del usuario de Twitter
module.exports.getProfileURL = function() {
  return this.getBaseURL() + '/users/show.json';
};

// Devuelve la URL para obtener los seguidores de Twitter
module.exports.getUserFollowsURL = function() {
  return this.getBaseURL() + '/friends/list.json';
};

// Devuelve la URL para marcar un Tweet favorito de Twitter
module.exports.getUserFavURL = function() {
  return this.getBaseURL() + '/favorites/create.json';
};

// Devuelve la URL para desmarcar un Tweet favorito de Twitter
module.exports.getUserUnfavURL = function() {
  return this.getBaseURL() + '/favorites/destroy.json';
};

// Devuelve la URL para obtener contenido de Twitter
module.exports.getUserMediaURL = function() {
  return this.getBaseURL() + '/statuses/user_timeline.json';
};

// Devuelve la URL para buscar contenido de Twitter
module.exports.getSearchURL = function() {
  return this.getBaseURL() + '/search/tweets.json';
};

// Devuelve la URL para publicar contenido de Twitter
module.exports.getUserPublishContentURL = function() {
  return this.getBaseURL() + '/statuses/update.json';
};

// Devuelve la URL para subir contenido de Twitter
module.exports.getUserUploadMediaURL = function() {
  return this.getBasePublishMediaURL() + '/media/upload.json';
};

// Devuelve la URL de los estados de Twitter
module.exports.getTwitterStatusURL = function() {
  return this.getTwitterURL() + 'statuses/';
};

module.exports.mapMedia = function(tweet, callback) {

  // Si es un retweet, tenemos que agarrar el texto original del tweet porque puede llegar a truncarse
  var text = '';
  if (tweet.retweeted_status) {
    var retweet = tweet.retweeted_status;
    text = 'RT @' + retweet.user.screen_name + ': ' + retweet.text;
  }
  else {
    text = tweet.text;
  }

  var mappedMedia = {
    provider: 'twitter',
    id: tweet.id_str || '',
    created_time: moment(tweet.created_at, twitterUtils.getDateFormat(), 'en').unix() || '',
    link: twitterUtils.getTwitterStatusURL() + tweet.id_str || '',
    likes: tweet.favorite_count,
    text: text,
    user_has_liked: tweet.favorited
  };

  if (tweet.extended_entities) {
    mapTweetMedia(mappedMedia, tweet.extended_entities.media[0]);
  }
  else {
    mappedMedia.type = 'text';
  }

  callback(null, mappedMedia);
};

// Mapea o una imagen o un video de Twitter al formato unificado
var mapTweetMedia = function(mappedMedia, tweetMedia) {

  var type = tweetMedia.type;
  if (type === 'video') {
    mapTweetVideo(mappedMedia, tweetMedia.video_info.variants);
  }
  else {
    mappedMedia.media_url = tweetMedia.media_url;
  }
  mappedMedia.type = type;
};

// Mapea un video de Twitter
var mapTweetVideo = function(mappedMedia, videoInfoArray) {

  videoInfoArray.forEach(function(videoInfo) {
    if (videoInfo.content_type === 'video/mp4') {
      mappedMedia.media_url = videoInfo.url;
    }
  });
};