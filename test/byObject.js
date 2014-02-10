/* jshint node: true */
/* global it */

var xeditor = require('../');
var xmljs   = require('libxmljs');
var gulp    = require('gulp');
require('mocha');

it('should modify text of XML element (by object)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor([
    {path: '//name', text: 'new name'}
  ]));

  stream.on('data', function(file) {
    var xml = xmljs.parseXmlString(file.contents);
    var name = xml.get('//name').text();
    name.should.equal('new name');
    done();
  });
});


it('should modify single attribute of XML element (by object)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor([
    {path: '//version', attr: {major: 10}}
  ]));

  stream.on('data', function(file) {
    var xml = xmljs.parseXmlString(file.contents);
    var version = xml.get('//version').attr('major');
    version.value().should.equal('10');
    done();
  });
});


it('should modify multi attributes of XML element (by object)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor([
    {path: '//version', attrs: [
      {major: 10},
      {minor: 11}
    ]}
  ]));

  stream.on('data', function(file) {
    var xml = xmljs.parseXmlString(file.contents);
    var major = xml.get('//version').attr('major');
    var minor = xml.get('//version').attr('minor');
    major.value().should.equal('10');
    minor.value().should.equal('11');
    done();
  });
});
