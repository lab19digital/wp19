<?php

global $wp_query;

$context = Timber::get_context();

$context['posts'] = new Timber\PostQuery();

if (isset($wp_query->query_vars['author'])) {
  $author = new Timber\User( $wp_query->query_vars['author'] );

  $context['author'] = $author;

	$context['title'] = 'Author Archives: ' . $author->name();
}

Timber::render(array('author.twig', 'archive.twig', 'index.twig'), $context);
