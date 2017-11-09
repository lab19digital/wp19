<?php

$context = Timber::get_context();

$post = Timber::query_post();

$context['post'] = $post;

Timber::render('single.twig', $context);
