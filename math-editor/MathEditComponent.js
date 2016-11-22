import {Component} from 'substance'
import MathJaxRenderComponent from './MathJaxRenderComponent'
import MathEditModal from './MathEditModal'

/*
  Display component
*/
export default class MathEditComponent extends Component {
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
      $$(MathJaxRenderComponent, {language, source}).ref('hack-to-not-rerender3')
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
