<?php

if (function_exists('acf_register_block')) {

  // Add new blocks category
  function add_blocks_category($categories, $post) {
    return array_merge(
      $categories,
      array(
        array(
          'slug' => 'example-blocks',
          'title' => 'Example Blocks'
        )
      )
    );
  }
  // add_filter('block_categories', 'add_blocks_category', 10, 2);


  // BLOCKS
  // ===============================================

  // Block example
  // add_action('acf/init', 'acf_block_example');

  function acf_block_example() {
    acf_register_block(array(
      'name'				    => 'example-block',
      'title'				    => 'Example Block',
      'render_callback'	=> 'acf_block_render_example',
      'category'			  => 'example-blocks',
      'keywords'			  => array('example', 'block')
    ));
  }

  function acf_block_render_example() {
    $context = Timber::context();

    $context['image'] = get_field('image');
    $context['title'] = get_field('title');
    $context['text'] = get_field('text');

    Timber::render('blocks/example.twig', $context);
  }

}
