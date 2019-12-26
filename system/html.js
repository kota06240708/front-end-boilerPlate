import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import glob from 'glob'
import moment from 'moment'

import gulp from 'gulp'
import pugLinter from 'gulp-pug-linter'
import pugLintStylish from 'puglint-stylish'
import Pug from 'pug'
import browserSync from 'browser-sync'

import conf from './config'
import writeFile from './config/util/writefile'

const { src, distPath, htmlDir, isLocal } = conf()

// puglint
const onPugLint = () => {
  return gulp.src(`./${src}/**/${htmlDir}`).pipe(
    pugLinter({
      reporter: pugLintStylish
    })
  )
}

/**
 * レンダリング処理
 * @param {string} entry 読み取り先のpath
 * @param {string} out  吐き出し先のpath
 */
const onRender = (entry, out) => {
  return new Promise((resolve, reject) => {
    fs.readFile(entry, (err, html) => {
      if (err) {
        return
      }

      const regex = /\/$/
      const isSlash = regex.test(out) // 末尾にスラッシュがあるか確認

      const distFile = isSlash
        ? `${path.join(distPath, out)}index.html`
        : `${path.join(distPath, out)}/index.html` // 吐き出すパス

      onPugLint()

      Pug.render(
        html,
        {
          pretty: true,
          cache: false
        },
        (err, data) => {
          if (err) {
            console.error(chalk.red(`✖︎ pug render Error ${entry})`))
            console.error(chalk.red(err))
            reject()
            return
          }

          console.log(chalk.green(`✔︎ build template ${distFile}`))
          writeFile(distFile, data)
          resolve()
        }
      )
    })
  })
}

const onInitRender = () => {
  return new Promise(resolve => {
    glob(
      `${src}/**/${htmlDir}`,
      { ignore: `${src}/**/_${htmlDir}` },
      (error, dirs) => {
        let count = 0 // レンダリングした数をカウント

        dirs.forEach(r => {
          const result = r.split('/')
          result.pop()

          let parentDirs = result.join('/')
          parentDirs = parentDirs.replace(new RegExp('src/'), '') // srcを削除したパス
          parentDirs = parentDirs.replace(new RegExp('template'), '') // templateを削除

          onRender(r, parentDirs).then(() => {
            count++

            if (count >= dirs.length) {
              resolve()
            }

            if (isLocal) {
              // watch
              const watcher = chokidar.watch(r)

              watcher
                .on('change', path => {
                  const compileStartTime = moment()

                  onRender(path, parentDirs).then(() => {
                    const diff = moment().diff(compileStartTime) // レンダリングの時間を取得
                    browserSync.reload()
                    console.log(
                      chalk.green(`✔︎ Compiled Pug ${path} (${diff}ms)`)
                    )
                  })
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
        })
      }
    )
  })
}

export default onInitRender
