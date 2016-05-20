/* Main 
============================================================================
This file is compiled by webpack, check webpack.config.js in the root for more
options. This file supports babel, but writing in ES6 JavaScript is not required.

- jQuery is already available globally (provided by Webpack)
- For GSAP (TweenLite, TweenMax), check webpack.config.js to enable these libraries
- This file will compile to the ./dist/main.dist.js. To modify this output, check
webpack.config.js for more options.
============================================================================ */

// Import your dependencies and execute them in the respective load events

// Bootstrap imports
// import "bootstrap/js/affix";
// import "bootstrap/js/alert";
// import "bootstrap/js/button";
// import "bootstrap/js/carousel";
import "bootstrap/js/collapse";
// import "bootstrap/js/dropdown";
// import "bootstrap/js/modal";
// import "bootstrap/js/popover";
// import "bootstrap/js/scrollspy";
// import "bootstrap/js/tab";
// import "bootstrap/js/tooltip";
import "bootstrap/js/transition";

// import carousels from "./components/carousels";
import modals from "./components/modals";
// import forms from "./components/forms";

const Site = { };

/*
    Document load event
    Initialize your plugins
*/

Site.documentDidLoad = ( $body ) => {

    Site.vars = {
        navbar : $("#main-nav"),
        carousel : $('.slider'),
        table : $('#plan-table')
    };

    // == If you want to enable carousels == //
    // carousels( Site.vars.carousel );

    // == If you want to enable modals == //
    modals( $body );

};

/*
    Window load event
    Initialize or trigger plugins 
    dependent on assets loading.
*/

Site.windowDidLoad = ( $body ) => {

};

$( document ).ready( () => {

    window.Site = Site;
    Site.documentDidLoad( $("body") );

});

$( window ).load( () => {

    Site.windowDidLoad( $("body") );

});

Site.jQuery = jQuery;

export default Site;