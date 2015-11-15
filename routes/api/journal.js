"use strict"
var express = require('express');
var router = express.Router();

router.get('/:journal_id', function(req, res, next) {

});

router.post('/create', function(req, res, next) {

});

router.delete('/:journal_id/destroy', function(req, res, next) {

});

router.put('/:journal_id/update', function(req, res, next) {

});

router.put('/:journal_id/entry/:entry_id/add', function(req, res, next) {

});

router.put('/:journal_id/entry/:entry_id/remove', function(req, res, next) {

});

router.put('/:journal_id/tag/:tag_id/add/entry/:entry_id', function(req, res, next) {

});

router.put('/:journal_id/tag/:tag_id/remove/entry/:entry_id', function(req, res, next) {

});

router.search('/:journal_id/tag', function(req, res, next) {

});

module.exports  = router;