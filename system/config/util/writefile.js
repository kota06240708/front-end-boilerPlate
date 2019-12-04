import mkdirp from 'mkdirp'
import fs from 'fs'
import path from 'path'

/**
 * @param {string} file 書き込み対象のファイルまでのパスを表現する文字列
 * @param {string} data 書き込むコードの文字列
 * @returns {Promise} rejectの場合はErrorが、resolveの場合は空が返る
 */

const writeFile = (file, data) => {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(file), error => {
      if (error) {
        reject(error)
        return
      }

      fs.writeFile(file, data, error => {
        if (error) {
          reject(error)
          return
        }

        resolve()
      })
    })
  })
}

export default writeFile
