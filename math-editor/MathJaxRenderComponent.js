import {Component} from 'substance'

if (!window.MathJax) {
  throw new Error('BUG: MathJax has not been loaded yet')
}

export default class MathJaxRenderComponent extends Component {
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
