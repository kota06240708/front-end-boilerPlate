import fs from 'fs'

/**
 * readdir
 * @param {string|Buffer|URL} searchDir 読み込むファイルまでのパスを表現する文字列
 * @returns {Promise} rejectの場合はErrorが、
 *                    resolveの場合は読み込んだファイルのstring[]あるいはBuffer[]が返る
 */

const readdir = searchDir => {
  return new Promise((resolve, reject) => {
    fs.readdir(searchDir, (error, files) => {
      if (error) {
        reject(error)
        return
      }

      for (let i = 0, len = files.length; i < len; i++) {
        files[i] = `${searchDir}/${files[i]}`
      }

      resolve(files)
    })
  })
}

export default readdir
