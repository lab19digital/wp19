<?php

  use Timber\FunctionWrapper;

	if ( ! class_exists( 'Timber' ) ) {
	  add_action( 'admin_notices', function() {
	      echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="'
	      . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) )
	      . '</a></p></div>';
	    } );
	  if( ! isCommandLineInterface() ){
	  	die('Timber/twig not enabled');
	  }
	  return;
	}


	// Configure twig
	// ====================================================================
	Timber::$locations = array(
		get_template_directory_uri() . '/twig/'
    );

    Timber::$dirname = array('twig');

	// Define some global variables to use in the Twig templates
	add_filter( 'timber_context', 'add_to_context' );

	function add_to_context( $data ) {

	    // Overrides / Fixes for default WordPress functions for use in Twig templates
	    $data['wp_title'] = apply_filters("wp_title", get_the_title() . ' | ' . get_bloginfo('sitename'));
	    $data['feed_link'] = new FunctionWrapper( 'get_feed_link' );
	    $data['admin_url'] = new FunctionWrapper( 'admin_url' );
	    $data['template_dir'] = new FunctionWrapper( 'template_dir' );
	    $data['do_shortcode'] = new FunctionWrapper( 'do_shortcode' );
	    $data['get_featured_image'] = new FunctionWrapper( 'get_featured_image' );
	    $data['get_featured_thumbnail_url'] = new FunctionWrapper('get_featured_thumbnail_url');
	    $data['get_featured_thumbnail_alt'] = new FunctionWrapper('get_featured_thumbnail_alt');
	    $data['path'] = new FunctionWrapper( 'path' );
	    $data['body_class'] = implode(' ', get_body_class());
	    $data['header_class'] = '';
	    $data['header'] = header_vars();
	    $data['footer'] = footer_vars();
	    $data['ajax_url'] = admin_url( 'admin-ajax.php' );
	    $data['apply_filters'] = new FunctionWrapper( 'apply_filters' );
	    $data['is_front_page'] = false;

	    // ACF options fields (For ACF PRO)
	    $data['options'] = get_fields('option');

	    // Debugging
	    $data['debug_object'] = new FunctionWrapper("debug_object");

	    if( is_front_page() ){
	    	$data['header_class'] = 'text-from-white reveal-logo reveal-bg';
	    	$data['is_front_page'] = false;
	    }

	    return $data;
	}

	function template_dir( $path ){
		return get_template_directory_uri() . '/' . $path;
	}

	function header_vars(){
		return array();
	}

	function footer_vars(){
		return array();
	}

	function get_featured_thumbnail_url( $post ){
        $thumbId = get_post_thumbnail_id( $post->ID );
        $imageUrl = wp_get_attachment_image_src($thumbId,'medium', true);
        return $imageUrl[0];
	}

	function get_featured_thumbnail_alt( $post ){
        $thumbId = get_post_thumbnail_id( $post->ID );
        $imageAlt = get_post_meta($thumbId, '_wp_attachment_image_alt', true);
        return $imageAlt;
	}

	function debug_object( $object ){
		echo '<pre>' . print_r( $object, true ) . '</pre>';
	}
