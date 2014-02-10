/* jshint node: true */
/* global it */

var xeditor = require('../');
var xmljs   = require('libxmljs');
var gulp    = require('gulp');
var gutil   = require('gulp-util');
var fs      = require('fs');
var should  = require('should');
require('mocha');

it('should raise error when missing option', function(done) {
  should(function(){xeditor();}).throw('missing "editor function" option');
  done();
});


it('should raise error when invalid type of option', function(done) {
  should(function(){xeditor(1);}).throw('"editor function" option must be function');
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


it('should modify text of XML element', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor(function(xml) {
    xml.get('//key[./text()="Name"]').nextElement().text('new test');
    return xml;
  }));

  stream.on('data', function(file) {
    var xml = xmljs.parseXmlString(file.contents);
    var name = xml.get('//key[./text()="Name"]').nextElement().text();
    name.should.equal('new test');
    done();
  });
});


it('should modify attribute of XML element', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor(function(xml) {
    xml.get('//version').attr({'minor': '2'});
    return xml;
  }));

  stream.on('data', function(file) {
    var xml = xmljs.parseXmlString(file.contents);
    var version = xml.get('//version').attr('minor');
    version.value().should.equal('2');
    done();
  });
});
