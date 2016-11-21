import {Component} from 'substance'

export default class AceEditor extends Component {
  render($$) {
    let {source} = this.props
    let el = $$('div').addClass('sc-ace-editor')
    el.append(
      $$('div').append(source).ref('source')
    )
    return el;
  }

  // don't rerender because this would destroy ACE
  shouldRerender(newProps, newState) {
    return false;
  }

  didMount() {
    let {language} = this.props
    // let editorSession = this.context.editorSession
    let node = this.props.node;
    let editor = ace.edit(this.refs.source.getNativeElement())
    // editor.setTheme("ace/theme/monokai");
    editor.setOptions({
      maxLines: Infinity,
    });
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/" + language)
    // TODO: don't we need to dispose the editor?
    // For now we update the model only on blur
    // Option 1: updating on blur
    //   pro: one change for the whole code editing session
    //   con: very implicit, very late, hard to get selection right
    editor.on('blur', this._updateModelOnBlur.bind(this))
    editor.on('change', this._updateModelOnBlur.bind(this))

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
    // editorSession.onRender('document', this._onModelChange, this, {
    //   path: [node.id, 'source']
    // })
  }

  dispose() {
    // this.context.editorSession.off(this)
    this.editor.destroy()
  }

  _updateModelOnBlur() {
    let editor = this.editor
    // let nodeId = this.props.node.id
    let source = editor.getValue()
    if (source !== this.props.source) {
      // this.context.surface.transaction(function(tx) {
      //   tx.set([nodeId, 'source'], editor.getValue())
      // }, { source: this, skipSelection: true })
      this.send('aceUpdated', source)
    }
  }

  _onModelChange(change, info) {
    if (info.source !== this) {
      this.editor.setValue(this.props.source, -1)
    }
  }
}

AceEditor.fullWidth = true;
