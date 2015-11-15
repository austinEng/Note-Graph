"use strict";
var mongoose = require('mongoose');
//require('mongo-relation');
var User = require('./user');
var Entry = require('./entry');
var Tag = require('./tag');

var JournalSchema = new mongoose.Schema( {
  title: {
    type: String,
    required: true
  },
  user: mongoose.Schema.ObjectId,
  entries: [mongoose.Schema.ObjectId],
  rootTag: mongoose.Schema.ObjectId
});

//JournalSchema.hasMany('Entry', {dependent: 'delete'});
//JournalSchema.belongsTo('User');
//JournalSchema.belongsTo('Tag', {through: 'rootTag'});

JournalSchema.pre('save', function (next) {
	var journal = this;
	if (this.isNew) {
		Tag.initialize(Tag, function(err, root) {
			root.name = journal.id + "___root___";
			root.save(function (err) {
				next();
			});
		});
	} else {
		next();
	}
});

JournalSchema.methods.containsEntry = function(entry, cb) {
	this.entries.find(entry._id, function (err, entries) {
		return cb(err, entries.length > 0);
	});
};

JournalSchema.methods.addEntry = function (entry, cb) {
	var journal = this;
	this.containsEntry(entry, function (err, contains) {
		if (!contains) {
			journal.entries.append(entry, function(err, entry) {
				cb(err, true);
			});
		} else {
			cb(err, false);
		}
	});
};

JournalSchema.methods.removeEntry = function (entry, cb) {
	var journal = this;
	this.containsEntry(entry, function (err, contains) {
		if (!contains) {
			cb(err, false);
		} else {
			journal.entries.remove(entry._id, function (err, journal) {
				cb(err, true);
			});
		}
	});	
};

JournalSchema.methods.search = function (query, method, cb) {
	query = this.id + "___root___/" + query;
	if (method == "exact") {
		var tags = [];
		Tag.findPath(Tag, query, function (err, tag) {
			tags.push(tag);
			cb(err, tags);
		});
	} else if (method == "related") {
		Tag.findPath(Tag, query, function (err, tag) {
			cb(err, tag, last, remaining);
			if (!tag) {
				tag = last;
			}
			var tags = [];
			tag.descendants(function (res) {
				tags = tags.concat(res);
				cb(err, tags);
			});
		});
	} else {	
		cb(err, []);
	}
};

module.exports = mongoose.model('Journal', JournalSchema);