(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('substance')) :
  typeof define === 'function' && define.amd ? define(['substance'], factory) :
  (factory(global.substance));
}(this, (function (substance) { 'use strict';

/*
  A default implementation to render the content for the overlay (aka popup) tools.
*/
class TextTools extends substance.Toolbox {

  didMount() {
    super.didMount()
    this.context.scrollPane.on('overlay:position', this._position, this)
  }

  dispose() {
    super.dispose()
    this.context.scrollPane.off(this)
  }

  render($$) {
    let el = $$('div').addClass(this.getClassNames())
    el.addClass('sm-hidden')
    el.addClass('sm-theme-'+this.getTheme())
    let activeToolGroups = this.state.activeToolGroups
    let activeToolsEl = $$('div').addClass('se-active-tools')

    activeToolGroups.forEach((toolGroup) => {
      let toolGroupProps = Object.assign({}, toolGroup, {
        toolStyle: this.getToolStyle(),
        showIcons: true
      })
      activeToolsEl.append(
        $$(toolGroup.Class, toolGroupProps)
      )
    })
    el.append(activeToolsEl)
    return el
  }

  hide() {
    this.el.addClass('sm-hidden')
  }

  /*
    Update and re-position
  */
  _position(hints) {
    if (this.hasActiveTools()) {
      this.el.removeClass('sm-hidden')
      if (hints) {
        let contentWidth = this.el.htmlProp('offsetWidth')
        let selRect = hints.selectionRect
        let innerContentRect = hints.innerContentRect

        // By default, gutter is centered (y-axis) and left of the scrollPane content (x-axis)
        this.el.css('top', selRect.top + selRect.height - selRect.height / 2)
        // Right align to the gutter
        this.el.css('left', innerContentRect.left - contentWidth)
      }
    } else {
      this.el.addClass('sm-hidden')
    }
  }

  /*
    Override if you just want to use a different style
  */
  getToolStyle() {
    return 'outline'
  }

  getClassNames() {
    return 'sc-text-tools'
  }

  getTheme() {
    return 'dark'
  }

  getActiveToolGroupNames() {
    return ['text']
  }

}

/*
  A default implementation to render the content for the overlay (aka popup) tools.
*/
class AnnotationTools extends TextTools {

  getActiveToolGroupNames() {
    return ['annotations']
  }

  _position(hints) {
    if (this.hasActiveTools()) {
      this.el.removeClass('sm-hidden')
      if (hints) {
        let contentWidth = this.el.htmlProp('offsetWidth')
        let selRect = hints.selectionRect
        let innerContentRect = hints.innerContentRect

        // By default, gutter is centered (y-axis) and left of the scrollPane content (x-axis)
        this.el.css('top', selRect.top + selRect.height - selRect.height / 2)
        // left align to the right gutter
        this.el.css('left', hints.contentWidth - innerContentRect.right)
      }
    } else {
      this.el.addClass('sm-hidden')
    }
  }

}

class MinimalEditor extends substance.ProseEditor {

  render($$) {
    let el = $$('div').addClass('sc-minimal-editor')
    let editor = this._renderEditor($$)
    let ScrollPane = this.componentRegistry.get('scroll-pane')
    let Overlay = this.componentRegistry.get('overlay')
    let ContextMenu = this.componentRegistry.get('context-menu')

    let scrollPane = $$(ScrollPane, {
      noStyle: true
    }).append(
      $$('div').addClass('se-minimal-editor-content').append(
        editor
      ),
      // Overlays
      $$(Overlay),
      $$(TextTools),
      $$(AnnotationTools),
      $$(ContextMenu)
    )

    el.append(scrollPane)
    return el
  }

  _renderEditor($$) {
    let configurator = this.getConfigurator()
    return $$(substance.ContainerEditor, {
      disabled: this.props.disabled,
      editorSession: this.editorSession,
      node: this.doc.get('body'),
      commands: configurator.getSurfaceCommandNames(),
      textTypes: configurator.getTextTypes()
    }).ref('body')
  }
}

/*
  Example document
*/
var fixture = function(tx) {
  let body = tx.get('body')
  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc fermentum orci sed interdum porta. Duis nulla tortor, luctus eu enim at, rhoncus rhoncus enim. Donec diam arcu, dapibus id mattis pellentesque, elementum accumsan nisi. In hendrerit, lacus ut sollicitudin placerat, arcu quam sollicitudin tellus, at sodales risus est vel risus. Pellentesque cursus semper ex, eget finibus tellus lacinia at. Phasellus ut metus venenatis, euismod nulla quis, luctus dolor. Integer ornare, lacus ut dignissim laoreet, enim ipsum lobortis arcu, pellentesque vestibulum mi erat quis justo. Aliquam ac nibh sed turpis bibendum semper. Duis dui velit, mattis in ligula non, volutpat porta nulla. Integer non posuere eros, a tincidunt neque. Donec fermentum, est vitae maximus venenatis, tellus magna venenatis nisi, ac scelerisque augue tortor vehicula lacus. Nullam fringilla dictum augue a ullamcorper."
  })
  body.show('p1')
  tx.create({
    id: 'p2',
    type: 'paragraph',
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc fermentum orci sed interdum porta. Duis nulla tortor, luctus eu enim at, rhoncus rhoncus enim. Donec diam arcu, dapibus id mattis pellentesque, elementum accumsan nisi. In hendrerit, lacus ut sollicitudin placerat, arcu quam sollicitudin tellus, at sodales risus est vel risus. Pellentesque cursus semper ex, eget finibus tellus lacinia at. Phasellus ut metus venenatis, euismod nulla quis, luctus dolor. Integer ornare, lacus ut dignissim laoreet, enim ipsum lobortis arcu, pellentesque vestibulum mi erat quis justo. Aliquam ac nibh sed turpis bibendum semper. Duis dui velit, mattis in ligula non, volutpat porta nulla. Integer non posuere eros, a tincidunt neque. Donec fermentum, est vitae maximus venenatis, tellus magna venenatis nisi, ac scelerisque augue tortor vehicula lacus. Nullam fringilla dictum augue a ullamcorper."
  })
  body.show('p2')
}

/*
  Application
*/

let cfg = new substance.ProseEditorConfigurator()
cfg.import(substance.ProseEditorPackage)
cfg.addMacro(substance.HeadingMacro)

window.onload = function() {
  let doc = cfg.createArticle(fixture)
  let editorSession = new substance.EditorSession(doc, {
    configurator: cfg
  })
  MinimalEditor.mount({
    editorSession: editorSession
  }, document.body)
}

})));

//# sourceMappingURL=./app.js.map