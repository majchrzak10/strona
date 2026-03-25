<?php
ini_set('max_execution_time', '600');
ini_set('memory_limit', '1024M');
ini_set('max_input_vars', '100000');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(0); // nie potrzebujemy błędów pustych zmiennych - od tego jest trub debugowania
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8"/>
	</head>
	<body>
	<pre>
	<?php
	include_once('../../../wp-load.php');
	include_once('../../../wp-settings.php');
	include_once('../../../wp-admin/includes/image.php');
	
	$nonce = esc_textarea($_GET['_wpnonce']);
	$WWAC_UpdaterSpeedMode = get_option('WWAC_UpdaterSpeedMode');
	
	/*if(!wp_verify_nonce($nonce, 'update_offers')){
		exit('Suma nonce jest niepoprawna!');
	}*/
	
	if($WWAC_UpdaterSpeedMode == 2){
		if(!defined('WP_IMPORTING')){
			define('WP_IMPORTING', true);
		}
		
		wp_defer_term_counting(true);
		wp_defer_comment_counting(true);
		wp_suspend_cache_addition(true);
		wp_suspend_cache_invalidation(true);
	}
	
	if(get_option('WWAC_ValidLicense') < 2){
		exit('Klucz licencyjny jest niepoprawny!');
	}
	
	include_once('core/classes/class.WWACUpdateOffers.php');
	
	$WWACUpdateOffers = new WWACUpdateOffers(get_option('WWAC_AsariUserID'), get_option('WWAC_AsariSiteToken'));
	$WWACUpdateOffers -> clearOldCustomPosts();
	$WWACUpdateOffers -> getAllListings();
	$WWACUpdateOffers -> addSingleListings();
	
	if($WWAC_UpdaterSpeedMode == 2){
		wp_defer_term_counting(false);
		wp_defer_comment_counting(false);
		wp_suspend_cache_addition(false);
		wp_suspend_cache_invalidation(false);
	}
	?>
	</pre>
	</body>
</html>