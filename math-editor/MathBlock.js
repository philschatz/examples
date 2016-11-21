import { BlockNode } from 'substance'

/*
  Node definition
*/
class MathBlock extends BlockNode {}

MathBlock.define({
  type: 'math',
  language: 'text/tex',
  source: 'text'
})


export default MathBlock
