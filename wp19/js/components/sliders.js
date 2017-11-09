import 'slick-carousel/slick/slick';

export default function(s, $sliders) {

  $sliders.slick({
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true
  });

}
