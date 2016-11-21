var b = require('substance-bundler');
var fs = require('fs')

var examples = [
  'math-editor',
  'code-editor',
  'collab-writer',
  'focused',
  'form',
  'hybrid-inline',
  'image',
  'inception',
  'inline-node',
  'input',
  'macros',
  'nested',
  'minimal'
]

b.task('clean', function() {
  b.rm('./dist')
})

b.task('substance', function() {
  b.make('substance', 'clean', 'browser')
})

b.task('substance:pure', function() {
  b.make('substance', 'clean', 'browser:pure')
})

b.task('assets', function() {
  b.copy('node_modules/font-awesome', './dist/lib/font-awesome')
  b.copy('node_modules/ace-builds/src', './dist/lib/ace')
  b.copy('node_modules/substance/dist', './dist/lib/substance')
  b.copy('node_modules/mathquill/build', './dist/mathquill')
  b.copy('node_modules/jquery/dist', './dist/jquery')
  b.copy('./index.html', './dist/')
})

b.task('examples', function() {
  examples.forEach(function(name) {
    _example(name, true)
  })
})

b.task('examples:pure', function() {
  examples.forEach(function(name) {
    _example(name, false)
  })
})

examples.forEach(function(name) {
  b.task('dev:'+name, ['substance:pure', 'assets'], function() {
    _example(name, false)
  })

  b.task(name, ['substance', 'assets'], function() {
    _example(name, true)
  })
})

// Used for deployment (transpiled js and css)
b.task('default', ['clean', 'substance', 'assets', 'examples'])

// Used for development (native js + css)
b.task('dev', ['clean', 'substance:pure', 'assets', 'examples:pure'])

// starts a server when CLI argument '-s' is set
b.setServerPort(5555)
b.serve({
  static: true, route: '/', folder: 'dist'
})

// builds one example
function _example(name, legacy) {
  const src = './'+name+'/'
  const dist = './dist/'+name+'/'
  if (fs.existsSync(src+'assets')) {
    b.copy(src+'assets', dist+'assets')
  }
  b.copy(src+'index.html', dist)
  b.css(src+'app.css', dist+'app.css', { variables: legacy })
  b.js(src+'app.js', {
    buble: legacy,
    commonjs: { include: ['/**/lodash/**'] },
    external: ['substance'],
    targets: [{
      useStrict: !legacy,
      dest: dist+'app.js',
      format: 'umd', moduleName: 'example'+name
    }]
  })
}
