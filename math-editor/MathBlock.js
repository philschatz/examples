import { BlockNode } from 'substance'

/*
  Node definition
*/
class MathBlock extends BlockNode {}

MathBlock.define({
  type: 'math',
  language: { type: 'string', default: 'text/tex' },
  source: { type: 'string' },
})


export default MathBlock
