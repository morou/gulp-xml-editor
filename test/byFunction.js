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


it('should modify attribute of XML element (by function)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor(function(xml) {
    xml.get('//version').attr({'major': '10'});
    return xml;
  }));

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


it('should add child Element by useing xmljs object (by function)', function(done) {

  var stream = gulp.src('test/test.xml').pipe(xeditor(function(xml, xj) {
    xml.get('//name').text('new name');

    var child = new xj.Element(xml, 'child');
    child.text('child element');
    xml.get('//name').addChild(child);
    return xml;
  }));

  stream.on('data', function(file) {
    var expected = xmljs.parseXmlString(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<root>\n' +
      '  <name>new name<child>child element</child></name>\n' +
      '  <version major="1" minor="0"></version>\n' +
      '</root>'
    );
    xmljs.parseXmlString(file.contents).toString().should.eql(expected.toString());
    done();
  });
});
