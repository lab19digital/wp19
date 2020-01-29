<?php

add_action('acf/init', 'acf_block_block_name');

function acf_block_block_name() {
  acf_register_block(array(
    'name'            => 'block-name',
    'title'           => 'block name',
    'render_callback' => 'acf_block_render_block_name',
    'category'        => 'custom-blocks',
    'keywords'        => array('block', 'name')
  ));
}

function acf_block_render_block_name() {
  $context = Timber::context();

  $context['image'] = get_field('image');
  $context['title'] = get_field('title');
  $context['text'] = get_field('text');

  Timber::render('blocks/block-name.twig', $context);
}
