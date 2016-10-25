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
    },10)
  })

  it('should emit err when 404', function (done) {
    spookyMock.prototype.run = function () {
        spooky = this
        setTimeout(function() {spooky.emit('404','Error Message', 'Error trace')}, 0)
    }
    renderer.__set__('Spooky', spookyMock)
    var render = new renderer()
    render.on('renderer.error', spy)
    render.render(scrapeURL)
    var expectedError = new Error('Error Message')
    expectedError.stack = 'Error trace'
    setTimeout(() => {
      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, expectedError)
      done()
    },10)
  })

  it('should emit error when resourceTimeout', function (done) {
    spookyMock.prototype.run = function () {
        spooky = this
        setTimeout(function() {spooky.emit('resourceTimeout', 'code','string', 'url')}, 0)
    }
    renderer.__set__('Spooky', spookyMock)
    var render = new renderer()
    render.on('renderer.error', spy)
    render.render(scrapeURL)
    var expectedError = new Error('code string - url')
    setTimeout(() => {
      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, expectedError)
      done()
    },10)
  })

  it('should emit phantomLog when console', function (done) {
    spookyMock.prototype.run = function () {
        spooky = this
        setTimeout(function() {spooky.emit('console', 'some log message')}, 0)
    }
    renderer.__set__('Spooky', spookyMock)
    var render = new renderer()
    render.on('renderer.phantomLog', spy)
    render.render(scrapeURL)
    setTimeout(() => {
      sinon.assert.calledOnce(spy)
      done()
    },10)
  })

  it('shouldn\'t emit phantomLog when log and log.space isn\'t remote', function (done) {
    spookyMock.prototype.run = function () {
        spooky = this
        var log = {}
        log.space = 'not remote'
        setTimeout(function() {spooky.emit('log', log)}, 0)
    }
    renderer.__set__('Spooky', spookyMock)
    var render = new renderer()
    render.on('renderer.phantomLog', spy)
    render.render(scrapeURL)
    setTimeout(() => {
      sinon.assert.notCalled(spy)
      done()
    },10)
  })

  it('should emit phantomLog when log and log.space is remote', function (done) {
    spookyMock.prototype.run = function () {
        spooky = this
        var log = {}
        log.space = 'remote'
        log.message = 'special message'
        setTimeout(function() {spooky.emit('log', log)}, 0)
    }
    renderer.__set__('Spooky', spookyMock)
    var render = new renderer()
    render.on('renderer.phantomLog', spy)
    render.render(scrapeURL)
    setTimeout(() => {
      sinon.assert.calledOnce(spy)
      done()
    },10)
  })

  it('should emit error when error', function (done) {
    spookyMock.prototype.run = function () {
        spooky = this
        var err = new Error('error message')
        setTimeout(function() {spooky.emit('error', err)}, 0)
    }
    renderer.__set__('Spooky', spookyMock)
    var render = new renderer()
    render.on('renderer.error', spy)
    render.render(scrapeURL)
    var expectedError = new Error('error message')
    setTimeout(() => {
      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, expectedError)
      done()
    },10)
  })

})
