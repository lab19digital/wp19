<?php

/* Template Name: Home */

$context = Timber::context();

$timber_post = new TimberPost();

$context['post'] = $timber_post;

Timber::render('templates/home.twig', $context);
