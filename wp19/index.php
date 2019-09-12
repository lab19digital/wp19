<?php

$context = Timber::context();

$timber_posts = new Timber\PostQuery();

$context['posts'] = $timber_posts;

Timber::render('index.twig', $context);
