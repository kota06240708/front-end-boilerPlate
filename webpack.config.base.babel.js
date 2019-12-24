import conf from './system/config'
import glob from 'glob'

const entries = []

const { src, jsDir } = conf()

console.log(`./${src}/**/${jsDir}`)

glob
  .sync(`./${src}/**/${jsDir}`, {
    ignore: `./${src}/**/_${jsDir}`
  })
  .map(file => {
    console.log(file)
    return entries.push(file)
  })

export default {
  entry: entries,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(vert|frag|glsl)$/i,
        use: [{ loader: 'raw-loader' }, { loader: 'glslify-loader' }],
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      }
    ]
  }
  // jsを複数を使う時に使う。
  // optimization: {
  //   splitChunks: {
  //     name: 'sheard/scripts/vendor.js',
  //     chunks: 'initial'
  //   }
  // },
}
