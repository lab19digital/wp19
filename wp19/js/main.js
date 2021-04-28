import $ from 'jquery'
// import 'jquery-easing/jquery.easing.1.3'
// import 'lazysizes'

import BlockName from './blocks/block-name'

export const Site = {}

window.isPageLoaded = false
window.isPageReady = false

$(window).on('load', () => {
  window.isPageLoaded = true
})

$(function () {
  Site.variables = {
    window: $(window),
    document: $(document),
    body: $('body'),
    head: $('head'),
    htmlBody: $('html, body'),
    mainWrapper: $('#main-wrapper')
  }

  const s = Site.variables

  window.isPageReady = true

  BlockName(s)
})

export default Site
