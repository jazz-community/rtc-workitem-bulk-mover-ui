module.exports = function (config) {
   config.set({
      // Those browsers will used for test execution
      // requires 'karma-<browser>-launcher' npm package to be installed
      // for native (non phantom js) browsers, the browser has to be installed locally
      browsers: ['PhantomJS', 'Chrome', 'Firefox'],
      // the unit testing framework to be used
      frameworks: ['jasmine'],
      // the files karma will lock at
      files: ['src/**/*.test.js'],
      // defines how the test results are reported
      reporters: ['spec'],
      // transpile source and test files, allows usage of latest
      // JS features in both test files and files under test
      preprocessors: {
         'src/**/*.js': ['webpack']
      },
      // end all browser sessions and test run after a single run
      singleRun: true,
      // use webpack combined with babel to transpile the source
      webpack: {
         module: {
            loaders: [
               {
                  test: /\.js$/,
                  loader: 'babel-loader',
                  exclude: /node_modules/,
                  query: {
                     presets: ['env'],
                  }
               }
            ]
         }
      },

      webpackMiddleware: {
         // suppress webpack compilation and chunking output
         noInfo: true
      }
   });
};
