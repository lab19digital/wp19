<?php

/*

  OUT THE BOX:
  ===============================================
  * Script queue
  * ACF Options Page
  * Javascript detection
  * Remove post editor from certain pages
  * Remove certain menu items
  * 2 navs are registered (primary-nav, footer-nav)
  * SVG upload support
  * Custom WP Login Styles
  * Timber/TWIG is used for front end templates. This must be activated
    in plugins for it to work.

  HELPER METHODS:
  ===============================================
  get_primary_category($post_id)

  SHORTCODES:
  ===============================================
  [menu name=""]

  DISABLED FUNCTIONALITY:
  ===============================================
  * Admin bar is hidden by default
  * Comments menu link is hidden by default

*/


// Imports
require_once 'functions/general.php';
require_once 'functions/menus.php';
require_once 'functions/shortcodes.php';


// Timber
if (!class_exists('Timber')) {
	add_action('admin_notices', function() {
    echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url(admin_url('plugins.php#timber')) . '">' . esc_url(admin_url('plugins.php')) . '</a></p></div>';
	});

	return;
}


Timber::$dirname = array('twig');

class Site extends TimberSite {

	function __construct() {
    add_theme_support('html5', array('comment-list', 'comment-form', 'search-form', 'gallery', 'caption'));
    add_theme_support('automatic-feed-links');
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('menus');

		add_filter('timber_context', array($this, 'add_to_context'));
		add_filter('get_twig', array($this, 'add_to_twig'));

    parent::__construct();
	}

	function add_to_context($context) {
    $context['site'] = $this;
    $context['options'] = get_fields('option');
    $context['ajax_url'] = admin_url('admin-ajax.php');

    $context['primary_nav'] = new TimberMenu('primary-nav');
    $context['footer_nav'] = new TimberMenu('footer-nav');

    $context['do_shortcode'] = new FunctionWrapper('do_shortcode');
    $context['apply_filters'] = new FunctionWrapper('apply_filters');
    $context['has_nav_menu'] = new FunctionWrapper('has_nav_menu');
    $context['get_primary_category'] = new FunctionWrapper('get_primary_category');
    $context['debug_object'] = new FunctionWrapper('debug_object');

    if (function_exists('acf_add_options_page')) {
      $context['options'] = get_fields('option');
    }

		return $context;
	}

	function add_to_twig($twig) {
		return $twig;
	}

}

new Site();
