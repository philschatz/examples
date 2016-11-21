(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('substance')) :
  typeof define === 'function' && define.amd ? define(['substance'], factory) :
  (factory(global.substance));
}(this, (function (substance) { 'use strict';

var fixture = function(tx) {
  let body = tx.get('body')
  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: "Insert a new image using the image tool."
  })
  body.show('p1')

  tx.create({
    id: 'f1',
    type: 'file',
    fileType: 'image',
    url: 'https://pbs.twimg.com/profile_images/706616363599532032/b5z-Hw5g.jpg'
  })
  tx.create({
    id: 'i1',
    type: 'image',
    imageFile: 'f1'
  })
  body.show('i1')
  tx.create({
    id: 'p2',
    type: 'paragraph',
    content: "Please note that images are not actually uploaded in this example. You would need to provide a custom file client that talks to an image store. See FileClientStub which reveals the API you have to implement."
  })
  body.show('p2')
  tx.create({
    id: 'i2',
    type: 'image',
    imageFile: 'f1'
  })
  body.show('i2')
}

/*
  Application
*/
let cfg = new substance.ProseEditorConfigurator()
cfg.import(substance.ProseEditorPackage)
cfg.import(substance.ImagePackage)

window.onload = function() {
  let doc = cfg.createArticle(fixture)
  let editorSession = new substance.EditorSession(doc, {
    configurator: cfg
  })
  substance.ProseEditor.mount({
    editorSession: editorSession
  }, document.body)
}

})));

//# sourceMappingURL=./app.js.map