var should = require('should')
var sinon = require('sinon')
var rewire = require("rewire")
var EventEmitter2 = require('eventemitter2').EventEmitter2
var util = require('util')

var renderer = rewire('../lib/renderer/headless.js')

var spookyMock
var spy
var scrapeURL = 'http://example.com'

describe('renderer', function () {
  beforeEach(function () {
    spy=sinon.spy()
    spookyMock = function() {
      EventEmitter2.call(this)
      this.run()
    }
    util.inherits(spookyMock, EventEmitter2)
  })

  it('should emit url rendered with url and body', function (done) {
    spookyMock.prototype.run = function () {
        spooky = this
        console.log('sooky running')
        setTimeout(function() {spooky.emit('pageDownload','body')}, 0)
    }
    renderer.__set__('Spooky', spookyMock)
    var render = new renderer()
    render.on('renderer.urlRendered', spy)
    render.render(scrapeURL)
    setTimeout(() => {
      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, scrapeURL, 'body')
      done()
    },100)
  })

})
