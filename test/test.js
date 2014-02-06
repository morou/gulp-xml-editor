/* jshint node: true */
/* global describe, it */

var xeditor = require('../');
var xmljs   = require('libxmljs');
var gulp    = require("gulp");
require('should');
require('mocha');

describe('gulp-xml-editor', function() {
  describe('#xml()', function() {

    //
    // test: raise error when missing option
    //
    it('should raise error when missing option', function(done) {
      (function() {
        var stream = gulp.src('test/test.xml').pipe(xeditor());
        stream.on('error', done);
        stream.on('data', done);
      }).should.throw('missing "editor function" option');
      done();
    });

    //
    // test: raise error when invalid type of option
    //
    it('should raise error when invalid type of option', function(done) {
      (function() {
        var stream = gulp.src('test/test.xml').pipe(xeditor(100));
        stream.on('error', done);
        stream.on('data', done);
      }).should.throw('"editor function" option must be function');
      done();
    });

    //
    // test: modify text
    //
    it('should modify text of XML element', function(done) {
      var stream = gulp.src('test/test.xml').pipe(xeditor(function(xml) {
        xml.get('//key[./text()="Name"]').nextElement().text('new test');
        return xml;
      }));
      stream.on('error', done);
      stream.on('data', function(file) {
        var xml = xmljs.parseXmlString(file.contents);
        var name = xml.get('//key[./text()="Name"]').nextElement().text();
        name.should.equal('new test');
      });
      stream.on('end', done);
    });

    //
    // test: modify attribute
    //
    it('should modify attribute of XML element', function(done) {
      var stream = gulp.src('test/test.xml').pipe(xeditor(function(xml) {
        xml.get('//version').attr({'minor': '2'});
        return xml;
      }));
      stream.on('error', done);
      stream.on('data', function(file) {
        var xml = xmljs.parseXmlString(file.contents);
        var version = xml.get('//version').attr('minor');
        version.value().should.equal('2');
      });
      stream.on('end', done);
    });

  });
});
