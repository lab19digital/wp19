/*
    Dependencies are loaded automatically
    via require.json in this directory, minified 
    to dist/scripts.min.js
*/

;( function( $ ){

    var s,
        win = $( window ),
        main = {

            // settings & vars
            settings: {
                prevWindowSize : win.width(),
                mobileWinSize : 1024
            },

            // init function
            init: function(){

                s = main.settings;
                
                win.resize( function(){
                    main.resize();
                }).trigger('resize');

                main.nestedLinks();
                main.formValidation();
                main.responsiveNav();
            },

            windowLoad : function(){
                main.sliders();
            },

            generic: function(){},

            resize : function(){

                /*
                    Basic resize behaviour
                */

                var winWidth = win.width();
                if( s.prevWindowSize > s.mobileWinSize 
                        && winWidth <= s.mobileWinSize ){
                    main.becomeMobile();
                } else if( s.prevWindowSize <= s.mobileWinSize 
                    && winWidth > s.mobileWinSize ){
                    main.becomeDesktop();
                }
                s.prevWindowSize = winWidth;
            },

            nestedLinks : function(){

                /*
                    Allows cursor/CTA behaviour on large
                    elements like heroes.
                */

                $("[data-nested-link]").each( function(){
                    var link = $(this).find("a").first();
                    $(this).css({
                        cursor:'pointer'
                    }).click( function(){
                        location.href = link.attr("href");
                    });
                }); 
            },

            // Removes desktop effects
            becomeMobile : function(){},

            // Restores desktop effects
            becomeDesktop : function(){},

            sliders : function(){
                /*
    
                    Basic slider behaviour

                    var slider = $("div.slider");
                    slider.slick({
                        dots : true,
                        arrows : true,
                        fade : true,
                        cssEase : 'linear',
                        autoplay: true,
                        autoplaySpeed: 2000,
                        infinite : true
                      });
                */
            },

            formValidation : function(){
                /*
                    Basic form validation

                    $("#contact").validate().on("validsubmission", function(){
                        $(this).get(0).submit();
                    }).on("failedsubmission", function(){
                        $(this).addClass("form-has-error");
                    });
                */
            },

            responsiveNav : function(){
                /*
                    Typical nav behaviour

                    var toggleMenu = $("a[data-toggle-menu]").click( function(){
                        $("#main-nav").toggleClass("in");
                        $("#nav-bg").toggleClass("in");
                    });

                    $("#main-nav a.has-children").click( function( e ){
                        $(this).siblings("ul").toggleClass("active");
                        $(this).toggleClass("active");
                    });
                */
            }

        };  // end

    $( document ).ready( main.init );
    $( window ).load( main.windowLoad );
    
    window.msie        = window.navigator.userAgent.indexOf("MSIE") > -1;
    window.firefox     = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;


    window.main = main;

})( jQuery );