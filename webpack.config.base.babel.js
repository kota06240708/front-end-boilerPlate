import conf from './system/config'
import glob from 'glob'

const entries = []

const { src, jsDir } = conf()

glob
  .sync(`./${src}/**/${jsDir}`, {
    ignore: `./${src}/**/_${jsDir}`
  })
  .map(file => entries.push(file))

export default {
  entry: entries,

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.(vert|frag|glsl)$/i,
        use: [{ loader: 'raw-loader' }, { loader: 'glslify-loader' }],
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
  // jsを複数を使う時に使う。
  // optimization: {
  //   splitChunks: {
  //     name: 'sheard/scripts/vendor.js',
  //     chunks: 'initial'
  //   }
  // },
}
