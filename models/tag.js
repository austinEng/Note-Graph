"use strict";
var mongoose = require('mongoose');
//require('mongo-relation');
var NestedIntervalTree = require('nested-interval-tree');
var Entry = require('./entry');
var Link = require('./link');

var TagSchema = new mongoose.Schema({
	entires: [mongoose.Schema.ObjectId],
	links: [mongoose.Schema.ObjectId]
});

TagSchema.plugin(NestedIntervalTree, {
  delimiter: '/'
});

//TagSchema.habtm('Entry');
//TagSchema.hasMany('Link');

TagSchema.methods.containsEntry = function(entry, cb) {
	this.entries.find(entry._id, function (err, entries) {
		return cb(err, entries.length > 0);
	});
}

TagSchema.methods.addEntry = function (entry, cb) {
	var tag = this;
	this.containsEntry(entry, function(err, contains) {
		if (!contains) {
			tag.entries.append(entry, function (err, entry) {
				cb(err, true);
			});
		} else {
			cb(err, false);
		}
	});
}

TagSchema.methods.removeEntry = function (entry, cb) {
	var tag = this;
	this.containsEntry(entry, function (err, contains) {
		if (!contains) {
			cb(err, null);
		} else {
			tag.entries.remove(entry._id, function (err, tag) {
				cb(err, tag);
			});
		}
	});	
}

module.exports = mongoose.model('Tag', TagSchema);