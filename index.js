/* jshint node: true */

var xmljs       = require('libxmljs');
var through     = require('through2');
var PluginError = require('gulp-util').PluginError;

module.exports = function (editor) {

  // check options
  if (!editor)
    throw new PluginError('gulp-xml-editor', 'missing "editor function" option');    
  if (typeof editor !== 'function')
    throw new PluginError('gulp-xml-editor', '"editor function" option must be function');    

  return through.obj(function (file, encoding, callback) {

    // ignore it
    if (file.isNull()) {
      return callback();
    }

    // stream is not supported
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-xml-editor', 'Streaming is not supported'));
      return callback();
    }

    // edit XML object
    try {
      file.contents = new Buffer(editor(xmljs.parseXmlString(file.contents.toString('utf8'))).toString());
    }
    catch (err) {
      this.emit('error', new PluginError('gulp-xml-editor', err));
    }
    this.push(file);
    callback();

  });

};
