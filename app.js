"use strict";
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var jwt = require('jsonwebtoken');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var lessMiddleware = require('less-middleware');
var async = require('async');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('port', process.env.PORT || 3000);

var config = require('./config.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: config.cookie_secret, saveUninitialized: true, resave: true}));
app.use(lessMiddleware(path.join(__dirname, 'source', 'less'), {
  dest: path.join(__dirname, 'public'),
  preprocess: {
    path: function(pathname, req) {
      return pathname.replace(path.sep + 'stylesheets' + path.sep, path.sep);
    }
  }
}));
app.use(express.static(path.join(__dirname, '/public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
app.use('/api', require('./routes/api/router'));
app.use('/', require('./routes/router'));


mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/notetaker', function(err) {
  if(!err) {
    console.log('Connected to database');
  } else {
    return;
  }

  //404 page
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // handle errors
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.message);
        console.log(err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
  }
  else {
    process.on('uncaughtException', function (err) {
        console.log('Caught exception: ' + err);
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
  }

  if (app.get('env') === 'development') {
    var User = require('./models/user');
    var Journal = require('./models/journal');
    
    async.parallel([
      function(callback) {
        User.remove({}, function(err) {
          callback(err);
        });
      },
      function(callback) {
        Journal.remove({}, function(err) {
          callback(err);
        });
      }
    ], function (err, results) {

        async.parallel([
          function(callback) {
            User.create({
              email: 'test@example.com',
              name: 'test',
              password: 'pass'
            }, function (err, user) {
              callback(err, user);
            });          
          },
          function(callback) {
            Journal.create({
              title: 'Test Journal 1'
            }, function (err, journal) {
              callback(err, journal);
            });  
          },
          function(callback) {
            Journal.create({
              title: 'Test Journal 2'
            }, function (err, journal) {
              callback(err, journal);
            });  
          },
          function(callback) {
            Journal.create({
              title: 'Test Journal 3'
            }, function (err, journal) {
              callback(err, journal);
            });  
          }
        ], function (err, results) {
          results[0].addJournal(results[1]);
          results[0].addJournal(results[2]);
          results[0].addJournal(results[3]);
          results[0].save(function (err) {
            console.log(results[0]);
          });
        });

    });
  }

  // start server
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
});