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

  render($$) {
    const {language} = this.props
    const source = this.props.source

    const el = $$('div')
    .append('Enter Latex Source:')
    .append(
      $$(AceComponent, {source, language}).ref('hack-to-not-rerender1')
    )
    .append($$(MathJaxRenderComponent, {source, language}).ref('hack-to-not-rerender2'))

    return el
  }

  _aceUpdated(source) {
    if (source !== this.props.source) {
      this.send('mathAdvancedUpdated', source)
    }
  }


}
