import {Component} from 'substance'
import MathQuillComponent from './MathQuillComponent'
import AdvancedMathEditWithPreview from './AdvancedMathEditWithPreview'

export default class MathEditModal extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'mathQuillUpdated': this._sourceUpdated,
      'mathAdvancedUpdated': this._sourceUpdated,
    })
  }

  getInitialState() {
    return {source: this.props.source}
  }

  render($$) {
    let {language} = this.props
    let {source} = this.state
    let Button = this.getComponent('button')
    let el = $$('div')
    el.append($$('div'))
    .append($$('h2').append('Edit the math below (uses MathQuill):'))
    .append($$(MathQuillComponent, {source}).ref('hack-to-not-rerender1'))
    .append($$('hr'))
    .append($$('h2').append('Or, edit the latex directly'))
    .append($$(AdvancedMathEditWithPreview, {language, source}).ref('hack-to-not-rerender2'))

    el.append(
      $$('div').addClass('se-actions').append(
        $$(Button).addClass('se-save').append('Save').on('click', this._save),
        $$(Button).addClass('se-cancel').append('Cancel').on('click', this._cancel)
      )
    )
    return el
  }

  _sourceUpdated(source) {
    // When syncing MathQuill and the Ace editor (updating their props because another component was editing math)
    // do not re-fire
    if (source !== this.state.source) {
      this.extendState({source: source})
    }
  }
  _save() {
    this.send('saveMath', this.state.source)
  }

  _cancel() {
    this.send('cancelMath')
  }
}
