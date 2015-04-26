'use strict';

var fs = require('fs');

var glob = require('glob');
var gulp = require('gulp');
var push = require('couch-push');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');

var argv = require('yargs').argv;
var config = require('./config.json');
var couch_url;
if (argv.url) {
  couch_url = argv.url;
} else if (config.env && config.env['default'] && config.env['default'].db) {
  couch_url = config.env['default'].db;
} else {
  // TODO: make this hault
  console.log('You must supply the URL to your CouchDB instance (via --url or config.json');
}

gulp.task('docs', function() {
  glob('_docs/*', function(err, matches) {
    if (err) throw err;

    matches.forEach(function(doc) {
      push(couch_url, doc,
        function(err, resp) {
          if (err) {
            console.log(doc);
            console.log(JSON.stringify(resp));
            throw err.reason;
          }
        });
    });
  });
});

gulp.task('apps', function() {
  glob('_design/*', function(err, matches) {
    if (err) throw err.reason;
    matches.forEach(function(ddoc) {
      push(couch_url, ddoc,
        function(err, resp) {
          if (err) {
            console.log('_id: ' + ddoc._id);
            throw err.reason;
          }
          console.log(resp);
        });
    });
  });
});

gulp.task('default', function() {
  runSequence(['apps', 'docs']);
});
