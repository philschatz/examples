import {
  BasePackage, StrongPackage, EmphasisPackage, LinkPackage, ListPackage, Document,
  ParagraphPackage, HeadingPackage
} from 'substance'

import BodyPackage from '../body/BodyPackage'
import SimpleHTMLImporter from './SimpleHTMLImporter'

/**
  Standard configuration for SimpleWriter

  We define a schema (simple-article) import some core packages
  from Substance, as well as custom node types.

  An HTML importer is registered to be able to turn HTML markup
  into a SimpleArticle instance.
*/
export default {
  name: 'simple-writer',
  configure: function (config) {
    config.defineSchema({
      name: 'simple-article',
      ArticleClass: Document,
      defaultTextType: 'paragraph'
    })

    // Commented because these are already defined in ProseEditorPackage

    // BasePackage provides core functionaliy, such as undo/redo
    // and the SwitchTextTypeTool. However, you could import those
    // functionalities individually if you need more control
    // config.import(BasePackage)

    // core nodes
    // config.import(ParagraphPackage)
    // config.import(HeadingPackage)
    // config.import(StrongPackage, {toolTarget: 'annotations'})
    // config.import(EmphasisPackage, {toolTarget: 'annotations'})
    // config.import(LinkPackage, {toolTarget: 'annotations'})

    config.import(ListPackage)

    // custom nodes
    config.import(BodyPackage)
    // config.import(MathPackage, {toolTarget: 'annotations'})

    // Override Importer/Exporter
    config.addImporter('html', SimpleHTMLImporter)
  }
}
