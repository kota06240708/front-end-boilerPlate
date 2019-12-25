import css from './css'
import html from './html'
import js from './js'
import checkDist from './config/util/check-dist'
;(async () => {
  await checkDist()
  await Promise.all([html(), css(), js()])
})()
