# gulp-xml-editor

gulp-xml-editor is a [gulp](https://github.com/wearefractal/gulp) plugin to edit XML document based on [libxmljs](https://github.com/polotek/libxmljs).

## Usage
```javascript
var xeditor = require("gulp-xml-editor");

/*
  edit XML document by using user specific object
*/
gulp.src("./manifest.xml")
  .pipe(xeditor([
    {path: '//name', text: 'new names'},
    {path: '//version', attr: {'major': '2'}}
  ]))
  .pipe(gulp.dest("./dest"));


/*
  edit XML document by using user specific function
*/
gulp.src("./manifest.xml")
  .pipe(xeditor(function(xml, xmljs) {

    // 'xml' is libxmljs Document object.
    xml.get('//key[./text()="Version"]').nextElement().text('2.0.0');

    // 'xmljs' is libxmljs object. you can call any libxmljs function.
    var child = new xmljs.Element(xml, 'note');
    child.text('some text');
    xml.get('//description').addChild(child);

    // must return libxmljs Document object.
    return xml;
  }))
  .pipe(gulp.dest("./dest"));
```

### Note
Please see [libxmljs wiki page](https://github.com/polotek/libxmljs/wiki) to get more information about libxmljs API.

## API
### xeditor(editorObjects)
#### editorObjects
Type: `Array of object`

The object must be one of following.

```javascript
// to modify(or add) the text of the element
{path: 'xpath to the element', text: 'new text value'}

// to modify(or add) a attribute of the element
{path: 'xpath to the element', attr: {'attrName': 'attrValue'}}

// to modify(or add) some attributes of the element
{path: 'xpath to the element', attrs: [
  {'attrName1': 'attrValue1'},
  {'attrName2': 'attrValue2'}
]}
```
You can't specify xpath to attribute nor text node.

### xeditor(editorFunction)
#### editorFunction
Type: `function`

The `editorFunction` must have the following signature: `function (xml, [xmljs]) {}`, and must return libxmljs Document object. The `xml` argument is libxmljs Document object, and the `xmljs` argument is libxmljs object.

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
