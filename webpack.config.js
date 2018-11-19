const webpack = require('webpack');
const JazzUpdateSitePlugin = require('jazz-update-site-webpack-plugin');
const packageJson = require('./package.json');
const glob = require('glob');

module.exports = (env) => {
   env && env.buildUUID && console.info(`Build UUID is passed along: '${env.buildUUID}'`);

   const version = env && env.buildUUID || packageJson.version;

   const semanticPattern = glob.sync("./node_modules/semantic-ui-css/components/!(reset|site)*.min.+(css|js)");

   const config = {
      entry: {
         BulkMover: ['@babel/polyfill', './src/main'],
         Semantic: semanticPattern,
      },
      output: {
         // wrap external dependencies with an AMD loader
         libraryTarget: 'umd',
         path: __dirname,
         filename: 'resources/ui/[name]Bundle.js',
      },
      module: {
         rules: [{
            // integrate all component CSS files into JS bundle
            test: /\.css$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader'],
         },{
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
               presets: ['@babel/preset-env'],
            },
         }, {
            // integrate all HTML into the JS Bundle
            test: /\.html$/,
            exclude: /node_modules/,
            loader: 'raw-loader',
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

         // if set to production, pack the plugin as Jazz compatible update-site package
         new JazzUpdateSitePlugin({
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

         new JazzUpdateSitePlugin({
            appType: 'ccm',
            projectId: 'com.siemens.bt.jazz.ui.WorkItemBulkMover.menuProvider',
            pluginBasePath: 'integration/menuProvider/',
            acceptGlobPattern: [
               'integration/menuProvider/resources/**',
               'integration/menuProvider/META-INF/**',
               'integration/menuProvider/plugin.xml',
               'integration/menuProvider/plugin.properties',
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
   };

   return config;
};
