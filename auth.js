"use strict"
var flash = require('connect-flash');
var User = require('./models/user')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
  },
  function (req, email, password, done) {
    if (!req.body.email) return done(null, false, req.flash('error', 'Email is required'));
    if (!req.body.password) return done(null, false, req.flash('error', 'Password is required'));
    if (!validateEmail(req.body.email)) return done(null, false, req.flash('error', 'Email is invalid'));
    User.findOne({ 'email' :  email },
      function(err, user) {
        if (err)
          return done(err);
        if (!user){
          console.log('User Not Found with email ' + email);
          return done(null, false,
                req.flash('error', 'Invalid email or password'));
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            return done(null, user);
          } else {
            console.log('Invalid Password');
            return done(null, false,
                req.flash('error', 'Invalid email or password'));
          }
        });
      }
    );
  }
));

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
  },
  function (req, email, password, done) {
    if (!req.body.name) return done(null, false, req.flash('error', 'Name is required'));
    if (!req.body.email) return done(null, false, req.flash('error', 'Email is required'));
    if (!validateEmail(req.body.email)) return done(null, false, req.flash('error', 'Email is invalid'));
    if (!req.body.password) return done(null, false, req.flash('error', 'Password is required'));
    if (req.body.password != req.body.password_confirmation) return done(null, false, req.flash('error', 'Passwords don\'t match'));
    var findOrCreateUser = function () {
      User.findOne({'email': email}, function (err, user) {
        if (err) {
          console.log('Error in registration: ' + err);
          return done(err);
        }
        if (user) {
          console.log('User already exists');
          return done(null, false,
             req.flash('error', 'User already exists'));
        } else {
          var newUser = new User({
            email: email,
            password: password,
            name: req.body.name
          });

          newUser.save(function (err) {
            if (err) {
              console.log('Error saving user:' + err);
              req.flash('error', 'Couldn\'t save user');
            }
            return done(null, newUser);
          });
        }
      });
    }
    process.nextTick(findOrCreateUser);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

module.exports = passport;