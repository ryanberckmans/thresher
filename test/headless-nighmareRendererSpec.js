var should = require('should')
var sinon = require('sinon')
var rewire = require("rewire")
var EventEmitter2 = require('eventemitter2').EventEmitter2
var util = require('util')

var renderer = rewire('../lib/renderer/headless-nightmare.js')
