<?php get_header(); ?>

	<div class="container">

		<?php if ( have_posts() ) : ?>

			<header></header>

			<?php
			
			while ( have_posts() ) : the_post();

				
			endwhile;
			
			the_posts_pagination( array(
				'prev_text'          => 'Previous page',
				'next_text'          => 'Next page',
				'before_page_number' => 'Page',
			) );

		else :
			get_template_part( 'content', 'none' );

		endif;
		?>
	</div>

<?php get_footer();