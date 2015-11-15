"use strict";
var mongoose = require('mongoose');
//require('mongo-relation');
var Tag = require('./tag');
var Link = require('./link');
var Journal = require('./journal');

var EntrySchema = new mongoose.Schema( {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  journal: mongoose.Schema.ObjectId,
  tags: [mongoose.Schema.ObjectId],
  links: [mongoose.Schema.ObjectId]
});

//EntrySchema.belongsTo('Journal');
//EntrySchema.habtm('Tag');
//EntrySchema.habtm('Link');

EntrySchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});


EntrySchema.methods.tag = function (path, cb) {
  var entry = this;
  path = this.journal + "___root___/" + path;
  Tag.findOrCreatePath(Tag, path, function (err, tag) {
    tag.addEntry(entry, function (err, added) {
      if (added) {
        entry.tags.append(tag, function (err, tag) {
          cb(err, true);
        });
      } else {
        cb(err, false);
      }
    });
  });
}

EntrySchema.methods.untag = function (path, cb) {
  var entry = this;
  path = this.journal + "___root___/" + path;
  Tag.findPath(Tag, path, function (err, tag) {
    if (tag) {
      tag.removeEntry(entry, function (err, removed) {
        if (removed) {
          entry.tags.remove(tag._id, function (err, entry) {
            cb(err, true);
          });
        } else {
          cb(err, false);
        }
      });
    } else {
      cb(err, false);
    }
  });
}

module.exports = mongoose.model('Entry', EntrySchema);