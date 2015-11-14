"use strict";
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.js');

app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));

//app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: config.cookie_secret, saveUninitialized: true, resave: true}));

app.use(express.static(path.join(__dirname, '/public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
app.use('/api', require('./routes/api/api'));
app.use('/', require('./routes/router'));

mongoose.connect(process.env.MONGOLAB_URI || config.mongo_url, function(err) {
  if(!err) {
    console.log('Connected to database');
  } else {
    return;
  }

  // start server
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
});