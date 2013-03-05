// Testacular configuration


// base path, we are in /test/ go back one folder to the prjects root
basePath = ".";


// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  // Include aria templates and serve packages
  {pattern: "node_modules/ariatemplates/src/aria/bootstrap.js", watched: false, included: true},
  {pattern: "node_modules/ariatemplates/src/aria/**/*", watched: false, included: false},
  // Include the skin
  {pattern: "node_modules/ariatemplates/src/aria/css/*.js", watched: false, included: true},

  // Include lib files, they redefine some classes for unit testing
  {pattern: "lib/**/*.js", watched: true, included: true},
  // Interface to convert Aria Templates tests into Mocha
  "interface.js",

  // Add expect.js to have assertions
  {pattern: "node_modules/expect.js/expect.js", watched: false, included: true},

  // Include all test files
  "test/**/*.js"
];


// list of files to exclude
exclude = [
  "test/testacular.conf.js"
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ["dots"];


// web server port
port = 8080;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ["PhantomJS"];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
