<?php

$context = Timber::context();

$timber_post = new TimberPost();

$context['post'] = $timber_post;

Timber::render('page.twig', $context);
