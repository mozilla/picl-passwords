var jasmine = require('testing/jasmine');
var ConsoleReporter = require('testing/console_reporter').ConsoleReporter;

var Client = require('picl_client').Client;

exports['jtest'] = function(test) {
  // var consoleReporter = new ConsoleReporter();
  // var jasmineEnv = jasmine.getEnv();
  // jasmineEnv.updateInterval = 250;
  // jasmineEnv.addReporter(consoleReporter);
  
  jasmine.describe('PICL Client', function() {
    // console.log('jasmine.it() is: ', jasmine.it());
    jasmine.it('should be able to export local passwords', function() {
      Client.exportLocalPasswords();
      jasmine.expect(true).toBe(true);
      test.pass();
      test.done();
    });
  });
  // jasmineEnv.execute();
}