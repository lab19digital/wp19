<?php

$context = Timber::context();

$context['title'] = 'Search results for ' . get_search_query();

$timber_posts = new Timber\PostQuery();

$context['posts'] = $timber_posts;

Timber::render(array('search.twig', 'archive.twig', 'index.twig'), $context);
