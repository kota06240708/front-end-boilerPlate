import conf from './system/config'
import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'

import baseConfig from './webpack.config.base.babel'

const { dist } = conf()

export default merge(baseConfig, {
  output: {
    path: `${path.resolve('')}/${dist}`,
    filename: './script/index.bundle.js',
    publicPath: '/'
  },
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dist')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          'You application is running here http://localhost:8080',
          '`rs` でリロードができます。'
        ]
      },
      onErrors: () => {},
      clearConsole: true
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
