import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import glob from 'glob'
import moment from 'moment'

import sass from 'node-sass'
import postcss from 'postcss'

import conf from './config'
import writeFile from './config/util/writefile'
import postcssConf from '../postcss.config'

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
const postCssRender = keydata => {
  return new Promise((resolve, reject) => {
    const { plugins, from, to } = keydata.config

    fs.readFile(keydata.targetFile, (err, css) => {
      if (err) {
        console.error(
          chalk.red(`✖︎ postcss render Error ${keydata.targetFile})`)
        )
        return
      }

      postcss(plugins)
        .process(css, { from, to })
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
        // sassをレンダリング
        const getsSassRender = await sassRender(
          `${path.join(process.cwd(), entry, 'index.scss')}`
        )

        // sass -> css
        await writeFile(out, getsSassRender)

        const config = postcssConf(out, out)

        // 吐き出されたcssをpostcssに通す
        const getpostCssRender = await postCssRender({
          config,
          targetFile: out
        })

        await writeFile(out, getpostCssRender)

        resolve()
      } catch {
        reject()
      }
    }

    return onResult()
  })
}

// ここから処理を開始
const onInitRender = () => {
  return new Promise((resolve, reject) => {
    fs.access(distPath, error => {
      if (error) {
        fs.mkdirSync(distPath) // ない場合フォルダーを作成
      }

      glob(`${src}/**/${cssDir}`, {}, (error, dirs) => {
        if (error) {
          console.error(chalk.red(error.message))
          return
        }

        dirs.forEach(entry => {
          const entryDir = entry.replace(new RegExp('src/'), '') // srcを削除したパス
          const distFile = `${path.join(distPath, entryDir)}/index.css` // 吐き出すパス

          console.log(entry)

          onRender(entry, distFile)
            .then(() => {
              console.log(chalk.green(`✔︎ build Style ${distFile}`))

              resolve()

              if (isLocal) {
                // watch
                const watcher = chokidar.watch(entry)

                watcher
                  .on('change', path => {
                    ;(async () => {
                      const compileStartTime = moment()

                      await onRender(entry, distFile) // cssレンダリング

                      const diff = moment().diff(compileStartTime) // レンダリングの時間を取得

                      console.log(
                        chalk.green(`✔︎ Compiled Style ${path} (${diff}ms)`)
                      )
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
      })
    })
  })
}

export default onInitRender
