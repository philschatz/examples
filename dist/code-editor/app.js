(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('substance')) :
  typeof define === 'function' && define.amd ? define(['substance'], factory) :
  (factory(global.substance));
}(this, (function (substance) { 'use strict';

/*
  Node definition
*/
class Script extends substance.BlockNode {}

Script.define({
  type: 'script',
  language: 'string',
  source: 'text'
})

/*
  Display component
*/
class ScriptEditor extends substance.Component {
  render($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-script-editor')
    el.append(
      $$('div').append(node.source).ref('source')
    )
    return el;
  }

  // don't rerender because this would destroy ACE
  shouldRerender() {
    return false;
  }

  didMount() {
    let editorSession = this.context.editorSession
    let node = this.props.node;
    let editor = ace.edit(this.refs.source.getNativeElement())
    // editor.setTheme("ace/theme/monokai");
    editor.setOptions({
      maxLines: Infinity,
    });
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/" + node.language)
    // TODO: don't we need to dispose the editor?
    // For now we update the model only on blur
    // Option 1: updating on blur
    //   pro: one change for the whole code editing session
    //   con: very implicit, very late, hard to get selection right
    editor.on('blur', this._updateModelOnBlur.bind(this))

    editor.commands.addCommand({
      name: 'escape',
      bindKey: {win: 'Escape', mac: 'Escape'},
      exec: function(editor) {
        this.send('escape')
        editor.blur()
      }.bind(this),
      readOnly: true // false if this command should not apply in readOnly mode
    });

    this.editor = editor
    editorSession.onRender('document', this._onModelChange, this, {
      path: [node.id, 'source']
    })
  }

  dispose() {
    this.context.editorSession.off(this)
    this.editor.destroy()
  }

  _updateModelOnBlur() {
    let editor = this.editor
    let nodeId = this.props.node.id
    let source = editor.getValue()
    if (source !== this.props.node.source) {
      this.context.surface.transaction(function(tx) {
        tx.set([nodeId, 'source'], editor.getValue())
      }, { source: this, skipSelection: true })
    }
  }

  _onModelChange(change, info) {
    if (info.source !== this) {
      this.editor.setValue(this.props.node.source, -1)
    }
  }
}

ScriptEditor.fullWidth = true;

/*
  Command for script insertion
*/
class InsertScriptCommand extends substance.InsertNodeCommand {
  createNodeData() {
    return {
      type: 'script',
      language: 'javascript',
      content: ''
    }
  }
}

/*
  Package defintion for script extension
*/
let ScriptPackage = {
  name: 'script',
  configure: function(config) {
    config.addNode(Script)
    config.addComponent(Script.type, ScriptEditor)
    config.addCommand('insert-script', InsertScriptCommand)
    config.addTool('insert-script', substance.Tool, {toolGroup: 'insert'})
    config.addIcon('insert-script', { 'fontawesome': 'fa-code' })
    config.addLabel('insert-script', 'Source Code')
  }
}

/*
  Example document
*/
let fixture = function(tx) {
  let body = tx.get('body')
  tx.create({
    id: 'h1',
    type: 'heading',
    level: 1,
    content: 'Embedding a 3rdParty CodeEditor'
  })
  body.show('h1')
  tx.create({
    id: 'intro',
    type: 'paragraph',
    content: [
      'It is possible to use 3rd party components, a code editor for instance, such as ACE.',
      'The editor us wrapped into an IsolatedNode which makes it independent from the main word-processor interface.',
    ].join(" ")
  })
  body.show('intro')
  tx.create({
    id: 's1',
    type: 'script',
    language: 'javascript',
    source: [
      "function hello_world() {",
      "  alert('Hello World!');",
      "}"
    ].join("\n")
  });
  body.show('s1')
  tx.create({
    id: 'the-end',
    type: 'paragraph',
    content: [
      "That's it."
    ].join(" ")
  })
  body.show('the-end')
}

/*
  Application
*/
let cfg = new substance.ProseEditorConfigurator()
cfg.import(substance.ProseEditorPackage)
cfg.import(ScriptPackage)

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