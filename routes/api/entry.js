"use strict"
var express = require('express');
var router = express.Router();

router.get('/:entry_id', function(req, res, next) {

});

router.post('/create', function(req, res, next) {

});

router.delete('/:entry_id/destroy', function(req, res, next) {

});

router.put('/:entry_id/update', function(req, res, next) {

});

router.post('/:entry_id/tag/create', function(req, res, next) {

});

router.put('/:entry_id/tag/:tag_id/update', function(req, res, next) {

});

router.delete('/:entry_id/tag/:tag_id/destroy', function(req, res, next) {

});

router.post('/:entry_id/link/create/:tgt_id', function(req, res, next) {

});

module.exports  = router;