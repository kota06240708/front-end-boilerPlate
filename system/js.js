import webpack from 'webpack'
import webpackConfig from '../webpack.config.prod.babel'
import chalk from 'chalk'

const onInitRender = () => {
  return new Promise(resolve => {
    const webpackSetting = webpack(webpackConfig)
    webpackSetting.run((err, stats) => {
      if (err) {
        throw new Error('webpack build failed')
      }
      const log = stats.toString({
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: true,
        chunkModules: false
      })

      chalk.green(`✔︎ Compiled Script ${log}`)
    })

    resolve()
  })
}

export default onInitRender
