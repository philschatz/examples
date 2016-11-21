import { AnnotationTool, EditAnnotationCommand } from 'substance'
import Math from './Math'
import MathComponent from './MathComponent'
import MathCommand from './MathCommand'
import EditMathTool from './EditMathTool'
import MathConverter from './MathConverter'

/**
  Math package that can be imported by SimpleWriter

  Provides a Math node definition, a converter for HTML conversion,
  commands and tools for creation, and editing of maths.
*/
export default {
  name: 'link',
  configure: function(config, options) {
    config.addNode(Math)
    config.addConverter('html', MathConverter)

    // Tool to insert a new math
    config.addCommand('math', MathCommand, {nodeType: 'math'})
    config.addTool('math', AnnotationTool, {target: options.toolTarget || 'annotations'})
    // Tool to edit an existing math, should be displayed as an overlay
    config.addCommand('edit-math', EditAnnotationCommand, {nodeType: 'math'})
    config.addTool('edit-math', EditMathTool, { target: 'overlay' })

    // Icons and labels
    config.addIcon('math', { 'fontawesome': 'fa-math'})
    config.addLabel('math', 'Math')

    config.addComponent(Math.type, MathComponent)

  }
}
