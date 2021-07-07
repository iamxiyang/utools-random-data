const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  mode: 'development',
  entry: './src/preload.ts',
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, './dist')
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [new CopyPlugin({
    patterns: [
      {
        from: resolve('src/static'),
        to: 'dist/static'
      },
      {
        from: resolve('src/plugin.json'),
        to: 'dist/plugin.json'
      },
    ],
  }),],
}