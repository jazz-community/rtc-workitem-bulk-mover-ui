const webpack = require('webpack');
const DojoModuleWrapperPlugin = require('dojo-module-wrapper-webpack-plugin');
const JazzUpdateSitePlugin = require('jazz-update-site-webpack-plugin');
const packageJson = require('./package.json');
const glob = require('glob');

const modeConfig = {
   dev: {
      baseUrl: '"http://localhost:8080/resources/ui/"',
   },
   prod: {
      baseUrl: 'net.jazz.ajax._contextRoot + "/web/com.siemens.bt.jazz.ui.WorkItemBulkMover/ui/"',
   },
};

module.exports = (env) => {
   console.info(`Environment is set to '${env.mode}'`); // eslint-disable-line no-console
   env.buildUUID && console.info(`Build UUID is passed along: '${env.buildUUID}'`);

   const mode = modeConfig[env.mode] || modeConfig.dev;
   const version = env.buildUUID || packageJson.version;

   const semanticPattern = glob.sync("./node_modules/semantic-ui-css/components/!(reset)*.min.+(css|js)");

   const config = {
      entry: {
         BulkMover: './src/main',
         Semantic: semanticPattern,
      },
      output: {
         // wrap external dependencies with an AMD loader
         libraryTarget: 'amd',
         filename: 'resources/ui/[name]Bundle.js',
      },
      module: {
         rules: [{
            // include all project css files & Semantic UI, but not anything else from node_modules
            test: /\.css$/,
            include: /node_modules(\/|\\)semantic-ui-css(\/|\\)components/,
            use: [{
               loader: 'style-loader',
            }, {
               loader: 'css-loader',
               options: {import: false},
            }],
         }, {
            // transpile all JS files
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015'],
            },
         }, {
            // integrate all HTML into the JS Bundle
            test: /\.html$/,
            exclude: /node_modules/,
            loader: 'raw-loader',
         }, {
            // compile SASS to css and integrate into JS bundle
            test: /\.scss$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader', 'sassjs-loader'],
         },

         // these entries are nexessary to resolve all semantic UI assets referenced through an @URL statement
         {test:/.png$/,loader:'url-loader',query:{mimetype:'image/png',name:'./node_modules/semantic-ui-css/themes/default/assets/images/flags.png'}},
         {test:/.svg$/,loader:'url-loader',query:{mimetype:'image/svg+xml',name:'./node_modules/semantic-ui-css/themes/default/assets/fonts/icons.svg'}},
         {test:/.woff$/,loader:'url-loader',query:{mimetype:'application/font-woff',name:'./node_modules/semantic-ui-css/themes/default/assets/fonts/icons.woff'}},
         {test:/.woff2$/,loader:'url-loader',query:{mimetype:'application/font-woff2',name:'./node_modules/semantic-ui-css/themes/default/assets/fonts/icons.woff2'}},
         {test:/.[ot]tf$/,loader:'url-loader',query:{mimetype:'application/octet-stream',name:'./node_modules/semantic-ui-css/themes/default/assets/fonts/icons.ttf'}},
         {test:/.eot$/,loader:'url-loader',query:{mimetype:'application/vnd.ms-fontobject',name:'./node_modules/semantic-ui-css/themes/default/assets/fonts/icons.eot'}},
         ],
      },

      resolve: {
         extensions: ['.js'],
         alias: {
            'jquery': 'jquery/dist/jquery.min.js',
            'vue': 'vue/dist/vue.common.js',
         },
      },

      plugins: [
         // make sure that the global use of jQuery (required by Semantic UI) is possible
         new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
         }),

         // modify compiled bundle in a way that Jazz will be able to parse and execute it
         new DojoModuleWrapperPlugin({
            BulkMover: {
               baseUrl: mode.baseUrl,
               moduleName: 'BulkMoverBundle',
            },
         }),

         // if set to production, pack the plugin as Jazz compatible update-site package
         modeConfig.prod && new JazzUpdateSitePlugin({
            appType: 'ccm',
            projectId: 'com.siemens.bt.jazz.ui.WorkItemBulkMover',
            acceptGlobPattern: [
               'resources/**',
               'META-INF/**',
               'plugin.xml',
            ],
            projectInfo: {
               author: packageJson.author,
               copyright: packageJson.author,
               description: packageJson.description,
               license: packageJson.license,
               version: version,
            },
         }),
      ],

      externals: [
         // exclude dojo and dijit from bundling, use dojo and dijit provided by Jazz instead
         (context, request, callback) => {
            if (/^dojo/.test(request) ||
               /^dijit/.test(request) ||
               /^com.ibm.team/.test(request)
            ) {
               return callback(null, `amd ${request}`);
            }
            return callback();
         },
      ],
   };

   return config;
};
