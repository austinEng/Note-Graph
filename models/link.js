var mongoose = require('mongoose');
require('mongo-relation');

var Entry = require('./entry');
var async = require('async');

var LinkSchema = new mongoose.Schema({
	src_start: Number,
	src_end: Number,
	tgt_start: Number,
	tgt_end: Number,
	content: String,
	is_taglink: Boolean,
	src: mongoose.Schema.ObjectId,
	tgt: mongoose.Schema.ObjectId,
	tag: mongoose.Schema.ObjectId
});	

LinkSchema.belongsTo('Entry', {through: 'src'});
LinkSchema.belongsTo('Entry', {through: 'tgt'});
LinkSchema.belongsTo('Tag');

LinkSchema.methods.updateIndicies = function (src_start, src_end, tgt_start, tgt_end, cb) {
	var link = this;
	this.src_start = src_start;
	this.src_end = src_end;
	this.tgt_start = tgt_start;
	this.tgt_end = tgt_end;
	this.save(function (err) {
		cb(err, link);
	});
}

LinkSchema.methods.updateContent = function (cb) {
	var link = this;
	this.save(function (err) {
		cb(err, link);
	});
}

LinkSchema.statics.linkToEntry = function (src, src_start, src_end, tgt, tgt_start, tgt_end, cb) {
	this.create({
		src: src,
		src_start: src_start,
		src_end: src_end,
		tgt: tgt,
		tgt_start: tgt_start,
		tgt_end: tgt_end,
		is_taglink: false
	}, function (err, link) {
		if(err) return cb(err);
		link.updateContent(function(err, link) {
			callback(err, link);
		});
	});
}

LinkSchema.statics.linkToTag = function (src, src_start, src_end, tag_name, cb) {
	var schema = this;
	async.parallel([
     	function(callback) {
     		schema.create({
				src: src,
				src_start: src_start,
				src_end: src_end,
				is_taglink: true
			}, function (err, link) {
				callback(err, link);
			});
      	},
     	function(callback) {
			Tag.findOrCreatePath(Tag, tag_name, function (err, tag) {
				callback(err, tag);
			});
    	}], function (err, results) {
     		if (err) return cb(err);
     		results[0].tag = results[1];
     		results[0].save(function (err) {
     			if(err) return cb(err);
				results[0].updateContent(function(err, link) {
					cb(err, link);
				});
     		});
     	}
	);
}

module.exports = mongoose.model('Link', LinkSchema);