import { AnnotationCommand } from 'substance'

/**
  Command implementation used for creating, expanding and
  truncating comments.

  Fusion and deletion are disabled as these are handled by EditMathTool.
*/
class MathCommand extends AnnotationCommand {
  canFuse()   { return false }
  canDelete() { return false }
}

export default MathCommand
