import webpack from 'webpack'
import webpackConfig from '../webpack.config.prod.babel'
import chalk from 'chalk'
import chokidar from 'chokidar'
import glob from 'glob'
import browserSync from 'browser-sync'

import conf from './config'

const { src, jsDir } = conf()

export const relodaJs = () => {
  return new Promise((resolve, reject) => {
    glob(`${src}/**/${jsDir}`, {}, (error, dirs) => {
      if (error) {
        reject()
      }

      dirs.forEach(r => {
        const watcher = chokidar.watch(r)
        resolve()

        watcher
          .on('change', path => {
            browserSync.reload()
          })
          .on('unlink', path => {
            // ファイルが削除された時の処理
            watcher.close() // watchを外す
            console.log(chalk.yellow(`✔︎ Watcher Close ${path}`))
          })
          .on('error', path => {
            watcher.close()
            process.kill(process.pid, 'SIGHUP')
            process.exit(0)
          })
      })
    })
  })
}

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
