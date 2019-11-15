<?php

// Load Main JS
function register_theme_scripts() {
  if (!is_admin()) {
    wp_deregister_script('jquery');
    wp_register_script('jquery', get_template_directory_uri() . '/dist/main.js', array(), false, true);
    wp_enqueue_script('jquery');
  }
}
add_action('wp_enqueue_scripts', 'register_theme_scripts');


// Add General Options Page
if (function_exists('acf_add_options_page')) {
  acf_add_options_page(array(
    'page_title' => 'Options',
    'menu_title' => 'Options',
    'menu_slug'  => 'theme-settings',
    'capability' => 'edit_posts',
    'redirect'	 => false
  ));
}


// Add js class to html tag
function javascript_detection() {
  echo "<script>(function(html){html.className = html.className.replace(/\bno-js\b/,'js')})(document.documentElement);</script>\n";
}
add_action('wp_head', 'javascript_detection', 0);


// Hide Admin Bar
add_filter('show_admin_bar', '__return_false');


// Remove Admin Menu Links
function remove_admin_menu_links() {
  // remove_menu_page('edit.php');
  remove_menu_page('edit-comments.php');
}
add_action('admin_menu', 'remove_admin_menu_links');


// Remove Default Editor
function remove_default_editor() {
  if (is_admin()) {
    global $pagenow;
    if ('post.php' != $pagenow) return;

    global $post;
    $post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'] ;
    if(!isset($post_id)) return;

    $slugs = array(
      // 'templates/home.php'
    );

    $slug = get_page_template_slug($post_id);

    if (in_array($slug, $slugs)) {
      remove_post_type_support(get_post_type(), 'editor');
    }
  }
}
// add_action('add_meta_boxes', 'remove_default_editor');


// Get Yoast Primary Term
function get_primary_term($post_id, $taxonomy = 'category') {
  $terms = get_the_terms($post_id, $taxonomy);

  if ($terms) {
    if (class_exists('WPSEO_Primary_Term')) {
      $wpseo_primary_term = new WPSEO_Primary_Term($taxonomy, $post_id);
      $wpseo_primary_term = $wpseo_primary_term->get_primary_term();
      $wpseo_primary_term = get_term($wpseo_primary_term);

      if (is_wp_error($wpseo_primary_term)) {
        // Return first term
        $output = array(
          'id'    => $terms[0]->term_id,
          'title' => $terms[0]->name,
          'link'  => get_term_link($terms[0]->term_id, $taxonomy)
        );

        return $output;
      } else {
        // Return primary term
        $output = array(
          'id'    => $wpseo_primary_term->term_id,
          'title' => $wpseo_primary_term->name,
          'link'  => get_term_link($wpseo_primary_term->term_id, $taxonomy)
        );

        return $output;
      }
    } else {
      // Return first term
      $output = array(
        'id'    => $terms[0]->term_id,
        'title' => $terms[0]->name,
        'link'  => get_term_link($terms[0]->term_id, $taxonomy)
      );

      return $output;
    }
  }
}


// SVG Support
function cc_mime_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');


// Custom WP Login Styles
function custom_login_styles() {
  echo
  '<style type="text/css">
    .login h1 a {
      background-image: url('. get_template_directory_uri() .'/img/logo.svg) !important;
      width: 100px;
      height: 100px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      pointer-events: none;
    }
  </style>';
}
// add_action('login_head', 'custom_login_styles');


// Debug Object
function debug_object($object) {
  echo '<pre>' . print_r($object, true) . '</pre>';
}


// Is Command Line
function isCommandLineInterface() {
  return (php_sapi_name() === 'cli');
}
