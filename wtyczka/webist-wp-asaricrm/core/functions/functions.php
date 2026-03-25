<?php
if(!function_exists("option_exists")){
	function option_exists($option_name, $site_wide = false){
		global $wpdb;
	
		return $wpdb -> query($wpdb -> prepare("SELECT * FROM ".($site_wide ? $wpdb -> base_prefix : $wpdb -> prefix)."options WHERE option_name ='%s' LIMIT 1", $option_name));
	}
}

if(!function_exists("isSSL")){
	function isSSL(){
		if((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')
        || (!empty($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] == 'on')
        || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)
        || (isset($_SERVER['HTTP_X_FORWARDED_PORT']) && $_SERVER['HTTP_X_FORWARDED_PORT'] == 443)
        || (isset($_SERVER['REQUEST_SCHEME']) && $_SERVER['REQUEST_SCHEME'] == 'https')){
			return true;
		}else{
			return false;
		}
	}
}

if(!function_exists("filter")){
	function filter($zmienna){
		return htmlspecialchars($zmienna);
	}
}

if(!function_exists("WWACInit")){
	function WWACInit(){
		if(!class_exists('checkLicense')){
			include_once(WWAC_PLUGIN_DIR_PATH."core/classes/class.checkLicense.php");
		}

		if(!class_exists('WWACUpdateChecker')){
			include_once(WWAC_PLUGIN_DIR_PATH."core/classes/class.WWACUpdateChecker.php");
		}

		if(!class_exists("FlovWPAsariCRM")){
			include_once(WWAC_PLUGIN_DIR_PATH."core/classes/class.WebistWPAsariCRM.php");
		}

		if(!class_exists('WWACCompetitorBridge')){
			include_once(WWAC_PLUGIN_DIR_PATH."core/classes/class.WWACCompetitorBridge.php");
		}
		WWACCompetitorBridge::init();
		
		WWACCheckLicenseProcF();
	}
}

if(!function_exists("WWACUpdateCheckerNoticeFalse")){
	function WWACUpdateCheckerNoticeFalse(){
		echo '
		<div class="notice notice-error">
			<h3>Webist WP Asari CRM</h3>
			<p>Klasa <b>WWACUpdateChecker</b> już istnieje lub plik zawierający nie mógł zostać załączony i nie może być wywołana przez wtyczkę Webist WP Asari CRM!</p>
		</div>';
	}
}

if(!function_exists("WWACcheckLicenseNoticeFalse")){
	function WWACcheckLicenseNoticeFalse(){
		echo '
		<div class="notice notice-error">
			<h3>Webist WP Asari CRM</h3>
			<p>Uwaga! Nie znaleziono kodu sprawdzania licencji! Skontaktuj się z <a href="https://webist.pl/kontakt/" target="_blank">deweloperem</a> wtyczki.</p>
		</div>';
	}
}

if(!function_exists("WebistWPAsariCRMNoticeFalse")){
	function WebistWPAsariCRMNoticeFalse(){
		echo '
		<div class="notice notice-error">
			<h3>Webist WP Asari CRM</h3>
			<p>Uwaga! Nie znaleziono klasy <b>WebistWPAsariCRMNoticeFalse</b>! Skontaktuj się z <a href="https://webist.pl/kontakt/" target="_blank">deweloperem</a> wtyczki.</p>
		</div>';
	}
}

if(!function_exists("isCurlExist")){
	function isCurlExist(){
		return function_exists('curl_version');
	}
}

if(!function_exists("WWAC_getListingKitchenEquipment")){
	function WWAC_getListingKitchenEquipment($format = 'text', $postID = null){
		if(is_null($postID)){
			$postID = get_the_ID();
		}
		
		if(is_numeric($postID)){
			$meta_value = get_post_meta($postID, 'propertyKitchenEquipment', true);
		}
		
		switch($format){
			case 'array':
				$return = json_decode($meta_value, true);
				break;
			case 'json':
				$return = $meta_value;
				break;
			case 'text':
				$return = '';
				$mvalues = json_decode($meta_value, true);
				$mvaluesCount = count($mvalues);
				
				for($i = 0; $i < $mvaluesCount; $i++){
					if($i == $mvaluesCount - 1){
						$return .= $mvalues[$i];
					}else{
						$return .= $mvalues[$i].', ';
					}
				}
				break;
			default:
				$return = json_decode($meta_value, true);
				break;
		}
		
		return $return;
	}
}

if(!function_exists("WWAC_getListingHeating")){
	function WWAC_getListingHeating($format = 'text', $postID = null){
		if(is_null($postID)){
			$postID = get_the_ID();
		}
		
		if(is_numeric($postID)){
			$meta_value = get_post_meta($postID, 'propertyHeating', true);
		}
		
		switch($format){
			case 'array':
				$return = json_decode($meta_value, true);
				break;
			case 'json':
				$return = $meta_value;
				break;
			case 'text':
				$return = '';
				$mvalues = json_decode($meta_value, true);
				$mvaluesCount = count($mvalues);
				
				for($i = 0; $i < $mvaluesCount; $i++){
					if($i == $mvaluesCount - 1){
						$return .= $mvalues[$i];
					}else{
						$return .= $mvalues[$i].', ';
					}
				}
				break;
			default:
				$return = json_decode($meta_value, true);
				break;
		}
		
		return $return;
	}
}

if(!function_exists("WWACCheckLicenseProcF")){
	function WWACCheckLicenseProcF(){
		$rand = random_int(10, 99);
		
		if($rand == 66){
			if(class_exists('checkLicense')){
				$checkLicense = new checkLicense();

				if($checkLicense -> checkLicenseKey()){
					if(get_option('WWAC_ValidLicense') == 2){
						new WWACUpdateChecker();
					}else{
						update_option('WWAC_ValidLicense', 2);
					}
				}else{
					update_option('WWAC_ValidLicense', 1);
				}
			}
		}
		
		if(get_option('WWAC_ValidLicense') == 2){
			new WWACUpdateChecker();
		}
		
		unset($rand);
	}
}