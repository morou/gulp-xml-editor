/* jshint node: true */
/* global it */

var xeditor = require('../');
var gulp    = require('gulp');
var gutil   = require('gulp-util');
var fs      = require('fs');
var should  = require('should');
require('mocha');

it('should raise error when missing option', function(done) {
  should(function(){xeditor();}).throw('missing "editor" option');
  done();
});


it('should raise error when invalid type of option', function(done) {
  should(function(){xeditor(1);}).throw('"editor" option must be a function or array');
  done();
});


it('should do path-through when input is null', function(done) {
  xeditor(function(){})
    .on('data',  function(file) {
      should(file.contents).eql(null);
      done();
    })
    .write(new gutil.File({}));
});


it('should raise error when streaming input', function(done) {
  xeditor(function(){})
    .on('error', function(err) {
      err.message.should.equal('Streaming is not supported');
      done();
    })
    .write(new gutil.File({
      contents: fs.createReadStream('test/test.xml')
    }));
});


it('should raise error when invalid xpath (no such path)', function(done) {
  gulp.src('test/test.xml').pipe(xeditor([
    {path: '//invalid', text: ''}
  ])).on('error', function(err) {
    err.message.should.equal('Can\'t find element at "//invalid"');
    done();
  });
});


it('should raise error when invalid xpath (not path to elemnt)', function(done) {
  gulp.src('test/test.xml').pipe(xeditor([
    {path: '//version/@major', text: ''}
  ])).on('error', function(err) {
    err.message.should.equal('Can\'t find element at "//version/@major"');
    done();
  });
});
