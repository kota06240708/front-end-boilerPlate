import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import glob from 'glob'
import moment from 'moment'

import Pug from 'pug'

import conf from './config'
import writeFile from './config/util/writefile'

const { src, distPath, htmlDir, isLocal } = conf()

const onRender = (entry, out) => {
  fs.readFile(entry, (err, html) => {
    if (err) {
      return
    }

    const distFile = `${path.join(distPath, out)}/index.html` // 吐き出すパス

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
          return
        }

        writeFile(distFile, data)
      }
    )
  })
}

const onInitRender = () => {
  return new Promise(resolve => {
    fs.access(distPath, error => {
      if (error) {
        fs.mkdirSync(distPath) // ない場合フォルダーを作成
      }

      glob(`${src}/**/${htmlDir}`, {}, (error, dirs) => {
        dirs.forEach(r => {
          const result = r.split('/')
          result.pop()

          let parentDirs = result.join('/')
          parentDirs = parentDirs.replace(new RegExp('src/'), '') // srcを削除したパス
          parentDirs = parentDirs.replace(new RegExp('template'), '') // templateを削除

          onRender(r, parentDirs)

          if (isLocal) {
            // watch
            const watcher = chokidar.watch(r)

            watcher
              .on('change', path => {
                const compileStartTime = moment()
                onRender(path, parentDirs)

                const diff = moment().diff(compileStartTime) // レンダリングの時間を取得

                console.log(
                  chalk.green(`✔︎ Compiled Style ${path} (${diff}ms)`)
                )
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

      resolve()
    })
  })
}

export default onInitRender
