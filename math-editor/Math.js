import { PropertyAnnotation, Fragmenter } from 'substance'

/**
  Math node type, based on PropertyAnnotation. Defines
  math property which holds the math content as a string.
*/
class Math extends PropertyAnnotation {}

Math.define({
  type: 'math',
  content: { type: 'string', default: '' }
})

// in presence of overlapping annotations will try to render this as one element
Math.fragmentation = Fragmenter.SHOULD_NOT_SPLIT


export default Math
