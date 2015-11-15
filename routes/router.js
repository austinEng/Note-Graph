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
  console.log(req);
  res.render('index', {
  	journal_titles: req.user.journal_titles
  });
});

require('./account')(router);