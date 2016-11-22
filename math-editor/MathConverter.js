export default {

  type: 'math',
  tagName: 'span',

  /**
    Custom matcher, needed as matching by tagName is not sufficient
  */
  matchElement: function(el) {
    return el.is('div[data-math]')
  },

  /**
    Extract math string from the data-math attribute
  */
  import: function(el, node) {
    // node.content = el.attr('data-math') || el.textContent
    node.source = el.attr('data-math') || el.textContent
    node.language = el.attr('data-lang') || 'text/tex'
  },

  /**
    Serialize math node to span with data-type and data-math
    attributes.
  */
  export: function(node, el) {
    el.attr({
      'data-type': 'math',
      'data-math': node.source,
      'data-lang': node.language,
    }).append(node.source)
  }
}
