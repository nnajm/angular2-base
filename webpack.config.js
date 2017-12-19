var path    = require('path'),
    webpack = require('webpack'),
    PROD    = process.env.npm_lifecycle_event === 'build',
    // plugins
    CommonsChunkPlugin       = webpack.optimize.CommonsChunkPlugin,
    DefinePlugin             = webpack.DefinePlugin,
    ContextReplacementPlugin = webpack.ContextReplacementPlugin,
    NoEmitOnErrorsPlugin     = webpack.NoEmitOnErrorsPlugin,
    UglifyJsPlugin           = webpack.optimize.UglifyJsPlugin,
    TsConfigPathsPlugin      = require('awesome-typescript-loader').TsConfigPathsPlugin;
    HtmlWebpackPlugin        = require('html-webpack-plugin'),
    CopyWebpackPlugin        = require('copy-webpack-plugin'),
    extractTextPlugin        = require('extract-text-webpack-plugin');

// join and return absolute path
function rootPath(/*path parts*/) {
  return path.join.apply(
    null, 
    [__dirname].concat(Array.prototype.slice.call(arguments, 0))
  );
}

module.exports = {
  devtool: PROD ? 'source-map': 'eval-source-map',
  entry: {
    'polyfills': './src/scripts/polyfills.ts',
    'vendor': './src/scripts/vendor.ts',
    'app': './src/scripts/main.ts' // angular app
  },
  output: {
    path: rootPath('dist'),
    publicPath: PROD ? '/' : 'http://localhost:8080/',
    filename: PROD ? 'js/[name].[hash].js' : 'js/[name].js',
    chunkFilename: PROD ? '[id].[hash].chunk.js' : '[id].chunk.js'
  },
  resolve: {
    // only discover files that have those extensions
    extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
    plugins: [
      new TsConfigPathsPlugin()
    ],
  },
  module: {
    rules: [
      // support for .ts files.
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      },
      // copy those assets to output
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
      },
      // support for *.json files.
      {test: /\.json$/, loader: 'json-loader'},
      // support for CSS as raw text
      // all css in src/styles will be bundled in an external css file
      {
        test: /\.css$/,
        include: rootPath('src', 'styles'),
        loader: extractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader']})
      },
      // all css required in src/scripts files will be merged in js files
      {
        test: /\.css$/, 
        include: rootPath('src', 'scripts'), 
        loader: 'raw-loader'
      },
      // support for .scss files
      // all css in src/styles will be bundled in an external css file
      {
        test: /\.(scss|sass)$/,
        include: rootPath('src', 'styles'),
        loader: extractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader']})
      },
      // all css required in src/scripts files will be merged in js files
      {
        test: /\.(scss|sass)$/, 
        include: rootPath('src', 'scripts'), 
        loader: 'raw-loader!sass-loader'
      },
      // support for .html as raw text
      {
        test: /\.html$/, 
        loader: 'raw-loader',  
        exclude: rootPath('src', 'public')
      }
    ]
  },
  plugins: [
    // define env variables to help with builds
    new DefinePlugin({
      'process.env': {
        PROD: PROD
      }
    }),
    // workaround needed for angular 2 angular/angular#11580
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /(.+)?angular(\\|\/)core(.+)?/,
      rootPath('src', 'scripts') // location of your src
    ),
    // generate common chunks if necessary
    new CommonsChunkPlugin({
      name: ['vendor', 'polyfills']
    }),
    // inject script and link tags into html files
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      chunksSortMode: 'dependency'
    }),    
    // extract css files
    // Disabled when in test mode or not in build mode
    new extractTextPlugin({filename: 'css/[name].[hash].css', disable: !PROD})
  ],

  // dev server configuration
  devServer: {
    contentBase: './src/public',
    historyApiFallback: true,
    quiet: true,
    stats: 'minimal',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}

 // PROD (build) specific plugins
 if (PROD) {
  module.exports.plugins.push(
    // only emit files when there are no errors
    new NoEmitOnErrorsPlugin(),
    // minify all javascript, switch loaders to minimizing mode
    new UglifyJsPlugin({sourceMap: true, mangle: { keep_fnames: true }}),
    // copy assets from the public folder
    new CopyWebpackPlugin([{
      from: rootPath('src', 'public')
    }])
  );
}

