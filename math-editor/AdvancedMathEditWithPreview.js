import {Component} from 'substance'
import MathJaxRenderComponent from './MathJaxRenderComponent'
import AceComponent from './AceComponent'

export default class AdvancedMathEditWithPreview extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'aceUpdated': this._aceUpdated,
    })
  }

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
      // $$('input')
      // .attr('value', source)
      // .on('blur', this._updateSource)
      // .on('keyup', this._updateSource)
      // .ref('sourceLatex')
      $$(AceComponent, {source, language}).ref('hack-to-not-rerender1')
    )
    .append($$(MathJaxRenderComponent, {source, language}).ref('hack-to-not-rerender2'))

    return el
  }

  // _updateSource() {
  //   const source = this.refs['sourceLatex'].getNativeElement().value
  //   if (source !== this.state.source) {
  //     this.extendState({source})
  //     this.send('mathAdvancedUpdated', source)
  //   }
  // }

  _aceUpdated(source) {
    if (source !== this.state.source) {
      this.extendState({source})
      this.send('mathAdvancedUpdated', source)
    }
  }


}
