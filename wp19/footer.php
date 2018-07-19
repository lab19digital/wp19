<?php

$timberContext = $GLOBALS['timberContext'];

if (!isset($timberContext)) {
	throw new \Exception('Timber context not set in footer.');
}

$timberContext['content'] = ob_get_contents();
ob_end_clean();

Timber::render('page-plugin.twig', $timberContext);
