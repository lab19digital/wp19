<!DOCTYPE html>
<html <?php language_attributes(); ?> <?php body_class($post->post_name . ' ' . ( !is_front_page() ? 'inner-page' : '')); ?>>
<head>
	<title><?php wp_title( '|', true, 'left' ); ?></title>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<!--[if lt IE 9]>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
	<![endif]-->
	<?php wp_head(); ?>
</head>

<body>

	<header>

		<div class="nav-control">
			<a href="javascript:;" data-toggle-menu>
				<span class="burger">
					<em></em>
					<em></em>
					<em></em>
				</span>
			</a>
		</div>
		
		<div class="container">
			<div class="logo-bar">
				<a href="<?php bloginfo("siteurl"); ?>" class="logo">
					<?php 
						$logo = get_field("logo", "option"); 
						if( $logo ) : 
					?>
						<img src="<?= $logo['url'] ?>" />
					<?php endif; ?>
				</a>
			</div>
			<div class="menu-bar">
				<div class="clearfix nav-wrapper">
					<?php include("helpers/bootstrap-nav.php"); ?>
				</div>
			</div>
		</div>
	</header>

	<div id="content" class="site-content">