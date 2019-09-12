<?php

$context = Timber::context();

$context['title'] = 'Archive';

if (is_day()) {
  $context['title'] = 'Archive: ' . get_the_date('D M Y');
} else if (is_month()) {
  $context['title'] = 'Archive: ' . get_the_date('M Y');
} else if (is_year()) {
  $context['title'] = 'Archive: ' . get_the_date('Y');
} else if (is_tag()) {
  $context['title'] = single_tag_title('', false);
} else if (is_category()) {
  $context['title'] = single_cat_title('', false);
} else if (is_post_type_archive()) {
  $context['title'] = post_type_archive_title('', false);
}

$timber_posts = new Timber\PostQuery();

$context['posts'] = $timber_posts;

Timber::render(array('archive.twig', 'index.twig'), $context);
