var jasmine = require('testing/jasmine');
var ConsoleReporter = require('testing/console_reporter').ConsoleReporter;

var serverInterfaceTests = require('test')

exports['test jasmine'] = function(test) {
  test.pass();
}

var consoleReporter = new ConsoleReporter();
var jasmineEnv = jasmine.getEnv();
jasmineEnv.updateInterval = 250;
jasmineEnv.addReporter(consoleReporter);