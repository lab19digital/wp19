<?php

if (function_exists('acf_register_block')) {

  // Add custom blocks categories
  function add_custom_blocks_categories($categories, $post) {
    return array_merge(
      $categories,
      array(
        array(
          'slug' => 'custom-blocks',
          'title' => 'Custom Blocks'
        )
      )
    );
  }
  add_filter('block_categories', 'add_custom_blocks_categories', 10, 2);


  // BLOCKS
  // ===============================================

  require_once 'blocks/block-name.php';

}
