"use strict"
var express = require('express');
var api = express.Router();


api.use('/user', require('./user'));
api.use('/tag', require('./tag'));

api.get('/', function(req, res, next) {
	res.send("Welcome to the API!");
});

module.exports  = api;
