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
  get_primary_term($post_id, $taxonomy);

  SHORTCODES:
  ===============================================
  [menu name=""]

  DISABLED FUNCTIONALITY:
  ===============================================
  * Admin bar is hidden by default
  * Comments menu link is hidden by default

*/


// Build Version
$build_version = '';
$build_version_file = dirname(__DIR__, 3) . '/build-version.txt';

if (file_exists($build_version_file)) {
  $file_contents = trim(file_get_contents($build_version_file));

  if (isset($file_contents) && !empty($file_contents)) {
    $build_version = $file_contents;
  }
}

define('THEME_BUILD_VERSION', $build_version);


// Imports
require_once 'functions/commands.php';
require_once 'functions/general.php';
require_once 'functions/menus.php';
require_once 'functions/shortcodes.php';
require_once 'functions/blocks.php';
require_once 'functions/gutenberg.php';


// Timber
if (!class_exists('Timber')) {
  add_action('admin_notices', function () {
    echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
  });

  add_filter('template_include', function ($template) {
    return get_stylesheet_directory() . '/no-timber.html';
  });

  return;
}


Timber::$dirname = array('twig');
Timber::$autoescape = false;

use Timber\FunctionWrapper;

class Site extends Timber\Site {
  public function __construct() {
    add_action('after_setup_theme', array($this, 'theme_supports'));
    add_filter('timber/context', array($this, 'add_to_context'));
    add_filter('timber/twig', array($this, 'add_to_twig'));
    add_action('init', array($this, 'register_post_types'));
    add_action('init', array($this, 'register_taxonomies'));

    parent::__construct();
  }

  public function register_post_types() {}

  public function register_taxonomies() {}

  public function add_to_context($context) {
    global $cache_var;

    $context['site'] = $this;
    $context['ajax_url'] = admin_url('admin-ajax.php');

    $context['primary_nav'] = new Timber\Menu('primary-nav');
    $context['footer_nav'] = new Timber\Menu('footer-nav');

    $context['do_shortcode'] = new FunctionWrapper('do_shortcode');
    $context['apply_filters'] = new FunctionWrapper('apply_filters');
    $context['has_nav_menu'] = new FunctionWrapper('has_nav_menu');
    $context['get_primary_term'] = new FunctionWrapper('get_primary_term');
    $context['debug_object'] = new FunctionWrapper('debug_object');

    $context['PAGE_FOR_POSTS_ID'] = get_option('page_for_posts');
    $context['PAGE_FOR_POSTS_LINK'] = get_permalink($context['PAGE_FOR_POSTS_ID']);

    $context['WP_DEBUG'] = WP_DEBUG;
    $context['THEME_BUILD_VERSION'] = THEME_BUILD_VERSION;

    if (function_exists('acf_add_options_page')) {
      $context['options'] = get_fields('option');
    }

    return $context;
  }

  public function theme_supports() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('menus');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', array(
      'comment-list',
      'comment-form',
      'search-form',
      'gallery',
      'caption'
    ));
    // add_theme_support('post-formats', array(
      // 'aside',
      // 'image',
      // 'video',
      // 'quote',
      // 'link',
      // 'gallery',
      // 'audio'
    // ));
  }

  public function add_to_twig($twig) {
    return $twig;
  }
}

new Site();
