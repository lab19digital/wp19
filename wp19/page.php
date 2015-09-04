<?php get_header(); ?>

	<div class="container">

		<?php while ( have_posts() ) : the_post(); ?>

			<h1><?php the_title(); ?></h1>
			
		<?php endwhile; ?>

	</div>

<?php get_footer();