export default {

  type: 'math',
  tagName: 'span',

  /**
    Custom matcher, needed as matching by tagName is not sufficient
  */
  matchElement: function(el) {
    return el.is('span[data-type="math"]')
  },

  /**
    Extract math string from the data-math attribute
  */
  import: function(el, node) {
    node.content = el.attr('data-math')
  },

  /**
    Serialize math node to span with data-type and data-math
    attributes.
  */
  export: function(node, el) {
    el.attr({
      'data-type': 'math',
      'data-math': node.content
    }.append(node.content))
  }
}
