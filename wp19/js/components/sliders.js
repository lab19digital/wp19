// Import from node_modules
import 'slick-carousel/slick/slick.js';

export default function( $sliders ){

	$sliders.slick({
		dots : true,
		arrows : true,
        fade : true,
        cssEase : 'linear',
        autoplay: true,
        autoplaySpeed: 2000,
        infinite : true
	});	
}

