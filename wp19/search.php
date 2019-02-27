<?php

$context = Timber::get_context();

$context['title'] = 'Search results for ' . get_search_query();

$context['posts'] = new Timber\PostQuery();

Timber::render(array('search.twig', 'archive.twig', 'index.twig'), $context);
