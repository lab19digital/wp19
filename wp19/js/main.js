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

                    Triggers 2 events for when changing between mobile / desktop, 
                    typicall for development only (i.e. resizing browser windows)
                */

                var winWidth = win.width();
                var becomesMobile = s.prevWindowSize > s.mobileWinSize && winWidth <= s.mobileWinSize;
                var becomesDesktop = s.prevWindowSize <= s.mobileWinSize && winWidth > s.mobileWinSize;

                // Execute events
                becomesMobile && main.becomeMobile();
                becomesDesktop && main.becomeDesktop();

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
            },

            parallax : function(){

                /*

                    Typical parallax example (Scrollmagic)

                    var wh = win.height();
                    $(".full-width-image img").each( function(){
                        var each = $(this);

                        var controller = new ScrollMagic.Controller();
                        var scene = new ScrollMagic.Scene({
                          offset: each.offset().top - wh, // start scene after scrolling for x px amount
                          duration: wh*2 // pin the element for x px amount of scrolling
                        });

                        var tween = new TweenMax.to(each.get(0), 1, {
                            transform : "translate(0,-300px)"
                        });

                        var timeline = new TimelineMax();
                        timeline.add( tween, 0 );            
                        scene.setTween(timeline).addTo(controller);

                        each.on("destroyscrollmagic", function(){
                            scene.destroy();
                        });
                    });
                        
                    
                    main.destroyParallax : function(){
                        $(".full-width-image img").trigger("destroyscrollmagic").css({
                            transform: "translate(0,0)"
                        });
                    };

                */
            }

        };  // end

    $( document ).ready( main.init );
    $( window ).load( main.windowLoad );
    
    window.msie        = window.navigator.userAgent.indexOf("MSIE") > -1;
    window.firefox     = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;


    window.main = main;

})( jQuery );