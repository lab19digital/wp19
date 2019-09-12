<?php

function gutenberg_custom_theme_setup() {
  // add_theme_support('editor-color-palette', array(
  //   array(
  //     'name'  => 'Red',
  //     'slug'  => 'red',
  //     'color'	=> '#ff0000'
  //   ), array(
  //     'name'  => 'Green',
  //     'slug'  => 'green',
  //     'color'	=> '#00ff00'
  //   ), array(
  //     'name'  => 'Blue',
  //     'slug'  => 'blue',
  //     'color'	=> '#0000ff'
  //   ), array(
  //     'name'  => 'Black',
  //     'slug'  => 'black',
  //     'color'	=> '#000000'
  //   ), array(
  //     'name'  => 'White',
  //     'slug'  => 'white',
  //     'color'	=> '#ffffff'
  //   )
  // ));

  // add_theme_support('editor-font-sizes', array(
  //   array(
  //     'name'      => 'Extra Small',
  //     'shortName' => 'XS',
  //     'size'      => 12,
  //     'slug'      => 'extra-small'
  //   ),
  //   array(
  //     'name'      => 'Small',
  //     'shortName' => 'S',
  //     'size'      => 14,
  //     'slug'      => 'small'
  //   ),
  //   array(
  //     'name'      => 'Regular',
  //     'shortName' => 'R',
  //     'size'      => 16,
  //     'slug'      => 'regular'
  //   ),
  //   array(
  //     'name'      => 'Medium',
  //     'shortName' => 'M',
  //     'size'      => 18,
  //     'slug'      => 'medium'
  //   ),
  //   array(
  //     'name'      => 'Large',
  //     'shortName' => 'L',
  //     'size'      => 20,
  //     'slug'      => 'large'
  //   ),
  //   array(
  //     'name'      => 'Extra Large',
  //     'shortName' => 'XL',
  //     'size'      => 22,
  //     'slug'      => 'extra-large'
  //   )
  // ));

  add_theme_support('responsive-embeds');

  add_theme_support('editor-styles');
  add_editor_style('dist/editor.css');
}

add_action('after_setup_theme', 'gutenberg_custom_theme_setup');
