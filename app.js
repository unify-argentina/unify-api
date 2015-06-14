'use strict';

// requires
var express = require('express');
var mongoose = require('mongoose');

// import config
var config = require('./config/config');

// express app
var app = express();
//require('./config/express')(app);

// mongodb
mongoose.connect(config.mongodb);

// start app
var port = process.env.PORT || 8080;
app.listen(port);