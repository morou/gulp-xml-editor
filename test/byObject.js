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
    var expected = xmljs.parseXmlString(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<root>\n' +
      '  <name>new name</name>\n' +
      '  <version major="1" minor="0"></version>\n' +
      '</root>'
    );
    xmljs.parseXmlString(file.contents).toString().should.eql(expected.toString());
    done();
  });
});


it('should modify attribute of XML element (by object)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor([
    {path: '//version', attr: {major: 10}}
  ]));

  stream.on('data', function(file) {
    var expected = xmljs.parseXmlString(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<root>\n' +
      '  <name>this is name</name>\n' +
      '  <version major="10" minor="0"></version>\n' +
      '</root>'
    );
    xmljs.parseXmlString(file.contents).toString().should.eql(expected.toString());
    done();
  });
});


it('should add attribute of XML element (by object)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor([
    {path: '//version', attr: {build: 20}}
  ]));

  stream.on('data', function(file) {
    var expected = xmljs.parseXmlString(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<root>\n' +
      '  <name>this is name</name>\n' +
      '  <version major="1" minor="0" build="20"></version>\n' +
      '</root>'
    );
    xmljs.parseXmlString(file.contents).toString().should.eql(expected.toString());
    done();
  });
});


it('should modify / add multiple attributes of XML element (by object)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor([
    {path: '//version', attrs: [
      {major: 10},
      {minor: 11},
      {build: 20}
    ]}
  ]));

  stream.on('data', function(file) {
    var expected = xmljs.parseXmlString(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<root>\n' +
      '  <name>this is name</name>\n' +
      '  <version major="10" minor="11" build="20"></version>\n' +
      '</root>'
    );
    xmljs.parseXmlString(file.contents).toString().should.eql(expected.toString());
    done();
  });
});


it('should do multiple editing at onece (by object)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor([
    {path: '//version', attrs: [
      {major: 10},
      {minor: 11},
      {build: 20}
    ]},
    {path: '//name', text: 'new name'}
  ]));

  stream.on('data', function(file) {
    var expected = xmljs.parseXmlString(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<root>\n' +
      '  <name>new name</name>\n' +
      '  <version major="10" minor="11" build="20"></version>\n' +
      '</root>'
    );
    xmljs.parseXmlString(file.contents).toString().should.eql(expected.toString());
    done();
  });
});
