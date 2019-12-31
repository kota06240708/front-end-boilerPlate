import { makeArray } from './_make-array'
import { offsetTop } from './_offset'

type TScroll = {
  top: number
  bottom: number
  el: HTMLElement
  child: HTMLElement
}

class Sticky {
  private $$sections: Array<HTMLElement>
  private sectionsOpt: Array<TScroll>
  private scrollTop: number

  constructor () {
    this.$$sections = makeArray(document.querySelectorAll('.js-section'))

    this.sectionsOpt = []
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  public init (): void {
    this.$$sections.forEach((r: HTMLElement, i: number) => {
      const result: TScroll = {
        top: offsetTop(r),
        bottom: offsetTop(r) + r.clientHeight,
        el: r,
        child: r.querySelector('.js-contents')
      }

      this.sectionsOpt[i] = result
    })
    this.onListener()
  }

  private onListener (): void {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
  }

  onScroll (): void {
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop
    this.onSicky()
  }

  onSicky (): void {
    this.sectionsOpt.forEach((r: TScroll) => {
      const $$parent: HTMLElement = r.el
      const $$child: HTMLElement = r.child

      if (r.top <= this.scrollTop && r.bottom >= this.scrollTop) {
        if (!$$parent.classList.contains('current')) {
          $$parent.classList.add('current')
          $$child.style.position = 'absolute'
        }
        const top: number = this.scrollTop - r.top
        const bottom: number = $$parent.clientHeight - $$child.clientHeight
        const scrollBottom: number = this.scrollTop + $$child.clientHeight

        if (r.bottom <= scrollBottom) {
          $$child.style.top = `${bottom}px`
        } else {
          $$child.style.top = `${top}px`
        }
      } else if (r.top > this.scrollTop) {
        $$child.style.top = `0px`
      }
    })
  }

  onResize (): void {
    this.resetVal()
  }

  private resetVal (): void {
    this.$$sections.forEach((r: HTMLElement, i: number) => {
      this.sectionsOpt[i].top = offsetTop(r)
      this.sectionsOpt[i].bottom = offsetTop(r) + r.clientHeight
    })
  }
}

const sticky = new Sticky()
sticky.init()
