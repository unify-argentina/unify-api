'use strict';

module.exports = function (app) {

  //Main route
  app.use('/api', require('./api'));
};