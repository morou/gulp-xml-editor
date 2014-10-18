/* jshint node: true */

var xmljs       = require('libxmljs');
var through     = require('through2');
var PluginError = require('gulp-util').PluginError;

module.exports = function (editor) {

  // edit XML document by user specific function
  function editByFunction(xmlDoc, xmljs) {
    return editor(xmlDoc, xmljs).toString();
  }

  // edit XML document by user specific object
  function editByObject(xmlDoc, xmljs, ee) {

    editor.forEach(function(ed) {
      var elem = xmlDoc.get(ed.path);
      if (!elem || !(elem instanceof xmljs.Element)) {
        ee.emit('error', new PluginError('gulp-xml-editor', 'Can\'t find element at "' + ed.path + '"'));
        return;
      }

      if (ed.text !== undefined && ed.text !== null) {
        elem.text(ed.text);
      }

      var attrs = ed.attrs || [];
      if (ed.attr) attrs.push(ed.attr);
      attrs.forEach(function(attr) {
        elem.attr(attr);
      });

    });

    return xmlDoc.toString();
  }

  var editByXXX;

  // check options
  if (typeof editor === 'function') editByXXX = editByFunction;
  else if (editor instanceof Array) editByXXX = editByObject;
  else if (typeof editor === 'undefined') throw new PluginError('gulp-xml-editor', 'missing "editor" option');
  else throw new PluginError('gulp-xml-editor', '"editor" option must be a function or array');

  // create through object
  return through.obj(function (file, encoding, callback) {

    // ignore it
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    // stream is not supported
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-xml-editor', 'Streaming is not supported'));
      return callback();
    }

    // edit XML document
    try {
      file.contents = new Buffer(editByXXX(xmljs.parseXmlString(file.contents.toString('utf8')), xmljs, this));
    }
    catch (err) {
      this.emit('error', new PluginError('gulp-xml-editor', err));
    }
    this.push(file);
    callback();

  });

};
