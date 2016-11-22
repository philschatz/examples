import {
  Component, ProseEditor, Configurator, ProseEditorConfigurator, EditorSession, DocumentSession,
  ProseEditorPackage, BlockNode, Tool, InsertNodeCommand
} from 'substance'

import MathBlock from './MathBlock'
import MathJaxRenderComponent from './MathJaxRenderComponent'
import MathQuillComponent from './MathQuillComponent'
import AceComponent from './AceComponent'
import fixture from './fixture'
import SimpleWriterPackage from './SimpleWriterPackage'
import MathConverter from './MathConverter'
import MathPackage from './MathPackage'



/*
  Command for math insertion
*/
class InsertMathCommand extends InsertNodeCommand {
  createNodeData() {
    return {
      type: 'math',
      language: 'text/tex',
      content: ''
    }
  }
}

/*
  Package defintion for math extension
*/
// let MathPackage = {
//   name: 'math',
//   configure: function(config) {
//     config.addNode(MathBlock)
//     config.addConverter('html', MathConverter)
//     config.addComponent(MathBlock.type, MathEditComponent)
//     config.addCommand('insert-math', InsertMathCommand)
//     config.addTool('insert-math', Tool, {toolGroup: 'insert'})
//     config.addIcon('insert-math', { 'fontawesome': 'fa-code' })
//     config.addLabel('insert-math', 'Math Formula')
//   }
// }

/*
  Application
*/
// let cfg = new ProseEditorConfigurator()
let cfg = new Configurator()
cfg.import(ProseEditorPackage)
cfg.import(SimpleWriterPackage)
cfg.import(MathPackage)

window.onload = function() {
  // let doc = cfg.createArticle(fixture)
  // let editorSession = new EditorSession(doc, {
  //   configurator: cfg
  // })
  // ProseEditor.mount({
  //   editorSession: editorSession
  // }, document.body)
  // Import article from HTML markup
  let importer = cfg.createImporter('html')
  let doc = importer.importDocument(fixture)
  // This is the data structure manipulated by the editor
  // let documentSession = new DocumentSession(doc)
  let editorSession = new EditorSession(doc, {
    configurator: cfg
  })
  // Mount SimpleWriter to the DOM and run it.
  ProseEditor.mount({
    editorSession: editorSession,
    // documentSession: documentSession,
    configurator: cfg
  }, document.body)
}
