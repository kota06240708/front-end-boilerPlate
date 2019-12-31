import css from './css'
import html from './html'
import browser from './browser'
import { relodaJs } from './js'
import checkDist from './config/util/check-dist'
;(async () => {
  await checkDist()
  await Promise.all([html(), css(), relodaJs()])
  await browser()
})()
