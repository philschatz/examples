import {
  Component, ProseEditor, ProseEditorConfigurator, EditorSession,
  ProseEditorPackage, BlockNode, Tool, InsertNodeCommand
} from 'substance'

/*
  Node definition
*/
class Math extends BlockNode {}

Math.define({
  type: 'math',
  language: 'string',
  source: 'text'
})

/*
  Display component
*/
class MathEditor extends Component {
  render($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-math-editor')
    el.append(
      $$('div').append(node.source).ref('source')
    )
    return el;
  }

  // don't rerender because this would destroy MathJax
  shouldRerender() {
    return false;
  }

  didMount() {
    let editorSession = this.context.editorSession
    let node = this.props.node;
    // let editor = ace.edit(this.refs.source.getNativeElement())
    // // editor.setTheme("ace/theme/monokai");
    // editor.setOptions({
    //   maxLines: Infinity,
    // });
    // editor.$blockScrolling = Infinity;
    // editor.getSession().setMode("ace/mode/" + node.language)
    // // TODO: don't we need to dispose the editor?
    // // For now we update the model only on blur
    // // Option 1: updating on blur
    // //   pro: one change for the whole code editing session
    // //   con: very implicit, very late, hard to get selection right
    // editor.on('blur', this._updateModelOnBlur.bind(this))
    //
    // editor.commands.addCommand({
    //   name: 'escape',
    //   bindKey: {win: 'Escape', mac: 'Escape'},
    //   exec: function(editor) {
    //     this.send('escape')
    //     editor.blur()
    //   }.bind(this),
    //   readOnly: true // false if this command should not apply in readOnly mode
    // });
    //
    // this.editor = editor
    // editorSession.onRender('document', this._onModelChange, this, {
    //   path: [node.id, 'source']
    // })
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

MathEditor.fullWidth = true;

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
let MathPackage = {
  name: 'math',
  configure: function(config) {
    config.addNode(Math)
    config.addComponent(Math.type, MathEditor)
    config.addCommand('insert-math', InsertMathCommand)
    config.addTool('insert-math', Tool, {toolGroup: 'insert'})
    config.addIcon('insert-math', { 'fontawesome': 'fa-code' })
    config.addLabel('insert-math', 'Source Code')
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
      'Here is some math: x=\\frac{-b\pm \sqrt{b^2-4ac}}{2a}',
    ].join(" ")
  })
  body.show('intro')
  tx.create({
    id: 's1',
    type: 'math',
    language: 'text/tex',
    source: [
      "x^2+y^2",
      "x=\\frac{-b\pm \sqrt{b^2-4ac}}{2a}",
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
let cfg = new ProseEditorConfigurator()
cfg.import(ProseEditorPackage)
cfg.import(MathPackage)

window.onload = function() {
  let doc = cfg.createArticle(fixture)
  let editorSession = new EditorSession(doc, {
    configurator: cfg
  })
  ProseEditor.mount({
    editorSession: editorSession
  }, document.body)
}
