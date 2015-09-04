<?php get_header(); ?>

	<div class="container">

		<?php if ( have_posts() ) : ?>

			<?php
			// Start the loop.
			while ( have_posts() ) : the_post();

				the_title();
				the_content();

			endwhile;

		else :
		endif;

		?>

	</div>

<?php get_footer();