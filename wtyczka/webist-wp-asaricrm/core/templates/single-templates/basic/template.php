<?php
include_once(WWAC_PLUGIN_DIR_PATH."core/classes/class.WWACCustomArchives.php");

get_header();

if(!wp_style_is('font-awesome', 'registered')){
	wp_enqueue_style('wwac-font-awesome');
}

$WWACCustomArchives = new WWACCustomArchives();

$featured_image_url = get_the_post_thumbnail_url(get_the_ID(), 'full');
?>

<style>
#post-<?php the_ID(); ?>{
	max-width: 1140px;
	margin: 30px auto;
}
.wwac-hero{
	width: 100%;
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
.wwac-content-container{
	display: flex;
	width: 100%;
	align-items: flex-start;
	padding: 60px 0;
}
/* *** LEFT CONTAINER *** */
.wwac-content-left-container{
	width: 70%;
	padding: 20px;
	word-break: break-word;
}

/* *** RIGHT CONTAINER *** */
.wwac-content-right-container{
	width: 30%;
	padding: 15px;
	margin-top: 21px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
}
.wwac-offer-basic-info{
	width: 100%;
	background: #efefef;
	padding: 5px 15px;
	font-size: 19px;
	border-radius: 12px;
	margin-top: 12px;
}
.wwac-agent-image{
	border-radius: 12px;
}
.wwac-offer-basic-info h3{
	text-align: center;
}
.wwac-offer-info-list{
	list-style-type: none;
    padding: 0;
	margin-top: 10px;
}
.wwac-offer-info-list li{
	display: inline-block;
	border-radius: 12px;
	padding: 3px 0px;
	margin-top: 6px;
	background: #efefef;
}
.wwac-offer-info-list li i{
	margin-right: 3px;
    color: #70b38c;
}

/* AGENT */
.wwac-agent-container{
	background: #efefef;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 30px 15px;
	margin: 0;
}
.wwac-offer-agent-info-list{
	padding-left: 0px;
}
.wwac-offer-agent-info-list li{
	display: block;
}
.wwac-offer-agent-info-list li i{
	margin-right: 3px;
    color: #70b38c;
}
@media (max-width: 1024px){
    .wwac-hero{
        height: 50vh;
    }
	.wwac-hero::before{
		height: 50vh;
	}
    .wwac-content-container{
        flex-direction: column;
        padding: 40px 0;
    }
    .wwac-content-left-container, 
    .wwac-content-right-container{
        width: 100%;
        padding: 15px;
    }
}

@media (max-width: 768px){
    .wwac-hero{
        height: 40vh;
        background-position: top;
    }
	.wwac-hero::before{
		height: 40vh;
	}
    .wwac-content-container{
        padding: 30px 0;
    }
    .wwac-content-left-container,
    .wwac-content-right-container{
        width: 100%;
        padding: 10px;
    }
    .wwac-offer-basic-info{
        font-size: 16px;
        padding: 10px;
    }
    .wwac-offer-info-list li{
        padding: 2px 4px;
        margin-top: 5px;
    }
    .wwac-agent-container{
        padding: 20px 10px;
    }
}
</style>

<div class="content-area">
	<?php
	if($WWACCustomArchives -> isHeroActive()){
	?>
	<header class="wwac-hero">
		<h1 class="entry-title"><?php the_title(); ?></h1>
	</header>
	<?php
	}
	?>
	
    <main class="site-main">
        <?php while(have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<div class="wwac-content-container">
					<div class="wwac-content-left-container">
						<?php the_content(); ?>
					</div>
					
					<div class="wwac-content-right-container">
						<?php
						if($WWACCustomArchives -> isAgentInfoEnabled()){
						?>
						<div class="wwac-agent-container">
							<?php
							echo $WWACCustomArchives -> showAgentPhoto();
							?>
						
							<h3><?php echo $WWACCustomArchives -> showAgentNames(); ?></h3>
							<div>
								<ul class="wwac-offer-agent-info-list">
									<li><?php echo $WWACCustomArchives -> showAgentPhoneNumbers('<i class="fas fa-phone-alt"></i> <a href="tel: {agent.phones}" title="Zadzwoń i porozmawiaj na temat tej nieruchomości już teraz!"><b>{agent.phones}</b></a>'); ?></li>
									<li><?php echo $WWACCustomArchives -> showAgentEmailAddress('<i class="fas fa-at"></i> <a href="mailto: {agent.email}" title="Napisz do mnie wiadomość e-mail w sprawie tej nieruchomości!"><b>{agent.email}</b></a>'); ?></li>
									<li><?php echo $WWACCustomArchives -> showAgentLicenseNr('<i class="fas fa-id-badge"></i> <b>{agent.licensenr}</b>'); ?></li>
								</ul>
							</div>
						</div>
						<?php
						}
						?>
						
						<div class="wwac-offer-basic-info">
							<h3>Informacje o ofercie</h3>
							<?php
							echo $WWACCustomArchives -> showPropertyMeta('<b>Cena:</b> {meta}<br>', 'propertyPrice');
							echo $WWACCustomArchives -> showPropertyTax('<b>Lokalizacja:</b> {taxonomy}</br>', 'Localization');
							echo $WWACCustomArchives -> showPropertyTax('<b>Kategoria:</b> {taxonomy}</br>', 'Category');
							echo $WWACCustomArchives -> showPropertyTax('<b>Typ:</b> {taxonomy}</br>', 'Type');
							?>
						</div>
						
						<ul class="wwac-offer-info-list">
							<?php
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-ruler"></i> <b>Powierzchnia:</b> {meta}</li>', 'propertyArea');
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-calendar"></i> <b>Rok budowy:</b> {meta}</li>', 'propertyYearBuilt');
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-minus"></i> <b>Piętro:</b> {meta}</li>', 'propertyFloor');
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-minus"></i> <b>Liczba pięter:</b> {meta}</li>', 'propertyFloors');
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-car"></i> <b>Garaż:</b> {meta}</li>', 'propertyGarage');
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-parking"></i> <b>Miejsca parkingowe:</b> {meta}</li>', 'propertyParkingSpacesNo');
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-certificate"></i> <b>Rynek:</b> {meta}</li>', 'mortgageMarket');
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-door-open"></i> <b>Liczba pokoi:</b> {meta}</li>', 'propertyRooms');
							echo $WWACCustomArchives -> showPropertyMeta('<li><i class="fas fa-arrows-alt-v"></i> <b>Winda:</b> {meta}</li>', 'propertyElevator');
							?>
						</ul>
					</div>
				</div>
            </article>
			
        <?php endwhile; ?>
    </main>
</div>

<?php get_footer(); ?>