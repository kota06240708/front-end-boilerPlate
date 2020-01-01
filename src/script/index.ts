import Sticky from './_sticky'

const sticky: Sticky = new Sticky({
  parent: '.js-section',
  child: '.js-contents'
})
sticky.init()
