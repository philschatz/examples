(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('substance')) :
  typeof define === 'function' && define.amd ? define(['substance'], factory) :
  (factory(global.substance));
}(this, (function (substance) { 'use strict';

const collabWriterConfig = {
  name: 'collab-writer',
  configure: function(config) {
    config.import(substance.ProseEditorPackage)
    // TODO: Add custom tools
    // config.addTool...
  }
}

var configurator = new substance.ProseEditorConfigurator().import(collabWriterConfig)

class Client extends substance.Component {
  constructor(...args) {
    super(...args)

    this.doc = configurator.createArticle(substance.twoParagraphs)

    if (!this.props.connection) {
      throw new Error("'connection' is required.");
    }

    this.collabClient = new substance.CollabClient({
      connection: this.props.connection
    });

    // CollabSession expects a connected and authenticated collabClient
    this.session = new substance.TestCollabSession(this.doc, {
      configurator: configurator,
      collabClient: this.collabClient,
      documentId: 'test-doc',
      version: 0,
      logging: true,
      autoSync: true
    });
  }

  didMount() {
    this.refs.editor.refs.body.selectFirst();
  }

  render($$) {
    var el = $$('div').addClass('sc-client').addClass('sm-'+this.props.userId);
    var editor = $$(substance.ProseEditor, {
      disabled: this.props.disabled,
      editorSession: this.session
    }).ref('editor');
    if (this.props.disabled) {
      el.append(
        $$('div').addClass('se-blocker')
          .on('mousedown', this.onMousedown)
      );
    }
    el.append(editor)
    return el
  }

  onMousedown(e) {
    e.stopPropagation()
    e.preventDefault()
    this.send('switchUser', this.props.userId)
  }
}

/*
  App
*/
class App extends substance.Component {

  constructor(...args) {
    super(...args)

    this.documentStore = new substance.DocumentStore().seed(substance.documentStoreSeed)
    this.changeStore = new substance.ChangeStore().seed(substance.changeStoreSeed)
    this.documentEngine = new substance.DocumentEngine({
      documentStore: this.documentStore,
      changeStore: this.changeStore,
      schemas: {
        'prose-article': {
          name: 'prose-article',
          version: '1.0.0',
          documentFactory: substance.createTestDocumentFactory(substance.twoParagraphs)
        }
      }
    })
    this.messageQueue = new substance.MessageQueue()
    this.wss = new substance.TestWebSocketServer({
      messageQueue: this.messageQueue,
      serverId: 'hub'
    })
    this.collabServer = new substance.TestCollabServer({
      documentEngine: this.documentEngine
    })
    this.collabServer.bind(this.wss);

    this.conn1 = new substance.TestWebSocketConnection({
      messageQueue: this.messageQueue,
      clientId: 'user1',
      serverId: 'hub',
    })
    this.conn2 = new substance.TestWebSocketConnection({
      messageQueue: this.messageQueue,
      clientId: 'user2',
      serverId: 'hub'
    })

    this.messageQueue.flush()
    this.messageQueue.start()
    this.handleAction('switchUser', this.switchUser)
  }

  render($$) {
    var el = $$('div').addClass('sc-two-editors')
    el.append(
      $$(substance.SplitPane, {
        splitType: 'vertical',
        sizeA: '50%'
      }).append(
        $$(Client, {
          userId: 'user1',
          connection: this.conn1
        }).ref('user1'),
        $$(Client, {
          userId: 'user2',
          connection: this.conn2,
          disabled: true
        }).ref('user2')
      )
    )
    return el;
  }

  // enables the editor for user1 and disables the other
  // Note: being in one DOM it doesn't work to have two
  // active editors at the same time
  switchUser(userId) {
    if (userId === 'user1') {
      this.refs.user1.extendProps({ disabled: false })
      this.refs.user2.extendProps({ disabled: true })
    } else if (userId === 'user2') {
      this.refs.user1.extendProps({ disabled: true })
      this.refs.user2.extendProps({ disabled: false })
    }
  }
}

window.onload = function() {
  App.mount({}, document.body)
}

})));

//# sourceMappingURL=./app.js.map