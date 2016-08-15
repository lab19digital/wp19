/* Main 
============================================================================
This file is compiled by webpack, check webpack.config.js in the root for more
options. This file supports babel, but writing in ES6 JavaScript is not required.

- For GSAP (TweenLite, TweenMax), check webpack.config.js to enable these libraries
- This file will compile to the ./js/main.dist.js. To modify this output, check
webpack.config.js for more options.
============================================================================ */

// jQuery is exposed globally using expose-loader
import jQuery from "jquery"; 

// Import your dependencies and execute them in the respective load events

/* Bootstrap imports
============================================================================ */

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

/* Local imports
============================================================================ */

// import sliders from "./components/sliders";
// import modals from "./components/modals";
// import forms from "./components/forms";

const Site = { };


/* DOM ready event, initialization
============================================================================ */

$( document ).ready( () => {

    Site.vars = {
        body : $('body'),
        navbar : $("#main-nav"),
        carousel : $('.slider'),
        table : $('#plan-table')
    };

    // == If you want to enable sliders (Slick) == //
    // The slick import is contained inside the ./components/sliders import
    // sliders( Site.vars.carousel );

    // == If you want to enable modals == //
    // Remember to uncomment the bootstrap/js/modal import above
    // modals( Site.vars.body );

});

/* Window ready event, for deferring until assets are loaded
============================================================================ */

$( window ).load( () => {
    
});

export default Site;