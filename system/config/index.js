import path from 'path'

const conf = () => {
  const result = {}

  result.env = process.env.NODE_ENV

  result.isLocal = !!(result.env === 'local')

  result.src = 'src'
  result.dist = result.isLocal ? 'dist' : result.env
  result.prod = 'production'

  result.srcPath = path.join(process.cwd(), result.src)
  result.distPath = path.join(process.cwd(), result.dist)
  result.prodPath = path.join(process.cwd(), result.env)

  result.cssDir = '*.scss'
  result.htmlDir = '*.pug'
  result.jsDir = '*.js'

  return result
}

export default conf
