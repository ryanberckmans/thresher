var EventEmitter2 = require('eventemitter2').EventEmitter2
var util = require('util')

var Nightmare = require('nightmare')

var HeadlessRenderer = function() {
  EventEmitter2.call(this, {
    wildcard: true,
    maxListeners: 0
  });
};
util.inherits(HeadlessRenderer, EventEmitter2);

HeadlessRenderer.prototype.render = function (scrapeUrl) {
  renderer = this
  nightmare = Nightmare();
  nightmare.goto(scrapeUrl).evaluate(function () {
    return document.documentElement.outerHTML
  })
  .end()
  .then(function (outerHTML) {
    renderer.emit('renderer.urlRendered', scrapeUrl, outerHTML)
  })
  .catch(function (error) {
    renderer.emit(renderer.error, error)
  })
}


module.exports = HeadlessRenderer;
