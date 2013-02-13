var jasmine = require('testing/jasmine');
var ConsoleReporter = require('testing/console_reporter').ConsoleReporter;
var ServerInterface = require('picl');


exports['jtest'] = function(test) {

  var consoleReporter = new ConsoleReporter();
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 250;
  jasmineEnv.addReporter(consoleReporter);
  
  jasmine.describe('getPasswords', function() {
    // console.log('jasmine.it() is: ', jasmine.it());
    jasmine.it('should get the passwords', function() {
      jasmine.expect(true).toBe(true);
      test.pass();
      test.done();
    });
  });
  
  jasmineEnv.execute();
}
