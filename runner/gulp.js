/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var chalk  = require('chalk');
var events = require('events');

var CleanKill   = require('./cleankill');
var CliReporter = require('./clireporter');
var config      = require('./config');
var steps       = require('./steps');

function init(gulp) {
  var emitter = new events.EventEmitter();
  var options = config.mergeDefaults(config.fromEnv(process.env, process.argv));
  new CliReporter(emitter, options.output, options);

  var spinRun  = endRun.bind(null, emitter, true);
  var cleanRun = endRun.bind(null, emitter, false);

  gulp.task('wct:sauce-tunnel', function(done) {
    steps.ensureSauceTunnel(options, emitter, spinRun(done));
  });

  gulp.task('test:local', function(done) {
    options.remote = false;
    steps.runTests(options, emitter, cleanRun(done));
  });

  gulp.task('test:remote', function(done) {
    options.remote = true;
    steps.runTests(options, emitter, cleanRun(done));
  });

  gulp.task('test', ['test:local']);
}

// Utility

function endRun(emitter, spin, done) {
  return function(error) {
    // Many of our tasks should spin indefinitely ...unless they encounter an error.
    if (error || !spin) {
      // Pretty error for gulp.
      var cleanError = new Error(chalk.red(error.message || error));
      cleanError.showStack = false;

      CleanKill.close(done.bind(null, cleanError));
    }
  }
}

// Exports

module.exports = {
  init: init,
};
