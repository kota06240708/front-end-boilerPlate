import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import glob from 'glob'
import moment from 'moment'
import browserSync from 'browser-sync'

import sass from 'node-sass'
import postcss from 'postcss'

import conf from './config'
import writeFile from './config/util/writefile'
import postcssConf from '../postcss.config'
import postScss from 'postcss-scss'

const { src, distPath, cssDir, isLocal } = conf()

// sassのレンダリング
const sassRender = file => {
  return new Promise((resolve, reject) => {
    sass.render({ file }, (err, result) => {
      if (err) {
        console.error(chalk.red(`✖︎ sass render Error ${file})`))
        console.error(chalk.red(err))
        return
      }

      resolve(result.css)
    })
  })
}

/**
 * @param {Keydata} keydata 必須引数
 * @return {Promise} resolveの場合は変換後のCSSの文字列を返す
 */
const postCssRender = (keydata, isLint = false) => {
  return new Promise((resolve, reject) => {
    const { plugins, from, to, stylelint } = keydata.config

    fs.readFile(keydata.targetFile, (err, css) => {
      if (err) {
        console.error(
          chalk.red(`✖︎ postcss render Error ${keydata.targetFile})`)
        )
        return
      }

      const params = isLint ? { from, syntax: postScss } : { from, to }

      postcss(isLint ? stylelint : plugins)
        .process(css, params)
        .then(
          result => {
            resolve(result.css)
          },
          error => {
            reject(error)
          }
        )
    })
  })
}

// レンダリングの処理
const onRender = (entry, out) => {
  return new Promise((resolve, reject) => {
    const onResult = async () => {
      try {
        let config = postcssConf(entry, entry)

        await postCssRender(
          {
            config,
            targetFile: entry
          },
          true
        )

        // sassをレンダリング
        const getsSassRender = await sassRender(
          `${path.join(process.cwd(), entry)}`
        )

        // sass -> css
        await writeFile(out, getsSassRender)

        config = postcssConf(out, out)

        // 吐き出されたcssをpostcssに通す
        const getpostCssRender = await postCssRender({
          config,
          targetFile: out
        })

        await writeFile(out, getpostCssRender)

        console.log(chalk.green(`✔︎ build style ${out}`))

        resolve()
      } catch {
        reject()
      }
    }

    return onResult()
  })
}

const onInitRender = () => {
  return new Promise((resolve, reject) => {
    glob(
      `${src}/**/${cssDir}`,
      {
        ignore: `${src}/**/_${cssDir}`
      },
      (error, dirs) => {
        let count = 0 // レンダリングした数をカウント

        if (error) {
          console.error(chalk.red(error.message))
          return
        }

        dirs.forEach(entry => {
          const result = entry.split('/')
          result.pop()

          let parentDirs = result.join('/')
          parentDirs = parentDirs.replace(new RegExp('src/'), '') // srcを削除したパス

          const distFile = `${path.join(distPath, parentDirs)}/index.css` // 吐き出すパス

          onRender(entry, distFile)
            .then(() => {
              count++

              if (count >= dirs.length) {
                resolve()
              }

              if (isLocal) {
                // watch
                const watcher = chokidar.watch(entry)

                watcher
                  .on('change', path => {
                    ;(async () => {
                      const compileStartTime = moment()

                      await onRender(path, distFile) // cssレンダリング

                      const diff = moment().diff(compileStartTime) // レンダリングの時間を取得

                      console.log(
                        chalk.green(`✔︎ Compiled Style ${path} (${diff}ms)`)
                      )

                      browserSync.reload()
                    })()
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
              }
            })
            .catch(err => {
              console.log(chalk.red(`✖︎ error Style ${distFile}`))
              console.error(chalk.red(err))
              watcher.close()
              reject()
            })
        })
      }
    )
  })
}

export default onInitRender
