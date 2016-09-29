const {
  ProseEditor, Configurator, DocumentSession,
  ProseEditorPackage, ContainerAnnotation
} = substance

/*
  Highlight anno that can span over multiple paragraphs
*/
class Highlight extends ContainerAnnotation {}

Highlight.define({
  type: 'highlight',
  mood: { type: 'string', default: 'normal' }
})

/*
  Package definition of your inline image plugin
*/
const HighlightPackage = {
  name: 'highlight',
  configure: function(config) {
    config.addNode(Highlight)
  }
}

/*
  Example document
*/
const fixture = function(tx) {
  let body = tx.get('body')

  tx.create({
    id: 'title',
    type: 'heading',
    level: 1,
    content: 'Container Annotation'
  })
  body.show('title')
  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: [
      "This shows a container annotation"
    ].join(' ')
  })
  body.show('p1')

  tx.create({
    id: 'p2',
    type: 'paragraph',
    content: [
      "that spans over two paragraphs"
    ].join(' ')
  })
  body.show('p2')
  tx.create({
    id: 'h1',
    type: 'highlight',
    containerId: 'body',
    startPath: ['p1', 'content'],
    startOffset: 10,
    endPath: ['p2', 'content'],
    endOffset: 15
  })
}

/*
  Application
*/
let configurator = new Configurator()
  .import(ProseEditorPackage)
  .import(HighlightPackage)

window.onload = function() {
  let doc = configurator.createArticle(fixture)
  let documentSession = new DocumentSession(doc)
  ProseEditor.mount({
    documentSession: documentSession,
    configurator: configurator
  }, document.body)
}


