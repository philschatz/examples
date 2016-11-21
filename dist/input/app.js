(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('substance')) :
  typeof define === 'function' && define.amd ? define(['substance'], factory) :
  (factory(global.substance));
}(this, (function (substance) { 'use strict';

/*
  Node definition
*/
class InputNode extends substance.DocumentNode {}

InputNode.defineSchema({
  type: 'input-node',
  content: { type: 'string', default: '' }
})

/*
  Node display component
*/
class InputComponent extends substance.Component {
  didMount() {
    // Register for model side updates
    this.context.editorSession.onRender('document', this.onContentChange, this, {
      path: [this.props.node.id, 'content']
    })
  }

  // And please always deregister
  dispose() {
    this.context.editorSession.off(this)
  }

  render($$) {
    let el = $$('div').addClass('sc-input-node')
    let input = $$('input').ref('input')
      .val(this.props.node.content)
      .on('change', this.onChange)
    // you should disable the input when the parent asks you to do so
    if (this.props.disabled) {
      input.attr('disabled', true)
    }

    el.append(input)
    return el
  }

  // this is called when the input's content has been changed
  onChange() {
    let editorSession = this.context.editorSession
    let node = this.props.node
    let newVal = this.refs.input.val()
    editorSession.transaction(function(tx) {
      tx.set([node.id, 'content'], newVal)
    })
  }

  // this is called when the model has changed, e.g. on undo/redo
  onContentChange() {
    this.refs.input.val(this.props.node.content)
  }
}

/*
  Package definition of your plugin
*/
const InputPackage = {
  name: 'input',
  configure: function(config) {
    config.addNode(InputNode)
    config.addComponent(InputNode.type, InputComponent)
    config.addLabel('input', 'Input')
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
    content: 'Input Element'
  })
  body.show('title')
  tx.create({
    id: 'intro',
    type: 'paragraph',
    content: [
      "You can use custom elements with an HTML input element"
    ].join('')
  })
  body.show('intro')
  tx.create({
    type: 'input-node',
    id: 'input',
    content: 'Lorem ipsum...'
  })
  body.show('input')
  tx.create({
    id: 'the-end',
    type: 'paragraph',
    content: 'That way you can implement editor functionality using class web development practices.'
  })
  body.show('the-end')
}

/*
  Application
*/
let cfg = new substance.ProseEditorConfigurator()
cfg.import(substance.ProseEditorPackage)
cfg.import(InputPackage)

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