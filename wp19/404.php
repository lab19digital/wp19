<?php

	$data = Timber::get_context();
	$data['post'] = new TimberPost();

	
	
	return Timber::render('404.twig', $data);

	