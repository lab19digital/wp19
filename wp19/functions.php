<?php
	
	/*
		OUT THE BOX:
		---------------------------------------------------
		* Script queue
		* Remove post editor from certain pages
		* Remove certain menu items 
		* 2 navs are registered (main menu, footer menu)
		* Get featured image function
		* Custom ACF slideshow shortcode
		* Custom google map shortcode
		* Contact message AJAX/post
		* Get/modify wordpress gallery (inserted into post)

		HELPER METHODS:
		---------------------------------------------------
		get_menu( $name );
		get_featured_image( $post );

		SHORTCODES:
		---------------------------------------------------
		google_map
		slideshow

		DISABLED FUNCTIONALITY:
		---------------------------------------------------
		* Admin bar is hidden by default
		* Comments section is hidden by default


	*/

	show_admin_bar( false );
	
	/**
	 * Scripts and styles
	 */
	function theme_name_scripts() {
		wp_enqueue_style( 'style-main', get_stylesheet_uri() );
		wp_enqueue_script( 'scripts-all', get_template_directory_uri() . '/js/dist/scripts.min.js', array(), '1.0.0', true );
	}

	add_action( 'wp_enqueue_scripts', 'theme_name_scripts' );

	/* Remove post editor support on some pages */
	if ( is_admin() ) {
	  add_action( 'add_meta_boxes', function(){
	    global $post; // Should be available at this hook.
	    $slugs = array(
	    	"templates/home.php"
	    );
	    if( in_array( get_page_template_slug($post->ID), $slugs ) ){
	    	// remove_post_type_support( get_post_type(), 'editor' );
		}
	  });
	}

	add_action( 'admin_menu', 'my_remove_menu_pages' );

	function my_remove_menu_pages(){
		remove_menu_page('edit-comments.php');
	}


	/*
		Menus
	*/

	function register_my_menus() {
	  register_nav_menus(
	    array(
	      'main-menu' => __( 'Main Menu' ),
	      'footer-menu' => __( 'Footer Menu' )
	    )
	  );
	}
	
	add_action( 'init', 'register_my_menus' );

	function get_menu( $menu_name ){
		$locations = get_nav_menu_locations();
        if ( $locations && isset( $locations[ $menu_name ] ) ){
            $menu = wp_get_nav_menu_object( $locations[ $menu_name ] );
            $menu_items = (array)wp_get_nav_menu_items($menu->term_id);
            $menuItems = array();
            foreach( $menu_items as $item ){
            	if( $item->menu_item_parent == 0 ){
            		$menuItems[$item->ID] = $item;
            	} else {
            		if( !isset($menuItems[$item->menu_item_parent]->children)){
            			$menuItems[$item->menu_item_parent]->children = array();
            		}
            		$menuItems[$item->menu_item_parent]->children[] = $item;
            	}
            }
            return $menuItems;
        }
        return false;
	}

	/*
		Post type
	*/

	// add_theme_support( 'post-thumbnails', 
	// 	array( 'post-type', 'post-type' )
	// );

	function get_featured_image( $post ){
		$thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'full' );
		if(isset($thumbnail)){
			return $thumbnail[0];
		}
		return false;
	}

	/*
		Gallery shortcode
		Gets a gallery via ACF field
	*/

	function custom_slideshow_shortcode( $attrs ){
		global $post;
		$html = '<div class="slider">';
		$itemStr = '<div><img src="{url}" /></div>';
		$gallery = get_field($attrs[0], $post);
		foreach( $gallery as $item ) :
			$html.= str_replace("{url}", $item['url'], $itemStr);
		endforeach; 
		$html.= '</div>';
		return $html;
	}

	add_shortcode("slideshow", "custom_slideshow_shortcode");

	/*
		Maps shortcode
	*/

	function google_map_shortcode( $attrs ){
		$html = '<iframe width="600" height="350" frameborder="0" style="border:0" src="{map_embed_url}" allowfullscreen></iframe>';
		return str_replace("{map_embed_url}", $attrs['embed'], $html );
	}

	add_shortcode("google_map", "google_map_shortcode");


	/*
		Contact form
	*/

	add_action( 'admin_post_create_contact_message', 'create_contact_message' );
	add_action( 'admin_post_nopriv_create_contact_message', 'create_contact_message' );

	function create_contact_message(){

		add_filter( 'wp_mail_content_type', 'set_html_content_type' );

		$sendMail = wp_mail( WP_ADMIN_EMAIL, $_POST['name'] . ' sent you a message via ' . WP_SITEURL
			, implode("<br />", array(
			'<strong>Name</strong>: ' 		. $_POST['name'],
			'<strong>Email</strong>: ' 		. $_POST['email'],
			'<strong>Enquiry</strong>: ' 	. $_POST['enquiry'],
			'<strong>Message</strong>: ' 	. nl2br($_POST['message']),
			'<strong>Date</strong>: '		. $date
			)
		));

		// Need to return 
		echo json_encode(array(
			"success" => $sendMail
		));
	}

	function set_html_content_type() {
		return 'text/html';
	}

	/*
		Wordpress customised gallery 
		shortcode
	*/

	add_filter('post_gallery', 'my_post_gallery', 10, 2);

	function my_post_gallery($output, $attr) {

	    global $post;

	    if (isset($attr['orderby'])) {
	        $attr['orderby'] = sanitize_sql_orderby($attr['orderby']);
	        if (!$attr['orderby'])
	            unset($attr['orderby']);
	    }

	    extract(shortcode_atts(array(
	        'order' => 'ASC',
	        'orderby' => 'menu_order ID',
	        'id' => $post->ID,
	        'itemtag' => 'dl',
	        'icontag' => 'dt',
	        'captiontag' => 'dd',
	        'columns' => 3,
	        'size' => 'thumbnail',
	        'include' => '',
	        'exclude' => ''
	    ), $attr));

	    $id = intval($id);
	    if ('RAND' == $order) $orderby = 'none';

	    if (!empty($include)) {
	        $include = preg_replace('/[^0-9,]+/', '', $include);
	        $_attachments = get_posts(array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby));

	        $attachments = array();
	        foreach ($_attachments as $key => $val) {
	            $attachments[$val->ID] = $_attachments[$key];
	        }
	    }

	    if (empty($attachments)) return '';

	    // Here's your actual output, you may customize it to your need
	    $output = "<div class=\"basic-gallery\">\n";

	    // Now you loop through each attachment
	    foreach ($attachments as $id => $attachment) {
	        $img = wp_get_attachment_image_src($id, 'full');
	        $output .= "<img src=\"{$img[0]}\" alt=\"\" />\n";
	    }

	    $output .= "</div>\n";

	    return $output;
	}