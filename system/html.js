import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import glob from 'glob'
import moment from 'moment'

import Pug from 'pug'

import conf from './config'

const { src, distPath, htmlDir, isLocal } = conf()

const onInitRender = () => {
  return new Promise((resolve, reject) => {
    fs.access(distPath, error => {
      if (error) {
        fs.mkdirSync(distPath) // ない場合フォルダーを作成
      }

      glob(`${src}/**/${htmlDir}`, {}, (error, dirs) => {
        console.log(dirs)
        const t = dirs[0].split('/')
        console.log(t)
      })

      resolve()
    })
  })
}

export default onInitRender
