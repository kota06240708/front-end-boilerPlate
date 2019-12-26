import conf from './system/config'

import autoPrefixer from 'autoprefixer'
import mqpacker from 'css-mqpacker'
import reporter from 'postcss-reporter'
import _import from 'postcss-easy-import'
import easing from 'postcss-easings'
import nested from 'postcss-nested'
import flexbugs from 'postcss-flexbugs-fixes'
import calc from 'postcss-calc'
import cssnano from 'cssnano'
import stylelint from 'stylelint'
import postcssReporter from 'postcss-reporter'

const postCssOpt = (from, to) => {
  const result = {}

  result.map = conf.env === 'production' ? false : { inline: true }
  result.from = from
  result.to = to

  result.plugins = [
    _import({
      path: ['node_modules'],
      glob: true
    }),
    easing(),
    autoPrefixer(),
    mqpacker({ sort: true }),
    flexbugs(),
    calc(),
    reporter({ clearMessages: true }),
    nested,
    cssnano({
      preset: 'default'
    })
  ]

  result.stylelint = [stylelint(), postcssReporter({ clearMessages: true })]

  return result
}

export default postCssOpt
