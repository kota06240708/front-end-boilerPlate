import { makeArray } from './_make-array'

class Sticky {
  private $$sections: Array<HTMLElement>
  private $$contents: Array<HTMLElement>

  constructor () {
    this.$$sections = makeArray(document.querySelectorAll('.js-section'))
    this.$$contents = makeArray(document.querySelectorAll('.js-contents'))
  }

  public init (): void {
    console.log(this.$$sections)
    console.log(this.$$contents)
  }
}

const sticky = new Sticky()
sticky.init()
