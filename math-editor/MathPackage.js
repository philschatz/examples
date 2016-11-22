import { AnnotationTool, EditAnnotationCommand } from 'substance'
import MathBlock from './MathBlock'
import MathComponent from './MathComponent'
import MathCommand from './MathCommand'
// import EditMathTool from './EditMathTool'
import MathConverter from './MathConverter'
import MathEditComponent from './MathEditComponent'

/**
  Math package that can be imported by SimpleWriter

  Provides a Math node definition, a converter for HTML conversion,
  commands and tools for creation, and editing of maths.
*/
export default {
  name: 'math',
  configure: function(config, options) {


    //     config.addNode(MathBlock)
    //     config.addConverter('html', MathConverter)
    config.addComponent(MathBlock.type, MathEditComponent)
    //     config.addCommand('insert-math', InsertMathCommand)
    //     config.addTool('insert-math', Tool, {toolGroup: 'insert'})
    //     config.addIcon('insert-math', { 'fontawesome': 'fa-code' })
    //     config.addLabel('insert-math', 'Math Formula')


    config.addNode(MathBlock)
    config.addConverter('html', MathConverter)

    // Tool to insert a new math
    config.addCommand('math', MathCommand, {nodeType: 'math'})
    config.addTool('math', AnnotationTool, {toolGroup: options.toolTarget || 'annotations'})
    // Tool to edit an existing math, should be displayed as an overlay
    config.addCommand('edit-math', EditAnnotationCommand, {nodeType: 'math'})
    // config.addTool('edit-math', EditMathTool, { toolGroup: 'overlay' })

    // Icons and labels
    config.addIcon('math', { 'fontawesome': 'fa-superscript'})
    config.addLabel('math', 'Math')

    config.addComponent(Math.type, MathComponent)

  }
}
