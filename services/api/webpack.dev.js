/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Example using fork-ts-checker-webpack which speeds up compile time, but
 * typeorm stop works.
 *
 * Details here:
 * https://dev.azure.com/DataTorchio/DataTorch/_workitems/edit/285/
 */

const path = require('path')
const nodeExternals = require('webpack-node-externals')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  mode: 'development',
  node: { __dirname: true },
  watch: true,
  stats: 'errors-warnings',
  optimization: {
    minimize: false
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'this'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      },
      {
        test: /node_modules\/bullmq\/lib\/commands\/index\.js$/,
        use: {
          loader: 'string-replace-loader',
          options: {
            search: '__dirname',
            replace: `"${path.dirname(require.resolve('bullmq'))}/lib/commands"`
          }
        }
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json'),
        extensions: ['.ts', '.tsx', '.js']
      })
    ]
  },
  plugins: [new ForkTsCheckerWebpackPlugin(), new NodemonPlugin()],
  externals: [
    nodeExternals({
      additionalModuleDirs: [path.resolve(__dirname, '../../node_modules')]
    })
  ]
}
