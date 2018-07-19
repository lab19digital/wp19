export default function (s, id, offset = 0, speed = 1000, easing = 'easeInOutExpo') {

  if (id && id !== '#' && id.match(/^#/)) {
    const top = Math.ceil($(id).offset().top) - offset;

    s.htmlBody.animate({ scrollTop: top }, speed, easing);
  }

}
