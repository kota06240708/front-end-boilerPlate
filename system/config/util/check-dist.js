import conf from '../index'
import fs from 'fs'

const { distPath } = conf()

// 吐き出し先のファイルがあるか確認
const checkDist = () => {
  return new Promise(resolve => {
    fs.access(distPath, error => {
      if (error) {
        // 無い場合は作成
        fs.mkdirSync(distPath)
        resolve()
      }

      resolve()
    })
  })
}

export default checkDist
