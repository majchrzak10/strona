<?php
include_once(WWAC_PLUGIN_DIR_PATH."core/classes/class.WWACCustomArchives.php");

get_header();

if(!wp_style_is('font-awesome', 'registered')){
	wp_enqueue_style('wwac-font-awesome');
}

$WWACCustomArchives = new WWACCustomArchives();

$postID = get_the_ID();
$featured_image_url = get_the_post_thumbnail_url(get_the_ID(), 'full');
?>

<style>
/* ALL */
article[id^="post-"]{
	max-width: 1140px;
	margin: 30px auto;
}
.container{
	padding: 60px 0;
}

/* HERO SLIDE */
.wwac-hero{
	height: 69vh;
	background-image: url('<?php echo esc_url($featured_image_url); ?>');
	background-size: cover;
	background-position: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	color: white;
}
.wwac-hero::before{
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 69vh;
    background-color: rgba(0, 0, 0, 0.5);
}
.entry-title{
	z-index: 1;
}

/* CONTAINER */
.wwac-listing-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    margin: 20px 0;
}

.wwac-offer-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: 400px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #fff;
    transition: transform 0.3s;
    min-height: 100%; /* Sprawia, że wszystkie karty są tej samej wysokości */
}

.wwac-offer-card:hover {
    transform: translateY(-5px);
}

.wwac-offer-image img {
    width: 100%;
    height: 270px;
    object-fit: cover;
}

.wwac-offer-content {
    padding: 20px;
    flex-grow: 1; /* Sprawia, że zawartość wypełnia przestrzeń */
    display: flex;
    flex-direction: column;
}

.wwac-offer-title {
    font-size: 1.8em;
    margin-bottom: 10px;
    color: #333;
}

.wwac-offer-meta {
    display: flex;
    flex-direction: column;
    font-size: 0.9em;
    color: #666;
    margin-bottom: 15px;
}

.wwac-offer-meta span {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.wwac-offer-meta i {
    margin-right: 5px;
}

.wwac-offer-meta-span i{
	width: 15px;
	height: 15px;
}

.wwac-offer-description {
    font-size: 1em;
    line-height: 1.5;
    color: #444;
    margin-bottom: 20px;
    flex-grow: 1; /* Pozwala na rozciągnięcie opisu, aby wypełniał kartę */
}

.wwac-offer-link {
    display: inline-block;
    padding: 10px 20px;
    background-color: #0073aa;
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    align-self: flex-start;
    margin-top: auto; /* Sprawia, że link zostaje wyrównany na dole karty */
}

.wwac-offer-link:hover {
    background-color: #005e8a;
}
</style>

<div class="content-area">
	<?php
	if($WWACCustomArchives -> isHeroActive()){
	?>
	<header class="wwac-hero">
		<h1 class="entry-title">Wszystkie nieruchomości</h1>
	</header>
	<?php
	}
	?>
	
    <main class="container nieruchomosci-archive">
		<?php if ( have_posts() ) : ?>
			<section class="nieruchomosci-list">
				<div class="wwac-listing-container">
				<?php while ( have_posts() ) : the_post(); ?>
					<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
						<div class="wwac-offer-card">
							<div class="wwac-offer-image">
								<img src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'large'); ?>" alt="<?php the_title(); ?>" />
							</div>
							<div class="wwac-offer-content">
								<h2 class="wwac-offer-title"><?php the_title(); ?></h2>
								
								<div class="wwac-offer-meta">
									<?php
									echo $WWACCustomArchives -> showPropertyTax('<span class="wwac-offer-meta-span"><i class="fas fa-map-marker-alt"></i> Lokalizacja: {taxonomy}</span>', 'Localization');
									echo $WWACCustomArchives -> showPropertyTax('<span class="wwac-offer-meta-span"><i class="fas fa-key"></i> Kategoria: {taxonomy}</span>', 'Category');
									echo $WWACCustomArchives -> showPropertyTax('<span class="wwac-offer-meta-span"><i class="fas fa-house-user"></i> Typ: {taxonomy}</span>', 'Type');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-dollar-sign"></i> Cena: {meta}</span>', 'propertyPrice');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-ruler"></i> Powierzchnia: {meta}</span>', 'propertyArea');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-calendar"></i> Rok budowy: {meta}</span>', 'propertyYearBuilt');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-minus"></i> Piętro: {meta}</span>', 'propertyFloor');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-minus"></i> Pięter: {meta}</span>', 'propertyFloors');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-car"></i> Garaż: {meta}</span>', 'propertyGarage');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-parking"></i> Miejsca parkingowe: {meta}</span>', 'propertyParkingSpacesNo');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-door-open"></i> Pokoje: {meta}</span>', 'propertyRooms');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-arrows-alt-v"></i> Winda: {meta}</span>', 'propertyElevator');
									echo $WWACCustomArchives -> showPropertyMeta('<span class="wwac-offer-meta-span"><i class="fas fa-certificate"></i> Rynek: {meta}</span>', 'mortgageMarket');
									?>
									<!-- <span class="meta-date"><i class="fas fa-calendar-alt"></i> Dodano: 12.10.2024</span> -->
								</div>
								
								<?php
								if($WWACCustomArchives -> isExcerptActive()){
								?>
								<p class="wwac-offer-description"><?php echo get_the_excerpt(); ?>...</p>
								<?php
								}
								?>
								
								<a href="<?php the_permalink(); ?>" class="wwac-offer-link" title="Zobacz szczegóły oferty <?php the_title(); ?>">Zobacz szczegóły</a>
							</div>
						</div>
					</article>
					<?php endwhile; ?>
				</div>
			</section>

			<!-- Paginacja -->
			<nav class="pagination" aria-label="Paginacja">
				<?php 
				the_posts_pagination( array(
					'mid_size' => 2,
					'prev_text' => __( 'Poprzednia', 'textdomain' ),
					'next_text' => __( 'Następna', 'textdomain' ),
				) );
				?>
			</nav>
			
		<?php else : ?>
			<section class="no-results">
				<p><?php _e( 'Brak nieruchomości do wyświetlenia.', 'textdomain' ); ?></p>
			</section>
		<?php endif; ?>
	</main>
</div>

<?php get_footer(); ?>