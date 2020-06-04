const animateElement = (element) => {
  const $element = $(element);
  const animation = $element.data('animation');
  const delay = parseInt($element.data('animation-delay'));
  const duration = parseInt($element.data('animation-duration'));

  if (delay) $element.css('animation-delay', `${delay}ms`);
  if (duration) $element.css('animation-duration', `${duration}ms`);

  $element.addClass(`animated ${animation}`);
};

export default function (s) {
  const waypointAnimate = $('.animate').waypoint(
    function (direction) {
      animateElement(this.element);

      this.destroy();
    },
    {
      offset: '75%'
    }
  );

  const waypointAnimateMultiple = $('.animate-multiple').waypoint(
    function (direction) {
      const $this = $(this.element);
      const elements = $this.find('[data-animation]');

      elements.each(function () {
        animateElement(this);
      });

      this.destroy();
    },
    {
      offset: '75%'
    }
  );

  const waypointAnimateInView = $('.animate-in-view').waypoint(
    function (direction) {
      animateElement(this.element);

      this.destroy();
    },
    {
      offset: 'bottom-in-view'
    }
  );
}
