import conf from './config'

import browserSync from 'browser-sync'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from '../webpack.config.dev.babel'

const { src, dist } = conf()

const defaultStatsOptions = {
  colors: true,
  hash: false,
  timings: false,
  chunks: false,
  chunkModules: false,
  modules: false,
  children: true,
  version: true,
  cached: true,
  cachedAssets: true,
  reasons: true,
  source: true,
  errorDetails: true
}

const bundle = webpack(webpackConfig)

const onInitBrowser = () => {
  return browserSync({
    notify: false,
    port: 8080,
    open: false,
    reloadOnRestart: true,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    },
    server: {
      baseDir: [src, dist],
      middleware: [
        webpackDevMiddleware(bundle, {
          publicPath: webpackConfig.output.publicPath,
          stats: defaultStatsOptions
        }),
        webpackHotMiddleware(bundle)
      ]
    }
  })
}

export default onInitBrowser
