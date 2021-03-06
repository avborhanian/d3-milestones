const buble = require('rollup-plugin-buble');
const tapSpec = require('tap-spec');
const { eslint } = require('rollup-plugin-eslint');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = (config) => {
  const configuration = {
    autoWatch: true,
    // client: { captureConsole: false },
    browsers: [ 'Chrome' ],
    browserConsoleLogOptions: {
      level: 'error',
      format: '%b %T: %m',
      terminal: false
    },
    colors: true,
    files: [
      'build/d3-milestones.css',
      'build/tape.js',
      'test/*-test.js'
    ],
    frameworks: ['tap'],
    // logLevel: 'LOG_DEBUG',
    logLevel: config.LOG_ERROR,
    plugins: [
      'karma-rollup-preprocessor',
      'karma-tap',
      'karma-tap-pretty-reporter',
      'karma-chrome-launcher'
    ],
    preprocessors: {
      'test/*-test.js': [ 'rollup' ]
    },
    reporters: ['tap-pretty'],
    rollupPreprocessor: {
      // context: 'this',
      external: ['tape'],
      output: {
        format: 'iife',
        globals: {
          'tape': 'tape'
        },
        sourcemap: false // 'inline'
      },
      plugins: [
        eslint({
          exclude: [
            'src/styles/**',
          ]
        }),
        nodeResolve(),
        buble()
      ]
    },
    singleRun: true,
    tapReporter: {
      prettify: tapSpec
    }
  };

  if (process.env.TRAVIS) {
    configuration.autoWatch = false;
    configuration.browsers = ['Chrome_travis_ci'];

    configuration.customLaunchers = {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    configuration.singleRun = true;

    // Concurrency level
    // how many browser should be started simultaneous
    configuration.concurrency = Infinity;
  }

  config.set(configuration);
};
