# gulp-xml-editor

gulp-xml-editor is a [gulp](https://github.com/wearefractal/gulp) plugin to edit XML document based on [libxmljs](https://github.com/polotek/libxmljs).

## Usage
```javascript
var xeditor = require("gulp-xml-editor");

gulp.src("./manifest.xml")
  .pipe(xeditor(function(xml) {
    // xml is libxmljs document object. You can call any libxmljs function.
    xml.get('//key[./text()="Version"]').nextElement().text('2.0.0');
    // must return libxmljs document object.
    return xml;
  }))
  .pipe(gulp.dest("./dest"));
```

Please see [libxmljs wiki page](https://github.com/polotek/libxmljs/wiki) to get more information about libxmljs API.

## API
### xeditor(editorFunction)
#### editorFunction
The `editorFunction` must have the following signature: `function (xml) {}`, and must return libxmljs object.

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)