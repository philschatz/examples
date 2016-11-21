(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('substance')) :
  typeof define === 'function' && define.amd ? define(['substance'], factory) :
  (factory(global.substance));
}(this, (function (substance) { 'use strict';

/*
  Container display component
*/
class ContainerComponent extends substance.Component {

  render($$) {
    let el = $$('div').addClass('sc-container')
    el.append(
      $$(substance.ContainerEditor, {
        node: this.props.node
      }).ref('editor')
    )
    return el
  }

}

ContainerComponent.fullWidth = true

/*
  Container insert command
*/
class InsertContainerCommand extends substance.InsertNodeCommand {

  insertNode(tx, args) {
    let textType = tx.getSchema().getDefaultTextType()
    let p = tx.create({
      type: textType,
      content: 'Lorem ipsum'
    })
    args.node = {
      type: 'container',
      nodes: [p.id]
    };
    return substance.insertNode(tx, args)
  }

}

/*
  Package definition of your plugin
*/
const ContainerPackage = {
  name: 'container',
  configure: function(config) {
    config.addComponent('container', ContainerComponent)
    config.addCommand('insert-container', InsertContainerCommand)
    config.addTool('insert-container', substance.Tool)
    config.addIcon('insert-container', { 'fontawesome': 'fa-align-justify' })
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
    content: 'Nested Elements'
  })
  body.show('title')

  tx.create({
    id: 'intro',
    type: 'paragraph',
    content: [
      "The concept of Isolated Nodes allows to create nested content."
    ].join(' ')
  })
  body.show('intro')

  let c1 = tx.create({
    type: 'container',
    id: 'c1',
    nodes: []
  })
  body.show('c1')

  tx.create({
    type: 'paragraph',
    id: 'c1_p1',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  })
  c1.show('c1_p1')

  let c2 = tx.create({
    type: 'container',
    id: 'c2',
    nodes: []
  })
  c1.show('c2')

  tx.create({
    type: 'paragraph',
    id: 'c2_p1',
    content: 'Nunc turpis erat, sodales id aliquet eget, rutrum vel libero.'
  })
  c2.show('c2_p1')

  tx.create({
    type: 'paragraph',
    id: 'c1_p2',
    content: 'Donec dapibus vel leo sit amet auctor. Curabitur at diam urna.'
  })
  c1.show('c1_p2')

  tx.create({
    id: 'the-end',
    type: 'paragraph',
    content: [
      "That's it."
    ].join('')
  })
  body.show('the-end')
}

/*
  Application
*/

let cfg = new substance.ProseEditorConfigurator()
cfg.import(substance.ProseEditorPackage);
cfg.import(ContainerPackage);

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