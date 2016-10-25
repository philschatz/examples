import {
  ProseEditor, ProseEditorConfigurator, EditorSession,
  ProseEditorPackage, ListPackage
} from 'substance'

/*
  Example document
*/
const fixture = function(tx) {
  let body = tx.get('body')
  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: "This example demonstrates support for Lists."
  })
  body.show('p1')

  tx.create({
    id: 'li1',
    type: 'list-item',
    content: 'Item 1'
  })
  tx.create({
    id: 'li2',
    type: 'list-item',
    content: 'Item 2'
  })
  tx.create({
    id: 'li3',
    type: 'list-item',
    content: 'Item 3'
  })
  tx.create({
    id: 'list1',
    type: 'list',
    items: ['li1', 'li2', 'li3']
  })
  body.show('list1')

  tx.create({
    id: 'p2',
    type: 'paragraph',
    content: "Fine."
  })
  body.show('p2')
}

/*
  Application
*/

let cfg = new ProseEditorConfigurator()
cfg.import(ProseEditorPackage)
cfg.import(ListPackage)

window.onload = function() {
  let doc = cfg.createArticle(fixture)
  let editorSession = new EditorSession(doc, {
    configurator: cfg
  })
  ProseEditor.mount({
    editorSession: editorSession
  }, document.body)
}
