/*
  MAIN
  ===============================================

  This file is compiled by webpack, check webpack.common.js in the root for more
  options. This file supports babel, but writing in ES6 JavaScript is not required.

  - For GSAP (TweenLite, TweenMax), check webpack.common.js to enable these libraries
  - This file will compile to the dist folder. To modify this output, check
    webpack configuration files for more options.
*/

import $ from 'jquery';
import 'jquery-easing/jquery.easing.1.3';
// import 'waypoints/lib/jquery.waypoints.min';

// import 'bootstrap/js/dist/alert';
// import 'bootstrap/js/dist/button';
// import 'bootstrap/js/dist/carousel';
// import 'bootstrap/js/dist/collapse';
// import 'bootstrap/js/dist/dropdown';
// import 'bootstrap/js/dist/modal';
// import 'bootstrap/js/dist/popover';
// import 'bootstrap/js/dist/scrollspy';
// import 'bootstrap/js/dist/tab';
// import 'bootstrap/js/dist/tooltip';

// import Animations from './components/animations';
// import MailchimpSubscibe from './components/mailchimp-subscribe';
// import ScrollTo from './components/scroll-to';
// import Sliders from './components/sliders';

const Site = {};

$(document).ready(() => {
  Site.vars = {
    window: $(window),
    document: $(document),
    body: $('body'),
    htmlBody: $('html, body'),
    header: $('#header'),
    footer: $('#footer'),

    siteUrl: window.siteUrl,
    ajaxUrl: window.ajaxUrl,
    themeUrl: window.themeUrl
  };

  const s = Site.vars;

  // Animations(s);
  // MailchimpSubscibe(s, formId);
  // ScrollTo(s, id);
  // Sliders(s, $sliders);
});

export default Site;
