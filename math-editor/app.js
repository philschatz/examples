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
  language: 'text/tex',
  source: 'text'
})


class MathJaxRenderComponent extends Component {
  render($$) {
    let {node, language, source} = this.props

    let el = $$('div').addClass('sc-math-render')
    .append('Rendering ' + source)
    .ref('renderedMathNode')
    return el
  }

  // don't rerender because this would destroy MathJax
  shouldRerender() {
    return false;
  }

  didMount() {
    let {node, language, source} = this.props
    let nativeMathContainer = this.refs['renderedMathNode'].getNativeElement()

    // HACK? so shouldRender is called
    // this.el = this.refs['renderedMathNode']

    // Mark node up so MathJax understands
    if (language === 'text/tex') {
      nativeMathContainer.innerHTML = '$$' + source + '$$'
    } else {
      throw new Error('BUG: No math language set!')
    }

    function cb() {
      console.log('MathJaxDoneRendering')
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, nativeMathContainer, cb])

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

}


class MathQuillComponent extends Component {
  render($$) {
    let {node, language, source} = this.props

    let el = $$('span').addClass('sc-mathquill-input').append(source)
    .ref('mathQuillInput')
    return el
  }

  // don't rerender because this would destroy MathJax
  shouldRerender() {
    return false;
  }

  _updateLatex() {
    console.log('MathField: ' + this._mathField.latex())
    this.send('mathQuillUpdated', this._mathField.latex())
  }

  didMount() {
    let {node, language, source} = this.props
    let mathQuillInput = this.refs['mathQuillInput'].getNativeElement()

    let MQ = MathQuill.getInterface(2) // for backcompat
    this._mathField = MQ.MathField(mathQuillInput, {
      spaceBehavesLikeTab: true, // configurable
      handlers: {
        edit: this._updateLatex.bind(this)
      }
    })
  }

}


class AdvancedMathEditWithPreview extends Component {
  getInitialState() {
    return {source: this.props.source}
  }
  render($$) {
    const {language} = this.props
    const source = this.state.source || this.props.source

    const el = $$('div')
    .append('Enter Latex Source:')
    .append(
      // TODO: Use the ACE editor
      $$('input')
      .attr('value', source)
      .on('blur', this._updateSource)
      .on('keyup', this._updateSource)
      .ref('sourceLatex')
    )
    .append($$(MathJaxRenderComponent, {source, language}))

    return el
  }

  _updateSource() {
    const source = this.refs['sourceLatex'].getNativeElement().value
    this.extendState({source})
    this.send('mathAdvancedUpdated', source)
  }
}

class MathEditModal extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'mathQuillUpdated': this._sourceUpdated,
      'mathAdvancedUpdated': this._sourceUpdated,
    })
  }

  render($$) {
    let {source, language} = this.props
    let Button = this.getComponent('button')
    let el = $$('div')
    el.append($$('div'))
    .append($$('div').append('Edit the math below (uses MathQuill):'))
    .append($$(MathQuillComponent, {source}))
    .append($$('hr'))
    .append($$('div').append('Or, edit the latex directly'))
    .append($$(AdvancedMathEditWithPreview, {language, source}))

    el.append(
      $$('div').addClass('se-actions').append(
        $$(Button).append('Save').on('click', this._save),
        $$(Button).addClass('se-cancel').append('Cancel').on('click', this._cancel)
      )
    )
    return el
  }

  _sourceUpdated(source) {
    this.__source__ = source
  }
  _save() {
    this.send('saveMath', this.__source__)
  }

  _cancel() {
    this.send('cancelMath')
  }
}

/*
  Display component
*/
class MathEditComponent extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'saveMath': this._saveAndCloseModal,
      'cancelMath': this._closeModal,
    })

    this.props.node.on('properties:changed', this.rerender, this)
  }

  render($$) {
    let Modal = this.getComponent('modal')
    let node = this.props.node
    let {language, source} = node

    let el = $$('div').addClass('sc-math-editor')
    el.append(
      $$(MathJaxRenderComponent, {language, source})
      .on('click', this._toggleEditor)
    )

    if (this.state.editMath) {
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          // $$(EditorClass, contrib)
          $$(MathEditModal, {language, source})
        )
      )
    }

    return el;
  }

  dispose() {
    this.context.editorSession.off(this)
    this.editor.destroy()
  }

  _saveAndCloseModal(source) {
    let nodeId = this.props.node.id
    if (source !== this.props.node.source) {
      this.context.surface.transaction(function(tx) {
        tx.set([nodeId, 'source'], source)
      }, { source: this, skipSelection: true })
    }
    this._closeModal()
  }

  _closeModal() {
    this.setState({
      editMath: false
    })
  }

  _toggleEditor() {
    this.setState({
      editMath: true
    })
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

MathEditComponent.fullWidth = true;

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
    config.addComponent(Math.type, MathEditComponent)
    config.addCommand('insert-math', InsertMathCommand)
    config.addTool('insert-math', Tool, {toolGroup: 'insert'})
    config.addIcon('insert-math', { 'fontawesome': 'fa-code' })
    config.addLabel('insert-math', 'Math Formula')
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
    source: "x=\\frac{-b\\pm \\sqrt{b^2-4ac}}{2a}",
  });
  body.show('s1')
  tx.create({
    id: 'p2',
    type: 'paragraph',
    content: [
      "And here is another formula which does not work in MathQuill"
    ].join(" ")
  })
  body.show('p2')

  tx.create({
    id: 's2',
    type: 'math',
    language: 'text/tex',
    source: `

    \\mathbf{A} =
     \\begin{bmatrix}
     a_{11} & a_{12} & \\cdots & a_{1n} \\\\
     a_{21} & a_{22} & \\cdots & a_{2n} \\\\
     \\vdots & \\vdots & \\ddots & \\vdots \\\\
     a_{m1} & a_{m2} & \\cdots & a_{mn}
     \\end{bmatrix} =
    \\left( \\begin{array}{rrrr}
     a_{11} & a_{12} & \\cdots & a_{1n} \\\\
     a_{21} & a_{22} & \\cdots & a_{2n} \\\\
     \\vdots & \\vdots & \\ddots & \\vdots \\\\
     a_{m1} & a_{m2} & \\cdots & a_{mn}
     \\end{array} \\right) =\\left(a_{ij}\\right) \\in \\mathbb{R}^{m \\times n}.

    `,
  });
  body.show('s2')

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
