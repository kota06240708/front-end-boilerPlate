import conf from '../index'
import fs from 'fs'

const { distPath } = conf()

const checkDist = () => {
  return new Promise(resolve => {
    fs.access(distPath, error => {
      if (error) {
        fs.mkdirSync(distPath)
        resolve()
      }

      resolve()
    })
  })
}

export default checkDist
