/* jshint node: true */
/* global it */

var xeditor = require('../');
var xmljs   = require('libxmljs');
var gulp    = require('gulp');
require('mocha');

it('should modify text of XML element (by function)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor(function(xml) {
    xml.get('//name').text('new name');
    return xml;
  }));

  stream.on('data', function(file) {
    var xml = xmljs.parseXmlString(file.contents);
    var name = xml.get('//name').text();
    name.should.equal('new name');
    done();
  });
});


it('should modify attribute of XML element (by function)', function(done) {

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
