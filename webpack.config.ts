import * as path from 'path';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default ({
  mode,

  entry: './src/client/index.tsx',
  
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist'),
  },
  
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([{
      context: path.join(__dirname, './src/client'),
      from: 'index.html',
    }, {
      context: path.join(__dirname, './src/client'),
      from: 'assets/**/*.*',
    }]),
  ],
});