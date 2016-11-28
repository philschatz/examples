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

  didUpdate(oldProps, oldState) {
    const {source} = this.props
    // Check so we do not lose focus
    if (source !== this._editor.getValue()) {
      this.__hackIgnoreFiringUpdates = true
      this._editor.setValue(source)
      this.__hackIgnoreFiringUpdates = false
    }
  }


  didMount() {
    let {language} = this.props
    // let editorSession = this.context.editorSession
    let node = this.props.node;
    this._editor = ace.edit(this.refs.source.getNativeElement())
    // editor.setTheme("ace/theme/monokai");
    this._editor.setOptions({
      maxLines: Infinity,
    });
    this._editor.$blockScrolling = Infinity;
    this._editor.getSession().setMode("ace/mode/" + language)
    // TODO: don't we need to dispose the editor?
    // For now we update the model only on blur
    // Option 1: updating on blur
    //   pro: one change for the whole code editing session
    //   con: very implicit, very late, hard to get selection right
    this._editor.on('blur', this._updateModelOnBlur.bind(this))
    this._editor.on('change', this._updateModelOnBlur.bind(this))

    this._editor.commands.addCommand({
      name: 'escape',
      bindKey: {win: 'Escape', mac: 'Escape'},
      exec: function(editor) {
        this.send('escape')
        editor.blur()
      }.bind(this),
      readOnly: true // false if this command should not apply in readOnly mode
    });

    // editorSession.onRender('document', this._onModelChange, this, {
    //   path: [node.id, 'source']
    // })
  }

  dispose() {
    // this.context.editorSession.off(this)
    this._editor.destroy()
  }

  _updateModelOnBlur() {
    // let nodeId = this.props.node.id
    let source = this._editor.getValue()
    if (source !== this.props.source && ! this.__hackIgnoreFiringUpdates) {
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
