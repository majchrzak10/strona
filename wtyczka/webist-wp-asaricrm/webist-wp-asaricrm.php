<?php
/*
@wordpress-plugin
Plugin Name: Webist WP Asari CRM
Plugin URI: https://webist.pl/wtyczki/integracja-webist-wp-asari-crm/
Description: Synchronizacja danych z Asari CRM do WordPress'a.
Version: 1.1.5
Author: <a href="https://webist.pl" target="_blank">Webist</a>
Requires PHP: 8.1
*/

if(!defined('ABSPATH')){
	exit;
}

define('COLLISION_WWPA', 'Webist WP AsariCRM');
define('WWAC_PRODUCT_NAME', 'Webist WP Asari CRM');
define('WWAC_PRODUCT_TYPE', 'oneDomain');
define('WWAC_USER_DOMAIN', $_SERVER['SERVER_NAME']);
define('WWAC_PRODUCT_LICENSE_KEY', get_option('WWAC_LicenseKey'));
define('WWAC_PLUGIN_VERSION', '1.1.5');
define('WWAC_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('WWAC_PLUGIN_DIR_URL', plugin_dir_url(__FILE__));
define('WWAC_PLUGIN_DIR_NAME', dirname(plugin_basename(__FILE__)));
define('WWAC_PLUGIN_MAIN_FILE', basename(__FILE__));
define('WWAC_PLUGIN_MENU_SLUG', 'webist-wp-asaricrm');
define('WWAC_REQ_CODE', get_option('WWAC_RequirementsCode'));
define('WWAC_API_TYPE', get_option('WWAC_AsariAPIType'));
define('WWAC_ASARI_CONNECTION_STATUS', get_option('WWAC_AsariConnectionStatus'));
define('WWAC_ASARI_USERID', get_option('WWAC_AsariUserID'));
define('WWAC_ASARI_SITETOKEN', get_option('WWAC_AsariSiteToken'));

include_once(WWAC_PLUGIN_DIR_PATH."core/functions/functions.php");

WWACInit();

$WebistWPAsariCRM = new FlovWPAsariCRM();
?>