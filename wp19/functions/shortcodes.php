<?php

// [menu name=""]
function print_menu_shortcode($atts, $content = null) {
  extract(shortcode_atts(array(
    'name' => null
  ), $atts));

  $output = wp_nav_menu(array(
    'menu' => $name,
    'echo' => false
  ));

  return $output;
}
add_shortcode('menu', 'print_menu_shortcode');
