import { PropertyAnnotation, Component, Fragmenter, Modal } from 'substance'
// import IsolatedNodeComponent from 'substance/packages/isolated-node/IsolatedNodeComponent'

/**
  Based on substance-texture ContribComponent
*/
class MathComponent extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'closeModal': this._closeModal,
      // 'xmlSaved': this._closeModal
    })

    this.props.node.on('properties:changed', this.rerender, this)
  }

  didMount() {
    const nativeMathContainer = this.refs.renderedMathNode.getNativeElement()
    function cb(a,b,c) {
      console.log('MathJaxDoneRendering', a, b, c)
    }
    MathJax.Hub.Queue ["Typeset", MathJax.Hub, nativeMathContainer, cb]
    // console.log('TODO: Typesetting via MathJax', nativeMathContainer);
  }

  // similar to substance-examples/code-editor, this makes sure MathJax does not rerender unnecessarily
  shouldRerender() {
    return false
  }

  render($$) {
    let Modal = this.getComponent('modal')
    // let IsolatedNodeComponent = this.getComponent('isolated-node')

    // let contrib = getAdapter(this.props.node)
    let el = $$('div').addClass('sc-math')
      .append(
        $$('div').addClass('se-name')
          .append('Rendering Math $a+b^2$ $$a+b^2$$')
          .attr({contenteditable: false})
          .ref('renderedMathNode')
      ).on('click', this._toggleEditor)

    if (this.state.editMath) {
      // Conforms to strict markup enforced by texture
      // for visual editing
      // let EditorClass
      // if (contrib.strict) {
      //   EditorClass = EditContrib
      // } else {
      //   EditorClass = EditXML
      // }

      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          // $$(EditorClass, contrib)
          $$('div').append('body of the modal')
        )
      )
    }
    return el
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

}

// MathComponent.define({
//   type: 'math',
//   content: { type: 'string', default: '' }
// })

// in presence of overlapping annotations will try to render this as one element
MathComponent.fragmentation = Fragmenter.SHOULD_NOT_SPLIT



export default MathComponent
