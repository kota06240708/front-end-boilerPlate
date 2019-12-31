import { makeArray } from './_make-array'
import { offsetTop } from './_offset'

type TScroll = {
  top: number
  bottom: number
  el: HTMLElement
}

class Sticky {
  private $$sections: Array<HTMLElement>
  private $$contents: Array<HTMLElement>
  private sectionsOpt: Array<TScroll>
  private contentsOpt: Array<TScroll>
  private scrollTop: number

  constructor () {
    this.$$sections = makeArray(document.querySelectorAll('.js-section'))
    this.$$contents = makeArray(document.querySelectorAll('.js-contents'))

    this.$$sections = []
    this.contentsOpt = []

    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  public init (): void {
    this.setVal()
    this.onListener()
  }

  private onListener (): void {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
  }

  onScroll (): void {
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop
  }

  onResize (): void {
    this.setVal()
  }

  private setVal (): void {
    this.$$sections.forEach((r: HTMLElement, i: number) => {
      const result: TScroll = {
        top: offsetTop(r),
        bottom: offsetTop(r) + r.clientHeight,
        el: r
      }

      this.sectionsOpt[i] = result
    })

    this.$$contents.forEach((r: HTMLElement, i: number) => {
      const result: TScroll = {
        top: offsetTop(r),
        bottom: offsetTop(r) + r.clientHeight,
        el: r
      }

      this.contentsOpt[i] = result
    })
  }
}

const sticky = new Sticky()
sticky.init()
