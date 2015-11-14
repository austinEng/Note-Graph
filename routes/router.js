"use strict"
var express = require('express');
var router = express.Router();

module.exports = router;

router.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

router.get('/', router.isAuthenticated, function (req, res) {
  res.render('index', {
  	
  });
});

require('./account')(router);