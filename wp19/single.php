<?php

	$data = Timber::get_context();
	$data['post'] = new TimberPost();

	/*
		Add custom fields here, or you can call these directly
		in the twig file using  {{ post.get_field() }}
	*/

	return Timber::render('single.twig', $data);