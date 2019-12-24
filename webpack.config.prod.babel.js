import conf from './system/config'
import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'

import baseConfig from './webpack.config.base.babel'

const { dist } = conf()

export default merge(baseConfig, {
  output: {
    path: `${path.resolve('')}/${dist}`,
    filename: './script/index.bundle.js'
  },
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(dist)
    })
  ]
})
