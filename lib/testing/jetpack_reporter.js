var JetpackReporter = function() {};

JetpackReporter.prototype = {
  reportRunnerStarting: function() {
    console.log('Jetpack runner starting!');
  },
  reportRunnerResults: function(results) {
    console.log('Jetpack runner results: ', JSON.stringify(results));
  },
  reportSuiteResults: function(suite) {
    console.log('Jetpack runner suite results: ', suite.results());
  },
  reportSpecStarting: function(spec) {
    console.log('Jetpack runner spec starting: ', JSON.stringify(spec));
  }
}