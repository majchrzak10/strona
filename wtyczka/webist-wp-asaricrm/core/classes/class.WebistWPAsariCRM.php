<?php
class FlovWPAsariCRM{
		
	public function __construct(){
		add_action('admin_init', array($this, 'WWACCollision'));
		add_action('init', array($this, 'WWACRegisterOptions'));
		add_action('init', array($this, 'WWACRegisterCustomPostType'));
		add_action('init', array($this, 'WWACRegisterCustomPostTaxonomies'));
		add_action('Agent_edit_form_fields', array($this, 'taxonomyAgentExtraFields'), 10, 2);
		add_action('edited_Agent', array($this, 'taxonomyAgentSaveExtraFields'), 10, 2);
		add_action('add_meta_boxes', array($this, 'WWACRemoveYoastMeta'), 11);
		add_action('add_meta_boxes', array($this, 'WWACCustomPostTypeMetaBoxes'));
		add_action('add_meta_boxes', array($this, 'WWACSearchMetaBoxes'));
		add_action('save_post', array($this, 'WWACCustomPostTypeSaveMetaBoxes'), 10, 2);
		add_action('save_post', array($this, 'WWACSearchSaveMetaBoxes'), 10, 2);
		add_filter('manage_edit-nieruchomosci_columns', array($this, 'WWACCustomPostTypeColumns'));
		add_filter('manage_edit-nieruchomosci_sortable_columns', array($this, 'WWACCustomPostTypeColumnsSortable'));
		add_action('manage_nieruchomosci_posts_custom_column', array($this, 'WWACCustomPostTypeColumnsContent'), 10, 2);
		add_action('admin_menu', array($this, 'WWACRegisterMenu'));
		
		add_action('wp_enqueue_scripts', array($this, 'WWACRegisterCSSJS'));
		add_action('admin_enqueue_scripts', array($this, 'WWACRegisterCSSJS'));
		add_action('admin_enqueue_scripts', array($this, 'WWACEnqueueAdminPluginAssets'));
		add_shortcode('all_properties', array($this, 'WWACAllPropertiesShortcode'));
		add_shortcode('properties_archive', array($this, 'WWACAllPropertiesArchive'));
		add_shortcode('property_meta', array($this, 'WWACGetPropertyMetaShortcode'));
		add_shortcode('property_agent_meta', array($this, 'WWACGetPropertyAgentMetaShortcode')); //[property_agent_meta meta_key="klucz_metadanych"] | [property_agent_meta meta_key="klucz_metadanych" post_id="123"]
		add_shortcode('property_map', array($this, 'WWACGetPropertyMapShortcode')); //[property_map] | [property_map post_id="123"]
		add_shortcode('property_map_inside', array($this, 'WWACGetPropertyMapInsideShortcode')); //[property_map_inside] | [property_map_inside post_id="123"]
		add_shortcode('property_gallery', array($this, 'WWACGalleryShortcode')); //[property_gallery] | [property_gallery post_id="123"]
		add_shortcode('property_tax', array($this, 'WWACGetPropertyTaxShortcode')); //[property_tax key='localization/type/category' link='true/false' title='Tekst title linku' post_id=ID_POSTA]
		add_shortcode('property_search', array($this, 'WWACPropertySearchShortcode')); //[property_search id=ID_WYSZUKIWARKI]
		add_action('wp_dashboard_setup', array($this, 'WWACRegisterDashboardWidgets'));
		add_filter('plugin_row_meta', array($this, 'WWACPluginRowMeta'), 10, 2);
		add_filter('body_class', array($this, 'WWACBodyClass'));
		add_filter('template_include', array($this, 'WWACCPTSingleArchiveTemplate'));
		add_filter('template_include', array($this, 'WWACCPTAllArchiveTemplate'));
		add_filter('template_include', array($this, 'WWACCPTAgentArchiveTemplate'));
		add_action('pre_get_posts', array($this, 'WWAC_SearchParamsQueryModifier'));
		// AJAX
		add_action('wp_ajax_WWACAjax_getUpdaterValues', array($this, 'WWACAjax_getUpdaterValues'));
		add_action('wp_ajax_WWACAjax_refreshSearchFormOptions', array($this, 'WWACAjax_refreshSearchFormOptions'));
		add_action('wp_ajax_nopriv_WWACAjax_refreshSearchFormOptions', array($this, 'WWACAjax_refreshSearchFormOptions'));
		
		$this -> WWACRandomConnectionChecker();
	}

	public function WWACCollision(){
        $asariPluginstoCheck = array(
            'webist-wp-asaricrm-pro/webist-wp-asaricrm-pro.php',
        );
		
		$estiPluginstoCheck = array(
			'webist-wp-esticrm/webist-wp-esticrm.php',
			'webist-wp-esticrm-pro/webist-wp-esticrm-pro.php'
        );
		
		$noticeAsari = '<style>#message, #webist-esti-notice{display:none;}</style>
		<div class="notice notice-error is-dismissible" id="webist-asari-notice">
			<p>Wyłącz wtyczkę Webist WP Asari CRM Pro i dopiero aktywuj wtyczkę Webist WP Asari CRM. <a href="" target="_blank">Dlaczego tak jest?</a></p>
		</div>';
		
		$noticeEsti = '<style>#message{display:none;}, #webist-esti-notice</style>
		<div class="notice notice-error is-dismissible" id="webist-asari-notice">
			<p>Wyłącz wtyczkę Webist WP Esti CRM/Webist WP Esti CRM Pro i dopiero aktywuj wtyczkę Webist WP Asari CRM. <a href="" target="_blank">Dlaczego tak jest?</a></p>
		</div>';
		
		if(!defined('COLLISION_WWPAP')){
			foreach($asariPluginstoCheck as $plugin_path){
				if(is_plugin_active($plugin_path)){
					deactivate_plugins(WWAC_PLUGIN_DIR_PATH.WWAC_PLUGIN_DIR_NAME.'.php');
					echo $noticeAsari;
				}
			}
		}else{
			deactivate_plugins(WWAC_PLUGIN_DIR_PATH.WWAC_PLUGIN_DIR_NAME.'.php');
			echo $noticeAsari;
		}
		
		if(!defined('COLLISION_WWPEP') && !defined('COLLISION_WWPE')){
			foreach($estiPluginstoCheck as $plugin_path){
				if(is_plugin_active($plugin_path)){
					deactivate_plugins(WWAC_PLUGIN_DIR_PATH.WWAC_PLUGIN_DIR_NAME.'.php');
					echo $noticeEsti;
				}
			}
		}else{
			deactivate_plugins(WWAC_PLUGIN_DIR_PATH.WWAC_PLUGIN_DIR_NAME.'.php');
			echo $noticeEsti;
		}
	}
	
	public function WWACRegisterOptions(){
		$optionsNames = Array(
			'WWAC_LicenseKey' => '',
			'WWAC_ValidLicense' => 0,
			'WWAC_RequirementsCode' => 0,
			'WWAC_AsariAPIType' => 'apiasaripro', 
			'WWAC_AsariConnectionStatus' => 0,
			'WWAC_AsariUserID' => '',
			'WWAC_AsariSiteToken' => '',
			'WWAC_TitleType' => 1,
			'WWAC_TitleIDType' => 1,
			'WWAC_GalleryType' => 1,
			'WWAC_PriceType' => 1,
			'WWAC_FooterStatus' => 1,
			'WWAC_Footer_Name' => '',
			'WWAC_Footer_Address' => '',
			'WWAC_Footer_PhoneNumber' => '',
			'WWAC_Footer_Email' => '',
			//0.3
			//0.4
			'WWAC_downloadImages' => 1,
			//0.6
			'WWAC_LastUpdatedNumber' => 0,
			'WWAC_LastUpdatedJump' => 1,
			'WWAC_agentInfo' => 1,
			'WWAC_updateListingsType' => 1,
			//0.7
			'WWAC_Map' => 1,
			'WWAC_PropertyMapZoom' => 18,
			//0.8
			//'WWAC_GalleryDownloadType' => 1,
			'WWAC_PriceTypeSQM' => 1,
			//0.9
			'WWAC_Archives_SingleOffer_Template' => 'basic',
			'WWAC_Archives_SingleOffer_TemplateType' => 'internal',
			'WWAC_Archives_SingleOffer_TemplateStatus' => 1,
			'WWAC_Archives_SingleOffer_TemplateHero' => 1,
			'WWAC_Archives_SingleOffer_AgentPanel' => 1,
			'WWAC_Archives_SingleOffer_AgentPhoto' => 1,
			'WWAC_Archives_SingleOffer_AgentLicenseNr' => 1,
			'WWAC_Archives_SingleOffer_AgentNames' => 1,
			'WWAC_Archives_SingleOffer_AgentPhoneNumbers' => 1,
			'WWAC_Archives_SingleOffer_AgentEmailAddress' => 1,
			'WWAC_Archives_SingleOffer_propertyPrice' => 1,
			'WWAC_Archives_SingleOffer_Localization' => 1,
			'WWAC_Archives_SingleOffer_Category' => 1,
			'WWAC_Archives_SingleOffer_Type' => 1,
			'WWAC_Archives_SingleOffer_propertyArea' => 1,
			'WWAC_Archives_SingleOffer_propertyYearBuilt' => 1,
			'WWAC_Archives_SingleOffer_propertyFloor' => 1,
			'WWAC_Archives_SingleOffer_propertyFloors' => 1,
			'WWAC_Archives_SingleOffer_propertyGarage' => 1,
			'WWAC_Archives_SingleOffer_propertyParkingSpacesNo' => 1,
			'WWAC_Archives_SingleOffer_propertyRooms' => 1,
			'WWAC_Archives_SingleOffer_propertyElevator' => 1,
			'WWAC_Archives_SingleOffer_mortgageMarket' => 1,
			'WWAC_Archives_AllOffers_Template' => 'basic',
			'WWAC_Archives_AllOffers_TemplateType' => 'internal',
			'WWAC_Archives_AllOffers_TemplateStatus' => 0,
			'WWAC_Archives_AllOffers_TemplateHero' => 1,
			'WWAC_Archives_AllOffers_propertyPrice' => 1,
			'WWAC_Archives_AllOffers_Localization' => 1,
			'WWAC_Archives_AllOffers_Category' => 0,
			'WWAC_Archives_AllOffers_Type' => 0,
			'WWAC_Archives_AllOffers_propertyArea' => 1,
			'WWAC_Archives_AllOffers_propertyYearBuilt' => 0,
			'WWAC_Archives_AllOffers_propertyFloor' => 0,
			'WWAC_Archives_AllOffers_propertyFloors' => 0,
			'WWAC_Archives_AllOffers_propertyGarage' => 0,
			'WWAC_Archives_AllOffers_propertyParkingSpacesNo' => 0,
			'WWAC_Archives_AllOffers_propertyRooms' => 0,
			'WWAC_Archives_AllOffers_propertyElevator' => 0,
			'WWAC_Archives_AllOffers_mortgageMarket' => 1,
			'WWAC_Archives_AllOffers_excerpt' => 1,
			'WWAC_Updater_RefreshRate' => 25,
			'WWAC_Updater_FlushCache' => 1,
			'WWAC_updateContentShortcodes' => 2,
			//1.0
			'WWAC_updateListingsParameters' => 1,
			//1.1.0
			'WWAC_updateDownloadAgentImage' => 1,
			//1.1.2
			'WWAC_updateListingsParametersDays' => 1000,
			//1.1.3
			'WWAC_Archives_Agent_Template' => 'basic',
			'WWAC_Archives_Agent_TemplateType' => 'internal',
			'WWAC_Archives_Agent_TemplateStatus' => 1,
			'WWAC_Archives_Agent_TemplateHero' => 1,
			'WWAC_Archives_Agent_AgentPanel' => 1,
			'WWAC_Archives_Agent_AgentPhoto' => 1,
			'WWAC_Archives_Agent_AgentLicenseNr' => 1,
			'WWAC_Archives_Agent_AgentNames' => 1,
			'WWAC_Archives_Agent_AgentPhoneNumbers' => 1,
			'WWAC_Archives_Agent_AgentEmailAddress' => 1,
			'WWAC_Archives_Agent_propertyPrice' => 1,
			'WWAC_Archives_Agent_Localization' => 1,
			'WWAC_Archives_Agent_Category' => 1,
			'WWAC_Archives_Agent_Type' => 1,
			'WWAC_Archives_Agent_propertyArea' => 1,
			'WWAC_Archives_Agent_propertyYearBuilt' => 1,
			'WWAC_Archives_Agent_propertyFloor' => 1,
			'WWAC_Archives_Agent_propertyFloors' => 1,
			'WWAC_Archives_Agent_propertyGarage' => 1,
			'WWAC_Archives_Agent_propertyParkingSpacesNo' => 1,
			'WWAC_Archives_Agent_propertyRooms' => 1,
			'WWAC_Archives_Agent_propertyElevator' => 1,
			'WWAC_Archives_Agent_mortgageMarket' => 1,
			//1.1.4
			'WWAC_Updater_AutoCall' => 2,
			'WWAC_Plugin_Version' => WWAC_PLUGIN_VERSION,
			'WWAC_UpdaterSpeedMode' => 1,
			'WWAC_CompetitorBridgeURL' => '',
			'WWAC_CompetitorAccountsCache' => array(),
		);
		
		if(get_option('WWAC_Plugin_Version') != WWAC_PLUGIN_VERSION){
			foreach($optionsNames as $key => $value){
				if(!option_exists($key)){
					add_option($key, $value);
				}
			}
			
			update_option('WWAC_Plugin_Version', WWAC_PLUGIN_VERSION);
		}
	}
	
	public function WWACBodyClass($classes){
		if(is_singular('nieruchomosci')){
			$classes[] = 'wwac';
		}
		
        return $classes;
    }
	
	public function WWACRegisterCustomPostType(){
		$labels = array(
			'name' => _x('Nieruchomości', 'post type general name'),
			'singular_name' => _x('Nieruchomość', 'post type singular name'),
			'add_new' => 'Dodaj nieruchomość',
			'add_new_item' => 'Dodaj nową nieruchomość',
			'edit_item' => 'Edytuj nieruchomość',
			'new_item' => 'Nowa nieruchomość',
			'view_item' => 'Zobacz nieruchomości',
			'search_items' => 'Szukaj nieruchomości',
			'not_found' =>  'Nie znaleziono żadnych nieruchomości.',
			'not_found_in_trash' => 'Nie znaleziono żadnych nieruchomości w koszu.',
			//'menu_name' => 'Nieruchomości'
		);
			
		$args = array(
			'labels' => $labels,
			'hierarchical' => true,
			'public' => true,
			'has_archive' => true,
			'rewrite' => array(
				'slug' => apply_filters('WWAC_PropertiesSlug', 'nieruchomosci')
			),
			'exclude_from_search' => false,
			'menu_icon' => 'dashicons-building',
			'register_meta_box_cb' => array($this, 'WWACCustomPostTypeMetaBoxes'),
			'supports' => array('title', 'editor', 'thumbnail', 'page-attributes', 'excerpt'),
		);
			
		register_post_type('nieruchomosci', $args);
		
		$labels = array(
			'name' => _x('Wyszukiwarka ofert', 'post type general name'),
			'singular_name' => _x('Wyszukiwarka', 'post type singular name'),
			'add_new' => 'Stwórz wyszukiwarkę',
			'add_new_item' => 'Stwórz wyszukiwarkę ofert',
			'edit_item' => 'Edytuj wyszukiwarkę',
			'new_item' => 'Nowa wyszukiwarka',
			'view_item' => 'Zobacz wyszukiwarkę',
			'search_items' => 'Szukaj wyszukiwarki',
			'not_found' =>  'Nie znaleziono żadnej wyszukiwarki.',
			'not_found_in_trash' => 'Nie znaleziono żadnych wyszukiwarek w koszu.',
			//'menu_name' => 'Nieruchomości'
		);
			
		$args = array(
			'labels' => $labels,
			'hierarchical' => true,
			'public' => true,
			'has_archive' => true,
			'rewrite' => array(
				'slug' => 'wwac-search'
			),
			'exclude_from_search' => false,
			'menu_icon' => 'dashicons-search',
			'register_meta_box_cb' => array($this, 'WWACSearchMetaBoxes'),
			'supports' => array('title'),
		);
			
		register_post_type('wwac-search', $args);
	}
	
	public function WWACRegisterCustomPostTaxonomies(){
		$labels = array(
			'name' => _x('Kategorie', 'taxonomy general name' ),
			'singular_name' => _x('Kategoria', 'taxonomy singular name'),
			'add_new_item' => __( 'Dodaj kategorię nieruchomości' ),
			//'menu_name' => __('Kategorie'),
		);
			
		$args = array(
			'labels' => $labels,
			'public' => true,
			'hierarchical' => true,
			'exclude_from_search' => false,
			'rewrite' => array(
				'slug' => apply_filters('WWAC_PropertiesCategorySlug', 'kategorie-nieruchomosci')
			)
		);

		register_taxonomy('Kategorie', array('nieruchomosci'), $args);
			
		$labels = array(
			'name' => _x('Typ', 'taxonomy general name' ),
			'singular_name' => _x('Typ', 'taxonomy singular name'),
			'add_new_item' => __( 'Dodaj typ nieruchomości' ),
		);
			
		$args = array(
			'labels' => $labels,
			'public' => true,
			'hierarchical' => true,
			'exclude_from_search' => false,
			'rewrite' => array(
				'slug' => apply_filters('WWAC_PropertiesTypeSlug', 'typy-nieruchomosci')
			)
		);

		register_taxonomy('Typ', array('nieruchomosci'), $args);
			
		$labels = array(
			'name' => _x('Lokalizacja', 'taxonomy general name' ),
			'singular_name' => _x('Lokalizacja', 'taxonomy singular name'),
			'add_new_item' => __( 'Dodaj lokalizację nieruchomości' ),
		);
			
		$args = array(
			'labels' => $labels,
			'public' => true,
			'hierarchical' => true,
			'exclude_from_search' => false,
			'rewrite' => array(
				'slug' => apply_filters('WWAC_PropertiesLocalizationSlug', 'lokalizacje-nieruchomosci')
			)
		);

		register_taxonomy('Lokalizacja', array('nieruchomosci'), $args);
		
		$labels = array(
			'name' => _x('Województwo', 'taxonomy general name'),
			'singular_name' => _x('Województwo', 'taxonomy singular name'),
			'add_new_item' => __('Dodaj województwo nieruchomości'),
		);
			
		$args = array(
			'labels' => $labels,
			'public' => true,
			'hierarchical' => true,
			'exclude_from_search' => false,
			'rewrite' => array(
				'slug' => apply_filters('WWAC_PropertiesProvinceSlug', 'wojewodztwa-nieruchomosci')
			)
		);

		register_taxonomy('Wojewodztwo', array('nieruchomosci'), $args);
		
		$labels = array(
			'name' => _x('Dzielnica', 'taxonomy general name'),
			'singular_name' => _x('Dzielnica', 'taxonomy singular name'),
			'add_new_item' => __('Dodaj dzielnicę nieruchomości'),
		);
			
		$args = array(
			'labels' => $labels,
			'public' => true,
			'hierarchical' => true,
			'exclude_from_search' => false,
			'rewrite' => array(
				'slug' => apply_filters('WWAC_PropertiesDistrictSlug', 'dzielnice-nieruchomosci')
			)
		);

		register_taxonomy('Dzielnica', array('nieruchomosci'), $args);
		
		$labels = array(
			'name' => _x('Agent', 'taxonomy general name'),
			'singular_name' => _x('Agent', 'taxonomy singular name'),
			'add_new_item' => __('Dodaj agenta nieruchomości'),
		);
			
		$args = array(
			'labels' => $labels,
			'public' => true,
			'hierarchical' => true,
			'exclude_from_search' => false,
			'rewrite' => array(
				'slug' => apply_filters('WWAC_PropertiesAgentSlug', 'agent-nieruchomosci')
			)
		);

		register_taxonomy('Agent', array('nieruchomosci'), $args);
	}
	
	public function taxonomyAgentExtraFields($term){
		wp_enqueue_media();
		
		$email = get_term_meta($term->term_id, 'WWAC_AgentEmail', true);
		$phone_nr1 = get_term_meta($term->term_id, 'WWAC_AgentFirstPhoneNumber', true);
		$phone_nr2 = get_term_meta($term->term_id, 'WWAC_AgentSecondPhoneNumber', true);
		$license_nr = get_term_meta($term->term_id, 'WWAC_AgentLicenseNumber', true);
		$image_id = get_term_meta($term->term_id, 'WWAC_AgentImageID', true);
		?>
		<tr class="form-field term-group">
			<th scope="row">
				<label for="WWAC_AgentEmail">Adres e-mail</label>
			</th>
			<td>
				<input type="text" name="WWAC_AgentEmail" id="WWAC_AgentEmail" value="<?php echo $email; ?>"/>
			</td>
		</tr>
		
		<tr class="form-field term-group">
			<th scope="row">
				<label for="WWAC_AgentFirstPhoneNumber">Numer telefonu #1</label>
			</th>
			<td>
				<input type="text" name="WWAC_AgentFirstPhoneNumber" id="WWAC_AgentFirstPhoneNumber" value="<?php echo $phone_nr1; ?>"/>
			</td>
		</tr>
		
		<tr class="form-field term-group">
			<th scope="row">
				<label for="WWAC_AgentSecondPhoneNumber">Numer telefonu #2</label>
			</th>
			<td>
				<input type="text" name="WWAC_AgentSecondPhoneNumber" id="WWAC_AgentSecondPhoneNumber" value="<?php echo $phone_nr2; ?>"/>
			</td>
		</tr>
		
		<tr class="form-field term-group">
			<th scope="row">
				<label for="WWAC_AgentLicenseNumber">Numer licencji</label>
			</th>
			<td>
				<input type="text" name="WWAC_AgentLicenseNumber" id="WWAC_AgentLicenseNumber" value="<?php echo $license_nr; ?>"/>
			</td>
		</tr>
		
		<tr class="form-field term-group">
			<th scope="row">
				<label for="WWAC_AgentImageID">Ustawiony obrazek</label>
			</th>
			<td>
				<input type="hidden" id="WWAC_AgentImageID" name="WWAC_AgentImageID" class="custom_media_url" value="<?php echo $image_id; ?>">
				<div id="WWAC_AgentImgWrapper" style="max-width: 200px; width: 200px; height: 200px !important;">
				<?php
				if($image_id){
					echo '<img src="'.wp_get_attachment_image_url($image_id, 'large').'" style="width: 200px; height: 200px !important; object-fit: cover; border: 1px solid #aeaeae;"/>';
				}else{
					echo '<div style="width: 200px; height: 200px; display: flex; justify-content: center; align-items: center; border: 1px solid #aeaeae;">Brak</div>';
				}
				?>
				</div>
			</td>
		</tr>
		
		<tr class="form-field term-group-wrap">
			<th scope="row">
				<label for="WWAC_AgentImageID">Wybierz obrazek</label>
			</th>
			<td>
				<input type="button" class="button button-secondary ct_tax_media_button" id="ct_tax_media_button" name="ct_tax_media_button" value="Dodaj obrazek" />
				<input type="button" class="button button-secondary ct_tax_media_remove" id="ct_tax_media_remove" name="ct_tax_media_remove" value="Usuń obrazek" />
			</td>
		</tr>
		
		<input type="hidden" name="WWAC_postAgentTerm" value="true"/>
		
		<script>
		jQuery(document).ready(function($){
			function WWAC_AgentMediaUpload(button_class){
				var _custom_media = true,
				_orig_send_attachment = wp.media.editor.send.attachment;

				$('body').on('click', button_class, function(e){
					var button_id = '#' + $(this).attr('id');
					var send_attachment_bkp = wp.media.editor.send.attachment;
					var button = $(button_id);
					_custom_media = true;
					wp.media.editor.send.attachment = function(props, attachment){
						if(_custom_media){
							$('#WWAC_AgentImageID').val(attachment.id);
							$('#WWAC_AgentImgWrapper').html('<img src="' + attachment.url + '" style="width: 200px; height: 200px; object-fit: cover; border: 1px solid #aeaeae;"/>');
						}else{
							return _orig_send_attachment.apply(button_id, [props, attachment]);
						}
					}
					
					wp.media.editor.open(button);
					return false;
				});
			}
			
			WWAC_AgentMediaUpload('.ct_tax_media_button');
			
			$('.ct_tax_media_remove').click(function(e){
				e.preventDefault();
				$('#WWAC_AgentImageID').val('');
				$('#WWAC_AgentImgWrapper').html('<div style="width: 200px; height: 200px; display: flex; justify-content: center; align-items: center; border: 1px solid #aeaeae;">Brak</div>');
			});
		});
		</script>
	<?php
	}
	
	public function taxonomyAgentSaveExtraFields($term_id){
		if(isSet($_POST['WWAC_postAgentTerm'])){
			$WWAC_AgentImageID = (int)sanitize_text_field($_POST['WWAC_AgentImageID']);
			$WWAC_AgentEmail = sanitize_text_field($_POST['WWAC_AgentEmail']);
			$WWAC_AgentFirstPhoneNumber = sanitize_text_field($_POST['WWAC_AgentFirstPhoneNumber']);
			$WWAC_AgentSecondPhoneNumber = sanitize_text_field($_POST['WWAC_AgentSecondPhoneNumber']);
			$WWAC_AgentLicenseNumber = sanitize_text_field($_POST['WWAC_AgentLicenseNumber']);
			
			update_term_meta($term_id, 'WWAC_AgentImageID', $WWAC_AgentImageID);
			update_term_meta($term_id, 'WWAC_AgentEmail', $WWAC_AgentEmail);
			update_term_meta($term_id, 'WWAC_AgentFirstPhoneNumber', $WWAC_AgentFirstPhoneNumber);
			update_term_meta($term_id, 'WWAC_AgentSecondPhoneNumber', $WWAC_AgentSecondPhoneNumber);
			update_term_meta($term_id, 'WWAC_AgentLicenseNumber', $WWAC_AgentLicenseNumber);
		}
	}
	
	public function WWACRemoveYoastMeta(){
		remove_meta_box('wpseo_meta', 'wwac-search', 'normal');
	}
	
	public function WWACCustomPostTypeMetaBoxes(){
		add_meta_box(
			'property_technical_info',
			'Informacje techniczne o nieruchomości',
			array($this, 'WWACTechnicalDetailsMetaboxRender'),
			'nieruchomosci',
			'normal',
			'high'
		);
		
		add_meta_box(
			'property_basic_info',
			'Podstawowe informacje o nieruchomości',
			array($this, 'WWACBasicDetailsMetaboxRender'),
			'nieruchomosci',
			'normal',
			'high'
		);
			
		add_meta_box(
			'property_info',
			'Szczegółowe informacje o nieruchomości',
			array($this, 'WWACMoreDetailsMetaboxRender'),
			'nieruchomosci',
			'normal',
			'high'
		);
		
		add_meta_box(
			'property_raw_info',
			'Surowe wartości',
			array($this, 'WWACRawDetailsMetaboxRender'),
			'nieruchomosci',
			'normal',
			'high'
		);
	}
	
	public function WWACSearchMetaBoxes(){
		add_meta_box(
			'search_info',
			'Ustawienia wyszukiwarki',
			array($this, 'WWACSearchMetaboxRender'),
			'wwac-search',
			'normal',
			'high'
		);
		
		add_meta_box(
			'search_info_redirect',
			'Przekierowanie formularza',
			array($this, 'WWACSearchRedirectMetaboxRender'),
			'wwac-search',
			'side',
			'core'
		);
		
		add_meta_box(
			'search_info_shortcode',
			'Shortcode',
			array($this, 'WWACSearchShortcodeMetaboxRender'),
			'wwac-search',
			'side',
			'core'
		);
	}
	
	public function WWACTechnicalDetailsMetaboxRender($post){
		$meta = get_post_custom($post -> ID);
		$asariOfferID = !isset($meta['asariOfferID'][0]) ? '' : $meta['asariOfferID'][0];
		$propertyParentListingID = !isset($meta['propertyParentListingID'][0]) ? '' : $meta['propertyParentListingID'][0];
		$propertyNestedListingsIDs = !isset($meta['propertyNestedListingsIDs'][0]) ? '' : implode(', ', unserialize($meta['propertyNestedListingsIDs'][0]));
		$propertyOfficeName = !isset($meta['propertyOfficeName'][0]) ? '' : $meta['propertyOfficeName'][0];
		$propertyOfferManager = ! isset($meta['propertyOfferManager'][0]) ? '' : $meta['propertyOfferManager'][0];
		$propertyStatus = !isset($meta['propertyStatus'][0]) ? '' : $meta['propertyStatus'][0];
		$propertySpecial = !isset($meta['propertySpecial'][0]) ? '' : $meta['propertySpecial'][0];
		?>
		<table class="form-table">
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="asariOfferID">ID oferty</label>
				</td>
				<td colspan="4">
					<input type="text" name="asariOfferID" class="regular-text" value="<?php echo $asariOfferID; ?>">
					<p class="description" style="font-size: 12px;">ID oferty z systemu Asari</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyParentListingID">ID oferty nadrzędnej</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyParentListingID" class="regular-text" value="<?php echo $propertyParentListingID; ?>" disabled>
					<p class="description" style="font-size: 12px;">ID oferty nadrzędnej nieruchomości</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyNestedListingsIDs">ID ofert podległych</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyNestedListingsIDs" class="regular-text" value="<?php echo $propertyNestedListingsIDs; ?>" disabled>
					<p class="description" style="font-size: 12px;">ID ofert podległych tej ofercie</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyOfficeName">Nazwa biura</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyOfficeName" class="regular-text" value="<?php echo $propertyOfficeName; ?>">
					<p class="description" style="font-size: 12px;">Nazwa biura nieruchmości oferty</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyOfferManager">Opiekun oferty</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyOfferManager" class="regular-text" value="<?php echo $propertyOfferManager; ?>">
					<p class="description" style="font-size: 12px;">Imię i nazwisko opiekuna oferty z sytemu Asari</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyStatus">Status</label>
				</td>
				<td colspan="4">
					<select name="propertyStatus" class="regular-text">
						<option value="brak" <?php echo (!strcmp($propertyStatus, 'brak')) ? 'selected' : ''; ?>>Brak</option>
						<option value="closed" <?php echo (!strcmp($propertyStatus, 'closed')) ? 'selected' : ''; ?>>Zamknięta</option>
						<option value="pending" <?php echo (!strcmp($propertyStatus, 'pending')) ? 'selected' : ''; ?>>Oczekująca</option>
						<option value="active" <?php echo (!strcmp($propertyStatus, 'active')) ? 'selected' : ''; ?>>Aktywna</option>
						
					</select>
					<p class="description" style="font-size: 12px;">Status oferty nieruchomości</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertySpecial">Specjalność</label>
				</td>
				<td colspan="4">
					<select name="propertySpecial" class="regular-text">
						<option value="0" <?php echo ($propertySpecial == 0) ? 'selected' : ''; ?>>Nie</option>
						<option value="1" <?php echo ($propertySpecial == 1) ? 'selected' : ''; ?>>Tak</option>
						
					</select>
					<p class="description" style="font-size: 12px;">Czy oferta jest specjalna?</p>
				</td>
			</tr>
		</table>
		<?php
	}
	
	public function WWACBasicDetailsMetaboxRender($post){
		$meta = get_post_custom($post -> ID);
		$propertyMarket = ! isset($meta['mortgageMarket'][0]) ? '' : $meta['mortgageMarket'][0];
		$propertyPrice = ! isset($meta['propertyPrice'][0]) ? '' : $meta['propertyPrice'][0];
		$propertyPricePerM = ! isset($meta['propertyPricePerM'][0]) ? '' : $meta['propertyPricePerM'][0];
		$propertyArea = ! isset($meta['propertyArea'][0]) ? '' : $meta['propertyArea'][0];
		$propertyLocalization = ! isset($meta['propertyLocalization'][0]) ? '' : $meta['propertyLocalization'][0];
		$propertyPriceCurrency = ! isset($meta['propertyPriceCurrency'][0]) ? '' : $meta['propertyPriceCurrency'][0];
		$propertyEnergyCertificateState = ! isset($meta['propertyEnergyCertificateState'][0]) ? 0 : $meta['propertyEnergyCertificateState'][0];
		$propertyMaterial = ! isset($meta['propertyMaterial'][0]) ? '' : $meta['propertyMaterial'][0];
		$propertyProvisionAmount = ! isset($meta['propertyProvisionAmount'][0]) ? '' : $meta['propertyProvisionAmount'][0];
		$propertyAdministrativeRent = ! isset($meta['propertyAdministrativeRent'][0]) ? '' : $meta['propertyAdministrativeRent'][0];
		$propertyCondition = ! isset($meta['propertyBuildingCondition'][0]) ? '' : $meta['propertyBuildingCondition'][0];
		?>
		<table class="form-table">
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="mortgageMarket">Rynek</label>
				</td>
				<td colspan="4">
					<select name="mortgageMarket" class="regular-text">
						<option value="empty" <?php echo (!strcmp('empty', $propertyMarket)) ? 'selected' : ''; ?>>Brak informacji</option>
						<option value="secondary" <?php echo (!strcmp('secondary', $propertyMarket)) ? 'selected' : ''; ?>>Wtórny</option>
						<option value="primary" <?php echo (!strcmp('primary', $propertyMarket)) ? 'selected' : ''; ?>>Pierwotny</option>
						
					</select>
					<p class="description" style="font-size: 12px;">Rynek nieruchomości (wtórny/pierwotny)</p>
				</td>
			</tr>
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyLocalization">Lokalizacja</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyLocalization" class="regular-text" value="<?php echo $propertyLocalization; ?>">
					<p class="description" style="font-size: 12px;">Lokalizacja nieruchomości</p>
				</td>
			</tr>
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyPrice">Cena</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyPrice" class="regular-text" value="<?php echo $propertyPrice; ?>">
					<p class="description" style="font-size: 12px;">Cena nieruchomości (tylko liczba)</p>
				</td>
			</tr>

			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyPricePerM">Cena jednostkowa</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyPricePerM" class="regular-text" value="<?php echo $propertyPricePerM; ?>">
					<p class="description" style="font-size: 12px;">Cena nieruchomości za m<sup>2</sup> (tylko liczba)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyProvisionAmount">Kaucja</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyProvisionAmount" class="regular-text" value="<?php echo $propertyProvisionAmount; ?>">
					<p class="description" style="font-size: 12px;">Wysokość kaucji (tylko liczba)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyAdministrativeRent">Czynsz</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyAdministrativeRent" class="regular-text" value="<?php echo $propertyAdministrativeRent; ?>">
					<p class="description" style="font-size: 12px;">Wysokość czynszu administracyjnego (tylko liczba)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyPriceCurrency">Waluta</label>
				</td>
				<td colspan="4">
					<select name="propertyPriceCurrency" class="regular-text">
						<option value="pln" <?php echo (!strcmp('pln', $propertyPriceCurrency)) ? 'selected' : ''; ?>>PLN</option>
						<option value="eur" <?php echo (!strcmp('eur', $propertyPriceCurrency)) ? 'selected' : ''; ?>>EUR</option>
						<option value="usd" <?php echo (!strcmp('usd', $propertyPriceCurrency)) ? 'selected' : ''; ?>>USD</option>
					</select>
					<p class="description" style="font-size: 12px;">Waluta, w której nieruchomość jest sprzedawana/wynajmowana</p>
				</td>
			</tr>

			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyArea">Powierzchnia nieruchomości</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyArea" class="regular-text" value="<?php echo $propertyArea; ?>">
					<p class="description" style="font-size: 12px;">Powierzchnia w m<sup>2</sup> (tylko liczba)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyBuildingCondition">Stan nieruchomości</label>
				</td>
				<td colspan="4">
					<select name="propertyBuildingCondition" id="propertyBuildingCondition" class="regular-text">
						<option value="" <?php echo (empty($propertyCondition)) ? 'selected' : ''; ?>>Nie podano</option>
						<option value="perfect" <?php echo (!strcmp($propertyCondition, "perfect")) ? 'selected' : ''; ?>>Idealny</option>
						<option value="verygood" <?php echo (!strcmp($propertyCondition, "verygood")) ? 'selected' : ''; ?>>Bardzo dobry</option>
						<option value="good" <?php echo (!strcmp($propertyCondition, "good")) ? 'selected' : ''; ?>>Dobry</option>
						<option value="needssmallrenovation" <?php echo (!strcmp($propertyCondition, "needssmallrenovation")) ? 'selected' : ''; ?>>Wymaga drobnego remontu</option>
						<option value="needstotalrenovation" <?php echo (!strcmp($propertyCondition, "needstotalrenovation")) ? 'selected' : ''; ?>>Wymaga generalnego remontu</option>
						<option value="needsconversion" <?php echo (!strcmp($propertyCondition, "needsconversion")) ? 'selected' : ''; ?>>Wymaga adaptacji</option>
						<option value="needsfinishing" <?php echo (!strcmp($propertyCondition, "needsfinishing")) ? 'selected' : ''; ?>>Wymaga wykończenia</option>
						<option value="openrawstate" <?php echo (!strcmp($propertyCondition, "openrawstate")) ? 'selected' : ''; ?>>Surowy otwarty</option>
						<option value="closerawstate" <?php echo (!strcmp($propertyCondition, "closerawstate")) ? 'selected' : ''; ?>>Surowy zamknięty</option>
					</select>
					<p class="description" style="font-size: 12px;">Stan nieruchomości z oferty</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyEnergyCertificateState">Certyfikat energetyczny</label>
				</td>
				<td colspan="4">
					<select name="propertyEnergyCertificateState" id="propertyEnergyCertificateState" class="regular-text">
						<option value="0" <?php echo ($propertyEnergyCertificateState == 0) ? 'selected' : ''; ?>>Nie podano</option>
						<option value="1" <?php echo ($propertyEnergyCertificateState == 1) ? 'selected' : ''; ?>>Tak</option>
						<option value="2" <?php echo ($propertyEnergyCertificateState == 2) ? 'selected' : ''; ?>>Nie</option>
						<option value="3" <?php echo ($propertyEnergyCertificateState == 3) ? 'selected' : ''; ?>>Nie jest wymagany</option>
					</select>
					<p class="description" style="font-size: 12px;">Czy nieruchomość posiada certyfikat energetyczny?</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyMaterial">Materiał</label>
				</td>
				<td colspan="4">
					<input type="text" name="propertyMaterial" class="regular-text" value="<?php echo $propertyMaterial; ?>">
					<p class="description" style="font-size: 12px;">Materiał nieruchomości</p>
				</td>
			</tr>
		</table>
	<?php 
	}
	
	public function WWACMoreDetailsMetaboxRender($post){
		$meta = get_post_custom($post -> ID);
		$propertyExposureList = !isset($meta['propertyExposureList'][0]) ? array('') : unserialize($meta['propertyExposureList'][0]);
		$propertyFloor = !isset($meta['propertyFloor'][0]) ? '' : $meta['propertyFloor'][0];
		$propertyFloors = !isset($meta['propertyFloors'][0]) ? '' : $meta['propertyFloors'][0];
		$propertyElevator = !isset($meta['propertyElevator'][0]) ? '' : $meta['propertyElevator'][0];
		$propertyGarage = !isset($meta['propertyGarage'][0]) ? '' : $meta['propertyGarage'][0];
		$propertyRooms = !isset($meta['propertyRooms'][0]) ? '' : $meta['propertyRooms'][0];
		$propertyBathrooms = !isset($meta['propertyBathrooms'][0]) ? '' : $meta['propertyBathrooms'][0];
		$propertyYearBuilt = !isset($meta['propertyYearBuilt'][0]) ? '' : $meta['propertyYearBuilt'][0];
		$propertyParkingSpacesNo = !isset($meta['propertyParkingSpacesNo'][0]) ? '' : $meta['propertyParkingSpacesNo'][0];
		//$propertyKitchenEquipment = empty($meta['propertyKitchenEquipment'][0]) ? array('brak') : json_decode($meta['propertyKitchenEquipment'][0], true);
		//$propertyHeating = empty($meta['propertyHeating'][0]) ? array('brak') : json_decode($meta['propertyHeating'][0], true);
		//$propertyWindows = empty($meta['propertyWindows'][0]) ? array('') : unserialize($meta['propertyWindows'][0]);
		//$propertyWatersType = empty($meta['propertyWatersType'][0]) ? array('') : unserialize($meta['propertyWatersType'][0]);
		//$propertyHotWater = empty($meta['propertyHotWater'][0]) ? array('') : unserialize($meta['propertyHotWater'][0]);
		$propertyKitchenEquipment = (is_array($tmp = json_decode($meta['propertyKitchenEquipment'][0] ?? '', true)) ? $tmp : array('brak'));
		$propertyHeating = (is_array($tmp = json_decode($meta['propertyHeating'][0] ?? '', true)) ? $tmp : array('brak'));
		$propertyWindows = (is_array($tmp = maybe_unserialize($meta['propertyWindows'][0] ?? '')) ? $tmp : array('brak'));
		$propertyWatersType = (is_array($tmp = maybe_unserialize($meta['propertyWatersType'][0] ?? '')) ? $tmp : array('brak'));
		$propertyHotWater = (is_array($tmp = maybe_unserialize($meta['propertyHotWater'][0] ?? '')) ? $tmp : array('brak'));
		$propertyIntercom = empty($meta['propertyIntercom'][0]) ? 0 : $meta['propertyIntercom'][0];
		$propertyVideoURL = empty($meta['propertyVideoURL'][0]) ? 0 : $meta['propertyVideoURL'][0];
		$propertyVirtualTourURL = empty($meta['propertyVirtualTourURL'][0]) ? 0 : $meta['propertyVirtualTourURL'][0];
		
		wp_nonce_field(basename(__FILE__), 'property_info');
		?>
		<table class="form-table">
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyGarage">Garaż</label>
				</td>
					
				<td colspan="4">
					<select name="propertyGarage" id="propertyGarage" class="regular-text">
						<option value="1" <?php echo ($propertyGarage) ? 'selected' : ''; ?>>Jest</option>
						<option value="0" <?php echo (!$propertyGarage) ? 'selected' : ''; ?>>Brak</option>
					</select>
					<p class="description" style="font-size: 12px;">Czy nieruchomość posiada garaż?</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyExposureList">Orientacja</label>
				</td>
					
				<td colspan="4">
					<select name="propertyExposureList[]" id="propertyExposureList" class="regular-text" multiple>
						<option value="nord" <?php echo (in_array('nord', $propertyExposureList)) ? 'selected' : ''; ?>>Północ</option>
						<option value="south" <?php echo (in_array('south', $propertyExposureList)) ? 'selected' : ''; ?>>Południe</option>
						<option value="east" <?php echo (in_array('east', $propertyExposureList)) ? 'selected' : ''; ?>>Wschód</option>
						<option value="west" <?php echo (in_array('west', $propertyExposureList)) ? 'selected' : ''; ?>>Zachód</option>
					</select>
					<p class="description" style="font-size: 12px;">Orientacja nieruchomości (wybierz kilka przytrzymując CTRL)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyFloor">Piętro lokalu</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyFloor" class="regular-text" value="<?php echo $propertyFloor; ?>">
					<p class="description" style="font-size: 12px;">Piętro, na którym znajduje się lokal</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyFloors">Liczba pięter</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyFloors" class="regular-text" value="<?php echo $propertyFloors; ?>">
					<p class="description" style="font-size: 12px;">Ilość pięter nieruchomości (tylko liczba)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyIntercom">Domofon</label>
				</td>
					
				<td colspan="4">
					<select name="propertyIntercom" id="propertyIntercom" class="regular-text">
						<option value="1" <?php echo ($propertyIntercom) ? 'selected' : ''; ?>>Jest</option>
						<option value="0" <?php echo (!$propertyIntercom) ? 'selected' : ''; ?>>Brak</option>
					</select>
					<p class="description" style="font-size: 12px;">Czy nieruchomość posiada domofon?</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyRooms">Liczba pokoji</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyRooms" class="regular-text" value="<?php echo $propertyRooms; ?>">
					<p class="description" style="font-size: 12px;">Ilość pokoji w nieruchomości (tylko liczba)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyBathrooms">Liczba łazienek</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyBathrooms" class="regular-text" value="<?php echo $propertyBathrooms; ?>">
					<p class="description" style="font-size: 12px;">Ilość łazienek w nieruchomości (tylko liczba)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyWindows">Okna</label>
				</td>
					
				<td colspan="4">
					<select name="propertyWindows[]" id="propertyWindows" class="regular-text" multiple>
						<option value="1" <?php echo (in_array(1, $propertyWindows)) ? 'selected' : ''; ?>>Aluminium</option>
						<option value="2" <?php echo (in_array(2, $propertyWindows)) ? 'selected' : ''; ?>>PCV</option>
						<option value="3" <?php echo (in_array(3, $propertyWindows)) ? 'selected' : ''; ?>>Drewniane starego typu</option>
						<option value="4" <?php echo (in_array(4, $propertyWindows)) ? 'selected' : ''; ?>>Drewniane nowego typu</option>
						<option value="5" <?php echo (in_array(5, $propertyWindows)) ? 'selected' : ''; ?>>Stalowe</option>
						<option value="6" <?php echo (in_array(6, $propertyWindows)) ? 'selected' : ''; ?>>Dachowe</option>
						<option value="7" <?php echo (in_array(7, $propertyWindows)) ? 'selected' : ''; ?>>Antywłamaniowe</option>
						<option value="8" <?php echo (in_array(8, $propertyWindows)) ? 'selected' : ''; ?>>Z osłonami</option>
						<option value="9" <?php echo (in_array(9, $propertyWindows)) ? 'selected' : ''; ?>>Z żaluzjami</option>
						<option value="10" <?php echo (in_array(10, $propertyWindows)) ? 'selected' : ''; ?>>Starego typu</option>
					</select>
					<p class="description" style="font-size: 12px;">Okna nieruchomości (wybierz kilka przytrzymując CTRL)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyWatersType">Woda</label>
				</td>
					
				<td colspan="4">
					<select name="propertyWatersType[]" id="propertyWatersType" class="regular-text" multiple>
						<option value="1" <?php echo (in_array(1, $propertyWatersType)) ? 'selected' : ''; ?>>Brak</option>
						<option value="2" <?php echo (in_array(2, $propertyWatersType)) ? 'selected' : ''; ?>>Studnia</option>
						<option value="3" <?php echo (in_array(3, $propertyWatersType)) ? 'selected' : ''; ?>>Woda miejska</option>
						<option value="4" <?php echo (in_array(4, $propertyWatersType)) ? 'selected' : ''; ?>>Woda miejska (na działce)</option>
						<option value="5" <?php echo (in_array(5, $propertyWatersType)) ? 'selected' : ''; ?>>Woda miejska (w drodze)</option>
					</select>
					<p class="description" style="font-size: 12px;">Dostęp do wody w nieruchomości (wybierz kilka przytrzymując CTRL)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyHotWater">Ciepła woda</label>
				</td>
					
				<td colspan="4">
					<select name="propertyHotWater[]" id="propertyHotWater" class="regular-text" multiple>
						<option value="1" <?php echo (in_array(1, $propertyHotWater)) ? 'selected' : ''; ?>>Brak</option>
						<option value="2" <?php echo (in_array(2, $propertyHotWater)) ? 'selected' : ''; ?>>Miejskie</option>
						<option value="3" <?php echo (in_array(3, $propertyHotWater)) ? 'selected' : ''; ?>>Podgrzewacz gazowy</option>
						<option value="4" <?php echo (in_array(4, $propertyHotWater)) ? 'selected' : ''; ?>>Podgrzewacz elektryczny</option>
						<option value="5" <?php echo (in_array(5, $propertyHotWater)) ? 'selected' : ''; ?>>Bojler</option>
						<option value="6" <?php echo (in_array(6, $propertyHotWater)) ? 'selected' : ''; ?>>Kolektory słoneczne</option>
						<option value="7" <?php echo (in_array(7, $propertyHotWater)) ? 'selected' : ''; ?>>Inne</option>
						<option value="8" <?php echo (in_array(8, $propertyHotWater)) ? 'selected' : ''; ?>>Paliwo stałe</option>
						<option value="9" <?php echo (in_array(9, $propertyHotWater)) ? 'selected' : ''; ?>>Ogrzewanie geotermalne</option>
						<option value="10" <?php echo (in_array(10, $propertyHotWater)) ? 'selected' : ''; ?>>Piec na węgiel</option>
						<option value="11" <?php echo (in_array(11, $propertyHotWater)) ? 'selected' : ''; ?>>Pompa ciepła</option>
					</select>
					<p class="description" style="font-size: 12px;">Źródło ciepłej wody w nieruchomości (wybierz kilka przytrzymując CTRL)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyKitchenEquipment">Wyposażenie kuchni</label>
				</td>
					
				<td colspan="4">
					<select name="propertyKitchenEquipment[]" id="propertyKitchenEquipment" class="regular-text" multiple>
						<option value="brak" <?php echo (in_array('Brak', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Brak</option>
						<option value="freezer" <?php echo (in_array('freezer', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Zamrażarka</option>
						<option value="hood" <?php echo (in_array('hood', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Okap</option>
						<option value="electricoven" <?php echo (in_array('electricoven', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Piekarnik elektryczny</option>
						<option value="refrigerator" <?php echo (in_array('refrigerator', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Lodówka</option>
						<option value="sink" <?php echo (in_array('sink', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Zlew</option>
						<option value="kitchenfurniture" <?php echo (in_array('kitchenfurniture', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Meble</option>
						<option value="oven" <?php echo (in_array('oven', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Piekarnik</option>
						<option value="dishwasher" <?php echo (in_array('dishwasher', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Zmywarka</option>
						<option value="microwave" <?php echo (in_array('microwave', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Mikrofalówka</option>
						<option value="gashob" <?php echo (in_array('gashob', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Płyta gazowa</option>
						<option value="washingmachine" <?php echo (in_array('washingmachine', $propertyKitchenEquipment)) ? 'selected' : ''; ?>>Pralka</option>
					</select>
					<p class="description" style="font-size: 12px;">Wyposażenie kuchni (wybierz kilka przytrzymując CTRL)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyHeating">Ogrzewanie</label>
				</td>
					
				<td colspan="4">
					<select name="propertyHeating[]" id="propertyHeating" class="regular-text" multiple>
						<option value="brak" <?php echo (in_array('brak', $propertyHeating)) ? 'selected' : ''; ?>>Brak</option>
						<option value="fireplace" <?php echo (in_array('fireplace', $propertyHeating)) ? 'selected' : ''; ?>>Kominek</option>
						<option value="gas" <?php echo (in_array('gas', $propertyHeating)) ? 'selected' : ''; ?>>Gazowe</option>
						<option value="floor" <?php echo (in_array('floor', $propertyHeating)) ? 'selected' : ''; ?>>Podłogowe</option>
						<option value="city" <?php echo (in_array('city', $propertyHeating)) ? 'selected' : ''; ?>>Miasto</option>
						<option value="own" <?php echo (in_array('own', $propertyHeating)) ? 'selected' : ''; ?>>Własne</option>
						<option value="electric" <?php echo (in_array('electric', $propertyHeating)) ? 'selected' : ''; ?>>Elektryczne</option>
						<option value="oil" <?php echo (in_array('oil', $propertyHeating)) ? 'selected' : ''; ?>>Olejowe</option>
						<option value="coal" <?php echo (in_array('coal', $propertyHeating)) ? 'selected' : ''; ?>>Węglowe</option>
						<option value="environmental" <?php echo (in_array('environmental', $propertyHeating)) ? 'selected' : ''; ?>>Odnawialne</option>
						<option value="other" <?php echo (in_array('other', $propertyHeating)) ? 'selected' : ''; ?>>Inne</option>
						<option value="stove" <?php echo (in_array('stove', $propertyHeating)) ? 'selected' : ''; ?>>Piec</option>
						<option value="heatPump" <?php echo (in_array('heatPump', $propertyHeating)) ? 'selected' : ''; ?>>Pompa ciepła</option>
						<option value="solidFuel" <?php echo (in_array('solidFuel', $propertyHeating)) ? 'selected' : ''; ?>>Paliwo stałe</option>
						<option value="hotAirBlowerUsingGas" <?php echo (in_array('hotAirBlowerUsingGas', $propertyHeating)) ? 'selected' : ''; ?>>Nagrzewnica powietrza na gaz</option>
						<option value="hotAirBlowerUsingWater" <?php echo (in_array('hotAirBlowerUsingWater', $propertyHeating)) ? 'selected' : ''; ?>>Nagrzewnica powietrza na wodę</option>
						<option value="infraredHeater" <?php echo (in_array('infraredHeater', $propertyHeating)) ? 'selected' : ''; ?>>Promiennik podczerwieni</option>
						<option value="biomass" <?php echo (in_array('biomass', $propertyHeating)) ? 'selected' : ''; ?>>Biomasa</option>
					</select>
					<p class="description" style="font-size: 12px;">Ogrzewanie nieruchomości (wybierz kilka przytrzymując CTRL)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyYearBuilt">Rok budowy</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyYearBuilt" class="regular-text" value="<?php echo $propertyYearBuilt; ?>">
					<p class="description" style="font-size: 12px;">Rok budowy nieruchomości (tylko liczba)</p>
				</td>
			</tr>
				
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyElevator">Winda</label>
				</td>
					
				<td colspan="4">
					<select name="propertyElevator" class="regular-text">
						<option value="0" <?php echo (!strcmp(get_option('propertyElevator'), $propertyElevator)) ? 'selected' : ''; ?>>Nie</option>
						<option value="1" <?php echo (!strcmp(get_option('propertyElevator'), $propertyElevator)) ? 'selected' : ''; ?>>Tak</option>
				</select>
					<p class="description" style="font-size: 12px;">Dostępność windy w nieruchomości</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyParkingSpacesNo">Ilość miejsc parkingowych</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyParkingSpacesNo" class="regular-text" value="<?php echo $propertyParkingSpacesNo; ?>">
					<p class="description" style="font-size: 12px;">Ilość prywatnych miejsc parkingowych</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyVideoURL">URL do wideo</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyVideoURL" class="regular-text" value="<?php echo $propertyVideoURL; ?>">
					<p class="description" style="font-size: 12px;">Link do filmu wideo oferty</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyVirtualTourURL">URL do wirtualnej wycieczki</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyVirtualTourURL" class="regular-text" value="<?php echo $propertyVirtualTourURL; ?>">
					<p class="description" style="font-size: 12px;">Link do wirtualnej wycieczki po obiekcie</p>
				</td>
			</tr>
		</table>
		<?php
	}
	
	public function WWACRawDetailsMetaboxRender($post){
		$meta = get_post_custom($post -> ID);
		$propertyPriceRaw = !isset($meta['propertyPriceRaw'][0]) ? '' : $meta['propertyPriceRaw'][0];
		$propertyAreaRaw = !isset($meta['propertyAreaRaw'][0]) ? '' : $meta['propertyAreaRaw'][0];
		?>
		<table class="form-table">
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyPriceRaw">Cena nieruchomości</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyPriceRaw" class="regular-text" value="<?php echo $propertyPriceRaw; ?>">
					<p class="description" style="font-size: 12px;">Cena nieruchomości (surowa wartość, np.: do filtrów/wyszukiwarki)</p>
				</td>
			</tr>
			
			<tr>
				<td class="team_meta_box_td" colspan="2">
					<label for="propertyAreaRaw">Powierzchnia nieruchomości</label>
				</td>
					
				<td colspan="4">
					<input type="text" name="propertyAreaRaw" class="regular-text" value="<?php echo $propertyAreaRaw; ?>">
					<p class="description" style="font-size: 12px;">Powierzchnia nieruchomości (surowa wartość, np.: do filtrów/wyszukiwarki)</p>
				</td>
			</tr>
		</table>
		<?php
	}
	
	public function WWACSearchMetaboxRender($post){
		wp_enqueue_script('wwac-admin-search-scripts');
		wp_nonce_field(basename(__FILE__), 'wwac_search_metabox_nonce');
		$searchData = unserialize(get_post_meta($post -> ID, 'WWAC_SearchInfo', true));
		$searchDataCounted = (is_array($searchData)) ? count($searchData['panel']) : 0;
		$metaTitles = array('price' => 'Cena', 'area' => 'Metraż');
		$taxTitles = array('category' => 'Kategoria', 'type' => 'Typ', 'localization' => 'Lokalizacja', 'district' => 'Dzielnica', 'agent' => 'Agent');
		?>
		<style>
		.container { margin-bottom: 10px; }
        .element { border: 1px solid #ccc; padding: 10px; margin: 5px 0; position: relative; background: #fff; }
        .title-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; }
        .content { display: none; margin-top: 10px; }
		.elementsContainer { border: 1px solid #ccc; padding: 10px; }
		.remove-element { color: red; }
		.title-bar, .add-element, .remove-element { cursor: pointer; }
		.element .content { flex-direction: column; gap: 20px; }
		.element .content .panel { display: flex; justify-content: space-between; align-items: center; }
		.element .content .left-side { width: 30%; }
		.element .content .left-side .option-title { font-weight: bold; margin-bottom: 0px; font-size: 1.2em; }
		.element .content .left-side .option-description { font-size: 12px; color: #555; margin-top: 3px; }
		.element .content .right-side { width: 65%; display: flex; align-items: center; justify-content: center; }
		.element .content .right-side select, .element .content .right-side input { width: 90%; }
		</style>
		
		<div class="container">
			<select id="elementSelect">
				<optgroup label="Taksonomie">
					<option value="kategoria">Taksonomia: Kategoria</option>
					<option value="typ">Taksonomia: Typ</option>
					<option value="lokalizacja">Taksonomia: Lokalizacja</option>
					<option value="dzielnica">Taksonomia: Dzielnica</option>
					<option value="agent">Taksonomia: Agent</option>
				</optgroup>
				<optgroup label="Wartości meta">
					<option value="cena">Meta: Cena</option>
					<option value="metraz">Meta: Metraż</option>
				</optgroup>
			</select>
			
			<a onclick="addElement()" class="add-element">Dodaj element</a>
		</div>
    
		<div class="container" id="elementsContainer">
		<?php
		for($i = 0; $i < $searchDataCounted; $i++){
			if(!strcmp($searchData['panel'][$i]['type'], "meta")){
				$suffix = (!strcmp($searchData['panel'][$i]['key'], "price")) ? "złotych" : "m²" ;
				?>
				<div class="element" data-index="<?php echo $i; ?>" data-value="<?php echo iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', strtolower($metaTitles[$searchData['panel'][$i]['key']])); ?>">
					<div class="title-bar">
						<strong>Meta: <?php echo $metaTitles[$searchData['panel'][$i]['key']]; ?></strong>
						<a onclick="removeElement(this)" class="remove-element">Usuń</a>
					</div>
					<div class="content" style="display: flex;">
						<div class="panel">
							<input type="hidden" name="WWAC_SearchInfo[panel][<?php echo $i; ?>][type]" value="meta">
							<input type="hidden" name="WWAC_SearchInfo[panel][<?php echo $i; ?>][key]" value="<?php echo $searchData['panel'][$i]['key']; ?>">
							
							<div class="left-side">
								<div class="option-title">Minimalna wartość</div>
								<div class="option-description">Minimalna wartość powierzchni do wybrania.</div>
							</div>
									
							<div class="right-side">
								<select name="WWAC_SearchInfo[panel][<?php echo $i; ?>][min_val]">
									<option value="1" <?php echo ($searchData['panel'][$i]['min_val'] == 1) ? 'selected' : null; ?>>0 (minimalna wartość)</option>
									<option value="2" <?php echo ($searchData['panel'][$i]['min_val'] == 2) ? 'selected' : null; ?>>Najmniejsza wartość ze wszystich ofert.</option>
								</select>
							</div>
						</div>
								
						<div class="panel">
							<div class="left-side">
								<div class="option-title">Dokładność</div>
								<div class="option-description">Określ liczbę miejsc po przecinku przy filtrowaniu.</div>
							</div>
									
							<div class="right-side">
								<select name="WWAC_SearchInfo[panel][<?php echo $i; ?>][precision]">
									<option value="1" <?php echo ($searchData['panel'][$i]['precision'] == 1) ? 'selected' : null; ?>>100 <?php echo $suffix; ?></option>
									<!-- <option value="2" <?php echo ($searchData['panel'][$i]['precision'] == 2) ? 'selected' : null; ?>>100.1 <?php echo $suffix; ?></option>
									<option value="3" <?php echo ($searchData['panel'][$i]['precision'] == 3) ? 'selected' : null; ?>>100.11 <?php echo $suffix; ?></option> -->
								</select>
							</div>
						</div>
					</div>
				</div>
				<?php
			}else if(!strcmp($searchData['panel'][$i]['type'], "taxonomy")){
				?>
				<div class="element" data-index="<?php echo $i; ?>" data-value="<?php echo strtolower($taxTitles[$searchData['panel'][$i]['key']]); ?>">
					<div class="title-bar">
						<strong>Taksonomia: <?php echo $taxTitles[$searchData['panel'][$i]['key']]; ?></strong>
						<a onclick="removeElement(this)" class="remove-element">Usuń</a>
					</div>
					
					<div class="content" style="display: flex;">
						<div class="panel">
							<input type="hidden" name="WWAC_SearchInfo[panel][<?php echo $i; ?>][type]" value="taxonomy">
							<input type="hidden" name="WWAC_SearchInfo[panel][<?php echo $i; ?>][key]" value="<?php echo $searchData['panel'][$i]['key']; ?>">
							<div class="left-side">
								<div class="option-title">Placeholder</div>
								<div class="option-description">Tekst wyświetlany w polu przed wpisaniem danych przez użytkownika.</div>
							</div>
							
							<div class="right-side">
								<input type="text" name="WWAC_SearchInfo[panel][<?php echo $i; ?>][placeholder]" placeholder="Tekst placeholder'a" value="<?php echo $searchData['panel'][$i]['placeholder']; ?>">
							</div>
						</div>
						
						<div class="panel">
							<div class="left-side">
								<div class="option-title">Puste elementy</div>
								<div class="option-description">Określ, czy wyświetlać puste elementy taksonomii.</div>
							</div>
							
							<div class="right-side">
								<select name="WWAC_SearchInfo[panel][<?php echo $i; ?>][empty_elements]">
									<option value="1" <?php echo ($searchData['panel'][$i]['empty_elements'] == 1) ? 'selected' : null; ?>>Nie</option>
									<option value="2" <?php echo ($searchData['panel'][$i]['empty_elements'] == 2) ? 'selected' : null; ?>>Tak</option>
								</select>
							</div>
						</div>
						
						<div class="panel">
							<div class="left-side">
								<div class="option-title">Logika filtra</div>
								<div class="option-description">Określ sposób wybierania postów, gdy wybrane są dwa lub więcej warunków.</div>
							</div>
							
							<div class="right-side">
								<select name="WWAC_SearchInfo[panel][<?php echo $i; ?>][query_logic]">
									<option value="1" <?php echo ($searchData['panel'][$i]['query_logic'] == 1) ? 'selected' : null; ?>>W (IN)</option>
									<option value="2" <?php echo ($searchData['panel'][$i]['query_logic'] == 2) ? 'selected' : null; ?>>LUB (OR)</option>
									<option value="3" <?php echo ($searchData['panel'][$i]['query_logic'] == 3) ? 'selected' : null; ?>>I (AND)</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<?php
			}
		}
		?>
		</div>
		<?php
	}
	
	public function WWACSearchRedirectMetaboxRender($post){
		$value = get_post_meta($post->ID, 'WWAC_FormRedirect', true);
		echo '<select name="WWAC_FormRedirect" id="WWAC_FormRedirect" style="width:100%;">';
		
		printf(
			'<option value="%s" %s>%s</option>',
			esc_attr('none'),
			selected($value, 'none', false),
			esc_html('Brak przekierowania')
		);
		
		$pt = get_post_type_object('nieruchomosci');
		
		if($pt){
			$cpt_archive_slug = '';
			
			if(!empty($pt -> has_archive)){
				if(is_string($pt -> has_archive)){
					$cpt_archive_slug = trim($pt -> has_archive, '/');
				}else if(!empty($pt -> rewrite)){
					$cpt_archive_slug = (is_array($pt -> rewrite) && !empty($pt -> rewrite['slug'])) ? trim($pt -> rewrite['slug'], '/') : 'nieruchomosci';
				}else{
					$cpt_archive_slug = 'nieruchomosci';
				}
			}
			
			if($cpt_archive_slug !== ''){
				echo '<optgroup label="Archiwum typu wpisu">';
				printf(
					'<option value="%s" %s>%s</option>',
					esc_attr($cpt_archive_slug),
					selected($value, $cpt_archive_slug, false),
					esc_html('Archiwum: '.($pt -> labels -> name ?? 'nieruchomosci'))
				);
				echo '</optgroup>';
			}
		}
		
		$taxes = get_object_taxonomies('nieruchomosci', 'objects');
		$tax_opts = [];
		
		if(!empty($taxes)){
			foreach($taxes as $tax){
				if(!$tax -> public) continue;
				
				$slug = '';
				
				if(!empty($tax -> rewrite)){
					$slug = is_array($tax -> rewrite) ? ($tax -> rewrite['slug'] ?? '') : $tax -> rewrite;
					$slug = trim($slug, '/');
				}
				
				if($slug === ''){
					$slug = $tax->name;
				}
				
				$tax_opts[] = [
					'value' => $slug,
					'label' => 'Archiwum taksonomii: '.$tax -> labels -> name,
				];
			}
		}
		
		if(!empty($tax_opts)){
			echo '<optgroup label="Archiwa taksonomii (nieruchomosci)">';
			
			foreach($tax_opts as $opt){
				printf(
					'<option value="%s" %s>%s</option>',
					esc_attr($opt['value']),
					selected($value, $opt['value'], false),
					esc_html($opt['label'])
				);
			}
			
			echo '</optgroup>';
		}
		
		$pages = get_pages();
		
		if(!empty($pages)){
			echo '<optgroup label="Strony">';
			
			foreach($pages as $p){
				$slug = $p -> post_name;
				
				printf(
					'<option value="%s" %s>%s</option>',
					esc_attr($slug),
					selected($value, $slug, false),
					esc_html('Strona: '.$p -> post_title)
				);
			}
			
			echo '</optgroup>';
		}
		
		echo '</select>';
		echo '<p style="margin-top:8px;color:#666;font-size:12px;">Wybierz, gdzie formularz ma przekierować, po kliknięciu przycisku wyszukiwania.</p>';
	}
	
	public function WWACSearchShortcodeMetaboxRender($post){
		?>
		<p><strong>Shortcode wyszukiwarki:</strong></p>
		<?php
		if($post -> ID && get_post_status($post -> ID) !== 'auto-draft'){
			$shortcode = '[property_search id='.$post -> ID.']';
			?>
			<input type="text" readonly value="<?php echo esc_attr($shortcode); ?>" style="width: 100%;">
			<?php
		}else{
			?>
			<input type="text" readonly value="Zapisz, aby wyświetlić shortcode" style="width: 100%; color: #999;">
			<?php
		}
	}
	
	function WWACCustomPostTypeSaveMetaBoxes($post_id){
		global $post;
			
		// Verify nonce
		if(!isset($_POST['property_info']) || !wp_verify_nonce($_POST['property_info'], basename(__FILE__))){
			return $post_id;
		}
			
		// Check Autosave
		if((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || (defined('DOING_AJAX') && DOING_AJAX) || isset($_REQUEST['bulk_edit'])){
			return $post_id;
		}
			
		// Don't save if only a revision
		if(isset($post -> post_type) && $post -> post_type == 'revision'){
			return $post_id;
		}
			
		// Check permissions
		if(!current_user_can('edit_post', $post -> ID)){
			return $post_id;
		}
		
		// prepare data
		if(!empty($_POST['propertyKitchenEquipment']) && is_array($_POST['propertyKitchenEquipment'])){
			$propertyKitchenEquipment = array_map('sanitize_text_field', $_POST['propertyKitchenEquipment']);
		}else{
			$propertyKitchenEquipment = array();
		}
		
		if(!empty($_POST['propertyHeating']) && is_array($_POST['propertyHeating'])){
			$propertyHeating = array_map('sanitize_text_field', $_POST['propertyHeating']);
		}else{
			$propertyHeating = array();
		}
		/*$dictionaryKitchen = array(
			'brak' => 'Brak',
			'freezer' => 'Zamrażarka',
			'hood' => 'Okap',
			'electricoven' => 'Piekarnik elektryczny',
			'refrigerator' => 'Lodówka',
			'sink' => 'Zlew',
			'kitchenfurniture' => 'Meble',
			'oven' => 'Piekarnik',
			'dishwasher' => 'Zmywarka',
			'microwave' => 'Mikrofalówka',
			'gashob' => 'Płyta gazowa',
			'washingmachine' => 'Pralka',
		);
		
		foreach($_POST['propertyKitchenEquipment'] as $eq){
			if(array_key_exists($eq, $dictionaryKitchen)){
				$propertyKitchenEquipment[] = $dictionaryKitchen[$eq];
			}
		}
		
		$dictionaryHeating = array(
			'brak' => 'Brak',
			'fireplace' => 'Kominek',
			'gas' => 'Gazowe',
			'floor' => 'Podłogowe',
			'city' => 'Miasto',
			'own' => 'Własne',
			'electric' => 'Elektryczne',
			'oil' => 'Olejowe',
			'coal' => 'Węglowe',
			'environmental' => 'Odnawialne',
			'other' => 'Inne',
			'stove' => 'Piec',
			'heatPump' => 'Pompa ciepła',
			'solidFuel' => 'Paliwo stałe',
			'hotAirBlowerUsingGas' => 'Nagrzewnica powietrza na gaz',
			'hotAirBlowerUsingWater' => 'Nagrzewnica powietrza na wodę',
			'infraredHeater' => 'Promiennik podczerwieni',
			'biomass' => 'Biomasa',
		);
		
		foreach($_POST['propertyHeating'] as $eq){
			if(array_key_exists($eq, $dictionaryHeating)){
				$propertyHeating[] = $dictionaryHeating[$eq];
			}
		} */
		
		$propertyWindows = array_map('intval', (!empty($_POST['propertyWindows'])) ? $_POST['propertyWindows'] : Array());
		$propertyWatersType = array_map('intval', (!empty($_POST['propertyWatersType'])) ? $_POST['propertyWatersType'] : Array(1));
		$propertyExposureList = array_map('strval', (!empty($_POST['propertyExposureList'])) ? $_POST['propertyExposureList'] : Array());
		$propertyHotWater = array_map('intval', (!empty($_POST['propertyHotWater'])) ? $_POST['propertyHotWater'] : Array());
		
		//0.3
		$meta['asariOfferID'] = (isset($_POST['asariOfferID']) ? esc_textarea($_POST['asariOfferID']) : '');
		$meta['mortgageMarket'] = (isset($_POST['mortgageMarket']) ? esc_textarea($_POST['mortgageMarket']) : '');
		$meta['propertyExposureList'] = (isset($propertyExposureList) ? $propertyExposureList : array(''));
		$meta['propertyFloor'] = (isset($_POST['propertyFloor']) ? esc_textarea($_POST['propertyFloor']) : '');
		$meta['propertyParkingSpacesNo'] = (isset($_POST['propertyParkingSpacesNo']) ? esc_textarea($_POST['propertyParkingSpacesNo']) : '');
		$meta['propertyOfferManager'] = (isset($_POST['propertyOfferManager']) ? esc_textarea($_POST['propertyOfferManager']) : '');
		//0.2
		$meta['propertyPrice'] = (isset($_POST['propertyPrice']) ? esc_textarea($_POST['propertyPrice']) : '');
		$meta['propertyPricePerM'] = (isset($_POST['propertyPricePerM']) ? esc_textarea($_POST['propertyPricePerM']) : '');
		$meta['propertyArea'] = (isset($_POST['propertyArea']) ? esc_textarea($_POST['propertyArea'] ) : '');
		$meta['propertyFloors'] = (isset($_POST['propertyFloors']) ? esc_textarea($_POST['propertyFloors']) : '');
		$meta['propertyLocalization'] = (isset($_POST['propertyLocalization']) ? esc_textarea($_POST['propertyLocalization']) : '');
		$meta['propertyPriceCurrency'] = (isset($_POST['propertyPriceCurrency']) ? esc_textarea($_POST['propertyPriceCurrency']) : '');
		$meta['propertyElevator'] = (isset($_POST['propertyElevator']) ? esc_textarea($_POST['propertyElevator']) : '');
		$meta['propertyRooms'] = (isset($_POST['propertyRooms']) ? esc_textarea($_POST['propertyRooms']) : '');
		$meta['propertyBathrooms'] = (isset($_POST['propertyBathrooms']) ? esc_textarea($_POST['propertyBathrooms']) : '');
		$meta['propertyYearBuilt'] = (isset($_POST['propertyYearBuilt']) ? esc_textarea($_POST['propertyYearBuilt']) : '');
		//0.6
		$meta['propertyEnergyCertificateState'] = (isset($_POST['propertyEnergyCertificateState']) ? (int) $_POST['propertyEnergyCertificateState'] : '');
		$meta['propertyMaterial'] = (isset($_POST['propertyMaterial']) ? esc_textarea($_POST['propertyMaterial']) : '');
		$meta['propertyKitchenEquipment'] = (isset($propertyKitchenEquipment) ? json_encode($propertyKitchenEquipment, JSON_UNESCAPED_UNICODE) : array(''));
		$meta['propertyHeating'] = (isset($propertyHeating) ? json_encode($propertyHeating, JSON_UNESCAPED_UNICODE) : array(''));
		// 0.9.2
		$meta['propertyWindows'] = (isset($propertyWindows) ? $propertyWindows : array(''));
		$meta['propertyWatersType'] = (isset($propertyWatersType) ? $propertyWatersType : array(''));
		$meta['propertyHotWater'] = (isset($propertyHotWater) ? $propertyHotWater : array(''));
		$meta['propertyProvisionAmount'] = (isset($_POST['propertyProvisionAmount']) ? (int) esc_textarea($_POST['propertyProvisionAmount']) : '');
		$meta['propertyAdministrativeRent'] = (isset($_POST['propertyAdministrativeRent']) ? (int) esc_textarea($_POST['propertyAdministrativeRent']) : '');
		$meta['propertyIntercom'] = (isset($_POST['propertyIntercom']) ? (int) esc_textarea($_POST['propertyIntercom']) : 0);
		// 0.9.4
		$meta['propertyOfficeName'] = (isset($_POST['propertyOfficeName']) ? esc_textarea($_POST['propertyOfficeName']) : '');
		// 0.9.5
		$meta['propertyVideoURL'] = (isset($_POST['propertyVideoURL']) ? esc_textarea($_POST['propertyVideoURL']) : '');
		$meta['propertyVirtualTourURL'] = (isset($_POST['propertyVirtualTourURL']) ? esc_textarea($_POST['propertyVirtualTourURL']) : '');
		$meta['propertyBuildingCondition'] = (isset($_POST['propertyBuildingCondition']) ? esc_textarea($_POST['propertyBuildingCondition']) : '');
		$meta['propertyPriceRaw'] = (isset($_POST['propertyPriceRaw']) ? esc_textarea($_POST['propertyPriceRaw']) : '');
		$meta['propertyAreaRaw'] = (isset($_POST['propertyAreaRaw']) ? esc_textarea($_POST['propertyAreaRaw']) : '');
		$meta['propertySpecial'] = ($_POST['propertySpecial'] == 0 || $_POST['propertySpecial'] == 1) ? $_POST['propertySpecial'] : '';
		
		foreach($meta as $key => $value){
			update_post_meta($post -> ID, $key, $value);
		}
	}
	
	public function WWACSearchSaveMetaBoxes($post_id){
		global $post;
			
		// Verify nonce
		if(!isset($_POST['wwac_search_metabox_nonce']) || !wp_verify_nonce($_POST['wwac_search_metabox_nonce'], basename(__FILE__))){
			return $post_id;
		}
			
		// Check Autosave
		if((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || (defined('DOING_AJAX') && DOING_AJAX) || isset($_REQUEST['bulk_edit'])){
			return $post_id;
		}
			
		// Don't save if only a revision
		if(isset($post -> post_type) && $post -> post_type == 'revision'){
			return $post_id;
		}
			
		// Check permissions
		if(!current_user_can('edit_post', $post -> ID)){
			return $post_id;
		}
		
		// prepare data
		$postData = $_POST['WWAC_SearchInfo'];
		
		foreach($postData['panel'] as $key => $value){
			if(empty($value['placeholder'])){
				switch($value['key']){
					case 'category':
						$postData['panel'][$key]['placeholder'] = "Kategoria";
						break;
					case 'type':
						$postData['panel'][$key]['placeholder'] = "Typ";
						break;
					case 'localization':
						$postData['panel'][$key]['placeholder'] = "Lokalizacja";
						break;
					case 'district':
						$postData['panel'][$key]['placeholder'] = "Dzielnica";
						break;
					case 'agent':
						$postData['panel'][$key]['placeholder'] = "Agent";
						break;
					default:
						$postData['panel'][$key]['placeholder'] = "";
						break;
				}
			}
		}
		
		$postData = serialize($postData);
		
		update_post_meta($post -> ID, "WWAC_SearchInfo", $postData);
	}
	
	public function WWACCustomPostTypeColumns($columns){
		$columns = array(
			'cb' => '<input type="checkbox" />',
			'title' => 'Nieruchomość',
			'price' => 'Cena',
			'area' => 'Powierzchnia (m<sup>2</sup>)',
			'date' => 'Data'
		);
			
		return $columns;
	}
	
	public function WWACCustomPostTypeColumnsSortable($columns){
		$columns['price'] = 'price';
		$columns['area'] = 'area';
			
		return $columns;
	}
	
	public function WWACCustomPostTypeColumnsContent($column, $post_id){
		global $post;
			
		switch($column){
			case 'price':
				$price = get_post_meta($post_id, 'propertyPrice', true);
				
				if(empty($price)){
					echo 'Brak';
				}else{
					echo $price.' złotych';
				}

				break;
			
			case 'area':
				$area = get_post_meta($post_id, 'propertyArea', true);
				
				if(empty($area)){
					echo 'Brak';
				}else{
					echo $area.' m<sup>2</sup>';
				}

				break;
				
			default:
				break;
		}
	}
	
	public function WWACRegisterMenu(){
		add_menu_page(
			'Webist WP Asari CRM',
			'WP Asari CRM',
			'manage_options',
			WWAC_PLUGIN_MENU_SLUG,
			array($this, 'WWACRegisterMenuPages')
		);
		
		add_submenu_page(WWAC_PLUGIN_MENU_SLUG, 'Webist WP Asari CRM - ustawienia', 'Ustawienia', 'manage_options', WWAC_PLUGIN_MENU_SLUG.'-settings', array($this, 'WWACRegisterMenuPages'));
		
		add_submenu_page(WWAC_PLUGIN_MENU_SLUG, 'Webist WP Asari CRM - archiwa', 'Archiwa', 'manage_options', WWAC_PLUGIN_MENU_SLUG.'-archives', array($this, 'WWACRegisterMenuPages'));
		
		add_submenu_page(WWAC_PLUGIN_MENU_SLUG, 'Webist WP Asari CRM - klucz Asari CRM', 'Klucz Asari CRM', 'manage_options', WWAC_PLUGIN_MENU_SLUG.'-asari-key', array($this, 'WWACRegisterMenuPages'));
		
		add_submenu_page(WWAC_PLUGIN_MENU_SLUG, 'Webist WP Asari CRM - licencja', 'Licencja', 'manage_options', WWAC_PLUGIN_MENU_SLUG.'-license', array($this, 'WWACRegisterMenuPages'));
		
		add_submenu_page(WWAC_PLUGIN_MENU_SLUG, 'Webist WP Asari CRM - aktualizator ofert', 'Aktualizator ofert', 'manage_options', WWAC_PLUGIN_MENU_SLUG.'-reu', array($this, 'WWACRegisterMenuPages'));
		
		add_submenu_page(WWAC_PLUGIN_MENU_SLUG, 'Webist WP Asari CRM - wymagania wtyczki', 'Wymagania', 'manage_options', WWAC_PLUGIN_MENU_SLUG.'-req', array($this, 'WWACRegisterMenuPages'));
		
		add_submenu_page(WWAC_PLUGIN_MENU_SLUG, 'Webist WP Asari CRM - konkurencja', 'Konkurencja', 'manage_options', WWAC_PLUGIN_MENU_SLUG.'-competitors', array($this, 'WWACRegisterMenuPages'));
	}
	
	public function WWACRegisterMenuPages(){
		if(!current_user_can('manage_options')){return;}
		
		$page = isSet($_GET['page']) ? htmlspecialchars($_GET['page'], FILTER_VALIDATE_URL) : null;
		?>
		<div class="wrap">
			<h1><?php echo esc_html(get_admin_page_title()); ?></h1>
			<nav class="nav-tab-wrapper">
				<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>" class="nav-tab <?php echo (!strcmp($page, WWAC_PLUGIN_MENU_SLUG)) ? 'nav-tab-active' : ''; ?>">Strona główna</a>
				<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-settings" class="nav-tab <?php echo (!strcmp($page, WWAC_PLUGIN_MENU_SLUG.'-settings')) ? 'nav-tab-active' : ''; ?>">Ustawienia</a>
				<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-archives" class="nav-tab <?php echo (!strcmp($page, WWAC_PLUGIN_MENU_SLUG.'-archives')) ? 'nav-tab-active' : ''; ?>">Archiwa</a>
				<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-asari-key" class="nav-tab <?php echo (!strcmp($page, WWAC_PLUGIN_MENU_SLUG.'-asari-key')) ? 'nav-tab-active' : ''; ?>">Klucz AsariCRM</a>
				<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-license" class="nav-tab <?php echo (!strcmp($page, WWAC_PLUGIN_MENU_SLUG.'-license')) ? 'nav-tab-active' : ''; ?>">Licencja</a>
				<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-reu" class="nav-tab <?php echo (!strcmp($page, WWAC_PLUGIN_MENU_SLUG.'-reu')) ? 'nav-tab-active' : ''; ?>">Aktualizator ofert</a>
				<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-req" class="nav-tab <?php echo (!strcmp($page, WWAC_PLUGIN_MENU_SLUG.'-req')) ? 'nav-tab-active' : ''; ?>">Wymagania</a>
				<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-competitors" class="nav-tab <?php echo (!strcmp($page, WWAC_PLUGIN_MENU_SLUG.'-competitors')) ? 'nav-tab-active' : ''; ?>">Konkurencja</a>
			</nav>
			<div class="tab-content">
			<?php
			switch($page){
				case WWAC_PLUGIN_MENU_SLUG.'-settings':
					include_once(WWAC_PLUGIN_DIR_PATH."core/admin/settings-page.php");
					break;
				case WWAC_PLUGIN_MENU_SLUG.'-archives':
					include_once(WWAC_PLUGIN_DIR_PATH."core/admin/archives-page.php");
					break;
				case WWAC_PLUGIN_MENU_SLUG.'-license':
					include_once(WWAC_PLUGIN_DIR_PATH."core/admin/license-page.php");
					break;
				case WWAC_PLUGIN_MENU_SLUG.'-asari-key':
					include_once(WWAC_PLUGIN_DIR_PATH."core/admin/asarikey-page.php");
					break;
				case WWAC_PLUGIN_MENU_SLUG.'-reu':
					include_once(WWAC_PLUGIN_DIR_PATH."core/admin/properties-updater.php");
					break;
				case WWAC_PLUGIN_MENU_SLUG.'-req':
					include_once(WWAC_PLUGIN_DIR_PATH."core/admin/requirements-page.php");
					break;
				case WWAC_PLUGIN_MENU_SLUG.'-competitors':
					include_once(WWAC_PLUGIN_DIR_PATH."core/admin/competitor-competitors-page.php");
					break;
				default:
					include_once(WWAC_PLUGIN_DIR_PATH."core/admin/main-page.php");
					break;
			}
			?>
			</div>
		</div>
		<?php
	}
	
	public function WWACRegisterCSSJS(){
		global $post;
		
		wp_register_style('wwac-font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
		
		wp_register_style('wwac-single-styles', WWAC_PLUGIN_DIR_URL.'assets/css/wwac-single.css');
		wp_register_style('wwac-single-map-styles', 'https://unpkg.com/leaflet/dist/leaflet.css');
		wp_register_script('wwac-single-scripts', WWAC_PLUGIN_DIR_URL.'assets/js/wwac-single.js', array('jquery'), '1.0.0', true);
		wp_register_script('wwac-single-map-scripts', 'https://unpkg.com/leaflet/dist/leaflet.js', array(), '1.0.0', false);
		
		wp_register_style('wwac-admin-plugin-styles', WWAC_PLUGIN_DIR_URL.'assets/css/admin-settings.css');
		
		wp_register_style('wwac-archive-styles-default', WWAC_PLUGIN_DIR_URL.'assets/css/wwac-properties.css');
		wp_register_style('wwac-archive-styles-compact', WWAC_PLUGIN_DIR_URL.'assets/css/wwac-properties-compact.css');
		wp_register_style('wwac-archive-styles-grid', WWAC_PLUGIN_DIR_URL.'assets/css/wwac-properties-grid.css');
		
		wp_register_style('wwac-search-styles', WWAC_PLUGIN_DIR_URL.'assets/css/wwac-search.css');
		wp_register_script('wwac-search-scripts', WWAC_PLUGIN_DIR_URL.'assets/js/wwac-search.js', array('jquery'), '1.0.0', true);
		
		wp_register_script('wwac-admin-search-scripts', WWAC_PLUGIN_DIR_URL.'assets/js/admin-wwac-search-cpt.js', array('jquery'), '1.0.0', true);
		
		if(is_singular('nieruchomosci')){
			wp_enqueue_style('wwac-single-styles');
			wp_enqueue_script('wwac-single-scripts');
			
			//wp_enqueue_style('wwac-single-map-styles');
            //wp_enqueue_script('wwac-single-map-scripts');
		}
		
		if(!empty($post -> post_content)){
			/*if((is_a($post, 'WP_Post') || is_archive()) && (has_shortcode($post -> post_content, 'all_properties') || has_shortcode($post -> post_content, 'properties_archive'))){
				wp_enqueue_script('wwac-archive-styles');
			}*/
			
			if((is_a($post, 'WP_Post') || is_archive())){
				if(has_shortcode($post -> post_content, 'all_properties') || has_shortcode($post -> post_content, 'properties_archive')){
					wp_enqueue_script('wwac-archive-styles');
				}
				
				if(has_shortcode($post -> post_content, 'property_search')){
					wp_enqueue_style('wwac-search-styles');
					wp_enqueue_script('wwac-search-scripts');
				}
			}
		}
	}
	
	public function WWACEnqueueAdminPluginAssets(){
		$screen = get_current_screen();
		
		if(is_object($screen) && !empty(WWAC_PLUGIN_MENU_SLUG)){
			if(strpos($screen -> base, WWAC_PLUGIN_MENU_SLUG)){
				wp_enqueue_style('wwac-admin-plugin-styles');
			}
		}
	}
	
	public function customPostTypeArchive($archive_template) {
		global $post;

		if (is_post_type_archive('nieruchomosci')) {
			$archive_template = WWAC_PLUGIN_DIR_URL.'/core/templates/archive/archive-nieruchomosci.php';
		}

		return $archive_template;
	}
	
	/*public function WWACCPTSingleArchiveTemplate($single) {
        global $post;
		
        if($post->post_type == 'nieruchomosci'){
            if(file_exists(WWAC_PLUGIN_DIR_URL.'core/templates/single-nieruchomosci.php')){
                return WWAC_PLUGIN_DIR_URL.'core/templates/single-nieruchomosci.php';
            }
        }
		
        return $single;
    }*/
	
	public function getWPUploadDirCustomTemplates(){
		$WPUploadDir = wp_upload_dir();
		
		if(wp_mkdir_p($WPUploadDir['path'])){
			$wpDir = $WPUploadDir['path'];
		}else{
			$wpDir = $WPUploadDir['basedir'];
		}
		
		if(is_dir($WPUploadDir['path'].'/webist-wp-asaricrm/templates')){
			$uploadDir = $wpDir.'/webist-wp-asaricrm/templates';
		}else if(is_dir($WPUploadDir['path'].'/webist-wp-asaricrm-pro/templates')){
			$uploadDir = $wpDir.'/webist-wp-asaricrm-pro/templates';
		}else{
			wp_mkdir_p($WPUploadDir['path'].'/webist-wp-asaricrm/templates');
			$uploadDir = $wpDir.'/webist-wp-asaricrm/templates';
		}
		
		return $uploadDir;
	}
	
	public function WWACCPTSingleArchiveTemplate($single){
        global $post;
		
		$activeSingleTemplate = get_option('WWAC_Archives_SingleOffer_Template');
		$activeSingleTemplateType = get_option('WWAC_Archives_SingleOffer_TemplateType');
		
		if(get_option('WWAC_Archives_SingleOffer_TemplateStatus') == 1){ // 2 is true
			return $single;
		}
		
		switch($activeSingleTemplateType){
			case 'internal':
				$dir = WWAC_PLUGIN_DIR_PATH.'core/templates/single-templates';
				break;
			case 'external':
				$dir = $this -> getWPUploadDirCustomTemplates().'/single-templates';
				break;
			default:
				return $single;
				break;
		}
		
        if(isSet($post) && $post -> post_type === 'nieruchomosci'){
            if(is_single()){
                $singleTemplate = $dir."/".$activeSingleTemplate.'/template.php';
                if(file_exists($singleTemplate)){
                    return $singleTemplate;
                }
            }

            // Nadpisanie szablonu archiwum
            /*if (is_post_type_archive('nieruchomosci')) {
                $plugin_archive_template = plugin_dir_path(__FILE__) . 'templates/archive-portfolio.php';
                if (file_exists($plugin_archive_template)) {
                    return $plugin_archive_template;
                }
            }*/
        }
		
        return $single;
    }
	
	public function WWACCPTAllArchiveTemplate($template){
		$activeAllOffersTemplate = get_option('WWAC_Archives_AllOffers_Template');
		$activeAllOffersTemplateType = get_option('WWAC_Archives_AllOffers_TemplateType');
		
		if((int) get_option('WWAC_Archives_AllOffers_TemplateStatus') == 0){ // 1 is true
			return $template;
		}
		
		switch($activeAllOffersTemplateType){
			case 'internal':
				$dir = WWAC_PLUGIN_DIR_PATH.'core/templates/properties-templates';
				break;
			case 'external':
				$dir = $this -> getWPUploadDirCustomTemplates().'/properties-templates';
				break;
			default:
				return $template;
				break;
		}
		
		if(is_post_type_archive('nieruchomosci')){
			$template = $dir."/".$activeAllOffersTemplate.'/template.php';
			
			if(file_exists($template)){
				return $template;
			}
        }else{
			return $template;
		}
	}
	
	public function WWACCPTAgentArchiveTemplate($template){
		$activeAllOffersTemplate = get_option('WWAC_Archives_Agent_Template');
		$activeAllOffersTemplateType = get_option('WWAC_Archives_Agent_TemplateType');
		
		if((int) get_option('WWAC_Archives_Agent_TemplateStatus') == 1){ // 2 is true
			return $template;
		}
		
		switch($activeAllOffersTemplateType){
			case 'internal':
				$dir = WWAC_PLUGIN_DIR_PATH.'core/templates/agent-templates';
				break;
			case 'external':
				$dir = $this -> getWPUploadDirCustomTemplates().'/agent-templates';
				break;
			default:
				return $template;
				break;
		}
		
		if(is_tax('Agent')){
			$template = $dir."/".$activeAllOffersTemplate.'/template.php';
			
			if(file_exists($template)){
				return $template;
			}
        }else{
			return $template;
		}
	}
	
	public function WWAC_SearchParamsQueryModifier($query){
		if(!is_admin() && isset($query -> query_vars['post_type']) && $query -> query_vars['post_type'] == 'nieruchomosci'){
			
			// propertyPriceRaw
			if(!empty($_GET['cena_min']) || !empty($_GET['cena_max'])){
				$meta_query = [];

				if(!empty($_GET['cena_min'])){
					$meta_query[] = [
						'key'     => 'propertyPriceRaw',
						'value'   => (int) $_GET['cena_min'],
						'compare' => '>=',
						'type'    => 'NUMERIC'
					];
				}

				if(!empty($_GET['cena_max'])){
					$meta_query[] = [
						'key'     => 'propertyPriceRaw',
						'value'   => (int) $_GET['cena_max'],
						'compare' => '<=',
						'type'    => 'NUMERIC'
					];
				}

				$query->set('meta_query', $meta_query);
			}

			// propertyAreaRaw
			if(!empty($_GET['powierzchnia_min']) || !empty($_GET['powierzchnia_max'])){
				$meta_query = $query->get('meta_query', []);
				
				if(!empty($_GET['powierzchnia_min'])){
					$meta_query[] = [
						'key'     => 'propertyAreaRaw',
						'value'   => (int) $_GET['powierzchnia_min'],
						'compare' => '>=',
						'type'    => 'NUMERIC'
					];
				}

				if(!empty($_GET['powierzchnia_max'])){
					$meta_query[] = [
						'key'     => 'propertyAreaRaw',
						'value'   => (int) $_GET['powierzchnia_max'],
						'compare' => '<=',
						'type'    => 'NUMERIC'
					];
				}

				$query->set('meta_query', $meta_query);
			}

			// taksonomie
			$taxonomies = [
				'kategorie'   => 'Kategorie',
				'typ'         => 'Typ',
				'lokalizacja' => 'Lokalizacja',
				'dzielnica'   => 'Dzielnica',
				'agent'       => 'Agent',
			];

			$tax_query = [];
			foreach($taxonomies as $param => $taxonomy){
				if(!empty($_GET[$param])){
					$tax_query[] = [
						'taxonomy' => $taxonomy,
						'field'    => 'slug',
						'terms'    => sanitize_text_field($_GET[$param]),
						'operator' => 'IN',
					];
				}
			}

			if(!empty($tax_query)){
				$query->set('tax_query', $tax_query);
			}
		}

		return $query;
	}
	
	/* public function WWACAllPropertiesShortcode($atts){
		if(!wp_style_is('font-awesome', 'registered')){
			wp_enqueue_style('wwac-font-awesome');
		}
		
		$atts = shortcode_atts(
			array(
				'limit' => 9
			), $atts);
		
		wp_enqueue_style('wwac-archive-styles-default');
		
		$curpage = (get_query_var('paged')) ? get_query_var('paged') : 1;
		$the_query = new WP_Query(array(
			'posts_per_page' => $atts['limit'],
			'post_type' => 'nieruchomosci',
			'post_status' => 'publish',
			'paged' => $curpage) 
		);
		$total_pages = $the_query->max_num_pages;
		
		$return = '
			<div class="nieruchomosci-posts">';
			
		while($the_query -> have_posts()){
			$the_query -> the_post();
			$metaInfo = Array(
				'propertyLocalization' => get_post_meta(get_the_ID(), 'propertyLocalization', true),
				'propertyPrice' => get_post_meta(get_the_ID(), 'propertyPrice', true),
				'propertyArea' => get_post_meta(get_the_ID(), 'propertyArea', true),
			);
				
			if(has_post_thumbnail()){
				$return .= '
					<div class="nieruchomosci-post-thumbnail" style="background: url('.get_the_post_thumbnail_url().') no-repeat center center;"><img src="'.get_the_post_thumbnail_url().'" style="width: 0% !important; height: 0% !important;" alt="'.ucwords(mb_strtolower(get_the_title())).'"/></div>
					<div class="nieruchomosci-property">
				
					<h3 class="nieruchomosci-title"><a href="'.get_post_permalink().'" class="nieruchomosci-title-link">'.get_the_title().'</a></h3>';
			}else{
				$return .= '
					<div class="nieruchomosci-post-thumbnail" style="background: url('.WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png) no-repeat center center;"><img src="'.WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png" style="width: 0% !important; height: 0% !important;" alt="'.ucwords(mb_strtolower(get_the_title())).'"/></div>
					<div class="nieruchomosci-property">
				
					<h3 class="nieruchomosci-title"><a href="'.get_post_permalink().'" class="nieruchomosci-title-link">'.get_the_title().'</a></h3>';
			}
			$return .= '
				<div class="nieruchomosci-property-details">
					<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-money-bill"></i> Cena: '.$metaInfo['propertyPrice'].' złotych</div>
					<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-map-marker-alt"></i> '.$metaInfo['propertyLocalization'].'</div>
					<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-object-ungroup"></i> Powierzchnia: '.$metaInfo['propertyArea'].' m<sup>2</sup></div>
				</div>
				
				<a href="'.get_post_permalink().'" class="nieruchomosci-see-more-button">Pokaż więcej</a>
			</div>';
		}
			
		$return .= '
		</div>
			
		<div class="nieruchomosci-pagination">
			<a href="'.get_pagenum_link(1).'" class="skipper">&laquo;</a>
			<a href="'.get_pagenum_link(($curpage-1 > 0 ? $curpage-1 : 1)).'" class="skipper">&lsaquo;</a>';
			for($i = 1; $i <= $the_query -> max_num_pages; $i++){
				if($i == $curpage){
					$return .= '<a href="'.get_pagenum_link($i).'" class="active">'.$i.'</a>';
				}else{
					$return .= '<a href="'.get_pagenum_link($i).'" class="">'.$i.'</a>';
				}
			}
			$return .= '<a href="'.get_pagenum_link(($curpage+1 <= $the_query->max_num_pages ? $curpage+1 : $the_query->max_num_pages)).'" class="skipper">&rsaquo;</a>
				<a href="'.get_pagenum_link($the_query -> max_num_pages).'" class="skipper">&raquo;</a>
		</div>';
			
		wp_reset_postdata();
			
		return $return;
	} */
	
	public function WWACAllPropertiesShortcode($atts){
		if(!wp_style_is('font-awesome', 'registered')){
			wp_enqueue_style('wwac-font-awesome');
		}

		$atts = shortcode_atts(
			array(
				'limit' => 9,
				'style' => 'default',
			),
			$atts
		);
		
		$style = sanitize_key($atts['style']);
		
		if(!in_array($style, array('default', 'compact', 'grid'), true)){
			$style = 'default';
		}

		$curpage = (get_query_var('paged')) ? get_query_var('paged') : 1;

		$the_query = new WP_Query(array(
			'posts_per_page' => (int)$atts['limit'],
			'post_type' => 'nieruchomosci',
			'post_status' => 'publish',
			'paged' => $curpage
		));

		$total_pages = $the_query -> max_num_pages;
		
		$return = '
			<div class="nieruchomosci-posts">';

		while($the_query -> have_posts()){
			$the_query -> the_post();

			$metaInfo = Array(
				'propertyLocalization' => get_post_meta(get_the_ID(), 'propertyLocalization', true),
				'propertyPrice' => get_post_meta(get_the_ID(), 'propertyPrice', true),
				'propertyArea' => get_post_meta(get_the_ID(), 'propertyArea', true),
			);
			
			if($style === 'default'){
				wp_enqueue_style('wwac-archive-styles-default');
				
				if(has_post_thumbnail()){
					$return .= '
						<div class="nieruchomosci-post-thumbnail" style="background: url('.get_the_post_thumbnail_url().') no-repeat center center;"><img src="'.get_the_post_thumbnail_url().'" style="width: 0% !important; height: 0% !important;" alt="'.ucwords(mb_strtolower(get_the_title())).'"/></div>
						<div class="nieruchomosci-property">

						<h3 class="nieruchomosci-title"><a href="'.get_post_permalink().'" class="nieruchomosci-title-link">'.get_the_title().'</a></h3>';
				}else{
					$return .= '
						<div class="nieruchomosci-post-thumbnail" style="background: url('.WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png) no-repeat center center;"><img src="'.WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png" style="width: 0% !important; height: 0% !important;" alt="'.ucwords(mb_strtolower(get_the_title())).'"/></div>
						<div class="nieruchomosci-property">

						<h3 class="nieruchomosci-title"><a href="'.get_post_permalink().'" class="nieruchomosci-title-link">'.get_the_title().'</a></h3>';
				}

				$return .= '
					<div class="nieruchomosci-property-details">
						<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-money-bill"></i> Cena: '.$metaInfo['propertyPrice'].' złotych</div>
						<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-map-marker-alt"></i> '.$metaInfo['propertyLocalization'].'</div>
						<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-object-ungroup"></i> Powierzchnia: '.$metaInfo['propertyArea'].' m<sup>2</sup></div>
					</div>

					<a href="'.get_post_permalink().'" class="nieruchomosci-see-more-button">Pokaż więcej</a>
				</div>';
			}else if($style === 'compact'){
				wp_enqueue_style('wwac-archive-styles-compact');
				
				$thumb_url = has_post_thumbnail()
					? get_the_post_thumbnail_url()
					: WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png';

				$return .= '
					<article class="nieruchomosci-compact-card">
						<a class="nieruchomosci-compact-thumb" href="'.get_post_permalink().'" style="background-image:url('.$thumb_url.');">
							<img src="'.$thumb_url.'" alt="'.ucwords(mb_strtolower(get_the_title())).'" />
						</a>

						<div class="nieruchomosci-compact-body">
							<h3 class="nieruchomosci-compact-title">
								<a href="'.get_post_permalink().'">'.get_the_title().'</a>
							</h3>

							<div class="nieruchomosci-compact-meta">
								<span class="nieruchomosci-compact-price"><i aria-hidden="true" class="fa fa-money-bill"></i> '.$metaInfo['propertyPrice'].' zł</span>
								<span class="nieruchomosci-compact-loc"><i aria-hidden="true" class="fa fa-map-marker-alt"></i> '.$metaInfo['propertyLocalization'].'</span>
								<span class="nieruchomosci-compact-area"><i aria-hidden="true" class="fa fa-object-ungroup"></i> '.$metaInfo['propertyArea'].' m<sup>2</sup></span>
							</div>

							<div class="nieruchomosci-compact-actions">
								<a href="'.get_post_permalink().'" class="nieruchomosci-see-more-button">Zobacz ofertę</a>
							</div>
						</div>
					</article>';
			}else if($style === 'grid'){
				wp_enqueue_style('wwac-archive-styles-grid');
				
				$thumb_url = has_post_thumbnail()
					? get_the_post_thumbnail_url()
					: WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png';

				$return .= '
					<article class="nieruchomosci-grid-card">
						<a class="nieruchomosci-grid-thumb" href="'.get_post_permalink().'" style="background-image:url('.$thumb_url.');">
							<img src="'.$thumb_url.'" alt="'.ucwords(mb_strtolower(get_the_title())).'" />
							<span class="nieruchomosci-grid-price">'.$metaInfo['propertyPrice'].' zł</span>
						</a>

						<div class="nieruchomosci-grid-body">
							<h3 class="nieruchomosci-grid-title">
								<a href="'.get_post_permalink().'">'.get_the_title().'</a>
							</h3>

							<div class="nieruchomosci-grid-meta">
								<div class="nieruchomosci-grid-meta-row"><i aria-hidden="true" class="fa fa-map-marker-alt"></i> '.$metaInfo['propertyLocalization'].'</div>
								<div class="nieruchomosci-grid-meta-row"><i aria-hidden="true" class="fa fa-object-ungroup"></i> '.$metaInfo['propertyArea'].' m<sup>2</sup></div>
							</div>

							<a href="'.get_post_permalink().'" class="nieruchomosci-see-more-button">Zobacz ofertę</a>
						</div>
					</article>';
			}
		}

		$return .= '
			</div>

			<div class="nieruchomosci-pagination">
				<a href="'.get_pagenum_link(1).'" class="skipper">&laquo;</a>
				<a href="'.get_pagenum_link(($curpage-1 > 0 ? $curpage-1 : 1)).'" class="skipper">&lsaquo;</a>';

		for($i = 1; $i <= $the_query -> max_num_pages; $i++){
			if($i == $curpage){
				$return .= '<a href="'.get_pagenum_link($i).'" class="active">'.$i.'</a>';
			}else{
				$return .= '<a href="'.get_pagenum_link($i).'" class="">'.$i.'</a>';
			}
		}

		$return .= '<a href="'.get_pagenum_link(($curpage+1 <= $the_query->max_num_pages ? $curpage+1 : $the_query -> max_num_pages)).'" class="skipper">&rsaquo;</a>
				<a href="'.get_pagenum_link($the_query -> max_num_pages).'" class="skipper">&raquo;</a>
			</div>';

		wp_reset_postdata();

		return $return;
	}
	
	/* public function WWACAllPropertiesArchive(){
		if(!wp_style_is('font-awesome', 'registered')){
			wp_enqueue_style('wwac-font-awesome');
		}
		
		wp_enqueue_style('wwac-archive-styles');
		
		if(have_posts()){
			
		$return = '
		<div class="nieruchomosci-posts">';
		
		global $wp_query;
		global $paged;
		$curpage = $paged ? $paged : 1;
		
        while(have_posts()){
            the_post();
			
            if(has_post_thumbnail()){
				$return .= '
				<div class="nieruchomosci-post-thumbnail" style="background: url('.get_the_post_thumbnail_url().') no-repeat center center; background-size: cover;min-height: 350px;"><img src="'.get_the_post_thumbnail_url().'" style="width: 0% !important; height: 0% !important;" alt="'.ucwords(mb_strtolower(get_the_title())).'"/></div>
				<div class="nieruchomosci-property">
				
					<h3 class="nieruchomosci-title"><a href="'.get_post_permalink().'" class="nieruchomosci-title-link">'.get_the_title().'</a></h3>';
			}else{
				$return .= '
					<div class="nieruchomosci-post-thumbnail" style="background: url('.WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png) no-repeat center center;"><img src="'.WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png" style="width: 0% !important; height: 0% !important;" alt="'.ucwords(mb_strtolower(get_the_title())).'"/></div>
					<div class="nieruchomosci-property">
				
					<h3 class="nieruchomosci-title"><a href="'.get_post_permalink().'" class="nieruchomosci-title-link">'.get_the_title().'</a></h3>';
			}
			
			$metaInfo = Array(
				'propertyLocalization' => get_post_meta(get_the_ID(), 'propertyLocalization', true),
				'propertyPrice' => get_post_meta(get_the_ID(), 'propertyPrice', true),
				'propertyArea' => get_post_meta(get_the_ID(), 'propertyArea', true),
			);
			
			$return .= '
					<div class="nieruchomosci-property-details">
						<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-money-bill"></i> Cena: '.$metaInfo['propertyPrice'].' złotych</div>
						<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-map-marker-alt"></i> '.$metaInfo['propertyLocalization'].'</div>
						<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-object-ungroup"></i> Powierzchnia: '.$metaInfo['propertyArea'].' m<sup>2</sup></div>
					</div>
				
					<a href="'.get_post_permalink().'" class="nieruchomosci-see-more-button">Pokaż więcej</a>
				</div>';
		}
		
		$return .= '
		</div>

		<div class="nieruchomosci-pagination">
			<a href="'.get_pagenum_link(1).'" class="skipper">&laquo;</a>
			<a href="'.get_pagenum_link(($curpage-1 > 0 ? $curpage-1 : 1)).'" class="skipper">&lsaquo;</a>';
			
		for($i = 1; $i <= $wp_query -> max_num_pages; $i++){
			if($i == $curpage){
				$return .= '<a href="'.get_pagenum_link($i).'" class="active">'.$i.'</a>';
			}else{
				$return .= '<a href="'.get_pagenum_link($i).'">'.$i.'</a>';
			}
		}
		$return .= '
			<a href="'.get_pagenum_link(($curpage+1 <= $wp_query->max_num_pages ? $curpage+1 : $wp_query->max_num_pages)).'" class="skipper">&rsaquo;</a>
			<a href="'.get_pagenum_link($wp_query -> max_num_pages).'" class="skipper">&raquo;</a>
		</div>';
		
		}else{
			$return = 'Brak nieruchomości do wyświetlenia';
		}
		
		return $return;
	} */
	
	public function WWACAllPropertiesArchive($atts = array()){
		if(!wp_style_is('font-awesome', 'registered')){
			wp_enqueue_style('wwac-font-awesome');
		}

		$atts = shortcode_atts(
			array(
				'style' => 'default',
			),
			$atts
		);

		$style = sanitize_key($atts['style']);

		if(!in_array($style, array('default', 'compact', 'grid'), true)){
			$style = 'default';
		}

		if(have_posts()){
			
		$return = '
		<div class="nieruchomosci-posts">';
		
		global $wp_query;
		global $paged;
		$curpage = $paged ? $paged : 1;
		
        while(have_posts()){
            the_post();

			$metaInfo = Array(
				'propertyLocalization' => get_post_meta(get_the_ID(), 'propertyLocalization', true),
				'propertyPrice' => get_post_meta(get_the_ID(), 'propertyPrice', true),
				'propertyArea' => get_post_meta(get_the_ID(), 'propertyArea', true),
			);

			if($style === 'default'){
				wp_enqueue_style('wwac-archive-styles-default');

				if(has_post_thumbnail()){
					$return .= '
					<div class="nieruchomosci-post-thumbnail" style="background: url('.get_the_post_thumbnail_url().') no-repeat center center; background-size: cover;min-height: 350px;"><img src="'.get_the_post_thumbnail_url().'" style="width: 0% !important; height: 0% !important;" alt="'.ucwords(mb_strtolower(get_the_title())).'"/></div>
					<div class="nieruchomosci-property">
					
						<h3 class="nieruchomosci-title"><a href="'.get_post_permalink().'" class="nieruchomosci-title-link">'.get_the_title().'</a></h3>';
				}else{
					$return .= '
						<div class="nieruchomosci-post-thumbnail" style="background: url('.WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png) no-repeat center center;"><img src="'.WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png" style="width: 0% !important; height: 0% !important;" alt="'.ucwords(mb_strtolower(get_the_title())).'"/></div>
						<div class="nieruchomosci-property">
					
						<h3 class="nieruchomosci-title"><a href="'.get_post_permalink().'" class="nieruchomosci-title-link">'.get_the_title().'</a></h3>';
				}

				$return .= '
						<div class="nieruchomosci-property-details">
							<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-money-bill"></i> Cena: '.$metaInfo['propertyPrice'].' złotych</div>
							<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-map-marker-alt"></i> '.$metaInfo['propertyLocalization'].'</div>
							<div class="nieruchomosci-property-single-detail"><i aria-hidden="true" class="fa fa-object-ungroup"></i> Powierzchnia: '.$metaInfo['propertyArea'].' m<sup>2</sup></div>
						</div>
					
						<a href="'.get_post_permalink().'" class="nieruchomosci-see-more-button">Pokaż więcej</a>
					</div>';

			}else if($style === 'compact'){
				wp_enqueue_style('wwac-archive-styles-compact');

				$thumb_url = has_post_thumbnail()
					? get_the_post_thumbnail_url()
					: WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png';

				$return .= '
					<article class="nieruchomosci-compact-card">
						<a class="nieruchomosci-compact-thumb" href="'.get_post_permalink().'" style="background-image:url('.$thumb_url.');">
							<img src="'.$thumb_url.'" alt="'.ucwords(mb_strtolower(get_the_title())).'" />
						</a>

						<div class="nieruchomosci-compact-body">
							<h3 class="nieruchomosci-compact-title">
								<a href="'.get_post_permalink().'">'.get_the_title().'</a>
							</h3>

							<div class="nieruchomosci-compact-meta">
								<span class="nieruchomosci-compact-price"><i aria-hidden="true" class="fa fa-money-bill"></i> '.$metaInfo['propertyPrice'].' zł</span>
								<span class="nieruchomosci-compact-loc"><i aria-hidden="true" class="fa fa-map-marker-alt"></i> '.$metaInfo['propertyLocalization'].'</span>
								<span class="nieruchomosci-compact-area"><i aria-hidden="true" class="fa fa-object-ungroup"></i> '.$metaInfo['propertyArea'].' m<sup>2</sup></span>
							</div>

							<div class="nieruchomosci-compact-actions">
								<a href="'.get_post_permalink().'" class="nieruchomosci-see-more-button">Zobacz ofertę</a>
							</div>
						</div>
					</article>';

			}else if($style === 'grid'){
				wp_enqueue_style('wwac-archive-styles-grid');

				$thumb_url = has_post_thumbnail()
					? get_the_post_thumbnail_url()
					: WWAC_PLUGIN_DIR_URL.'assets/img/property-placeholder.png';

				$return .= '
					<article class="nieruchomosci-grid-card">
						<a class="nieruchomosci-grid-thumb" href="'.get_post_permalink().'" style="background-image:url('.$thumb_url.');">
							<img src="'.$thumb_url.'" alt="'.ucwords(mb_strtolower(get_the_title())).'" />
							<span class="nieruchomosci-grid-price">'.$metaInfo['propertyPrice'].' zł</span>
						</a>

						<div class="nieruchomosci-grid-body">
							<h3 class="nieruchomosci-grid-title">
								<a href="'.get_post_permalink().'">'.get_the_title().'</a>
							</h3>

							<div class="nieruchomosci-grid-meta">
								<div class="nieruchomosci-grid-meta-row"><i aria-hidden="true" class="fa fa-map-marker-alt"></i> '.$metaInfo['propertyLocalization'].'</div>
								<div class="nieruchomosci-grid-meta-row"><i aria-hidden="true" class="fa fa-object-ungroup"></i> '.$metaInfo['propertyArea'].' m<sup>2</sup></div>
							</div>

							<a href="'.get_post_permalink().'" class="nieruchomosci-see-more-button">Zobacz ofertę</a>
						</div>
					</article>';
			}
		}
		
		$return .= '
		</div>

		<div class="nieruchomosci-pagination">
			<a href="'.get_pagenum_link(1).'" class="skipper">&laquo;</a>
			<a href="'.get_pagenum_link(($curpage-1 > 0 ? $curpage-1 : 1)).'" class="skipper">&lsaquo;</a>';
			
		for($i = 1; $i <= $wp_query -> max_num_pages; $i++){
			if($i == $curpage){
				$return .= '<a href="'.get_pagenum_link($i).'" class="active">'.$i.'</a>';
			}else{
				$return .= '<a href="'.get_pagenum_link($i).'">'.$i.'</a>';
			}
		}
		$return .= '
			<a href="'.get_pagenum_link(($curpage+1 <= $wp_query->max_num_pages ? $curpage+1 : $wp_query->max_num_pages)).'" class="skipper">&rsaquo;</a>
			<a href="'.get_pagenum_link($wp_query -> max_num_pages).'" class="skipper">&raquo;</a>
		</div>';
		
		}else{
			$return = 'Brak nieruchomości do wyświetlenia';
		}
		
		return $return;
	}
	
	public function WWACGetPropertyMetaShortcode($atts){
		global $post;
		
		$atts = shortcode_atts(
			array(
				'meta_key' => '', // Klucz metadanych, który chcesz pobrać
				'post_id' => get_the_ID(), // Identyfikator posta (domyślnie bieżący post)
			), $atts);
			
		if(empty($atts['meta_key'])){
			$meta_value = 'Błąd: Nie podano klucza metadanych.';
		}else{
			$meta_value = get_post_meta($atts['post_id'], $atts['meta_key'], true);
		}
			
		if(!strcmp($atts['meta_key'], 'propertyKitchenEquipment')){
			if(!is_array($meta_value)){
				$mvalues = json_decode($meta_value, true);
			}else{
				$mvalues = array('brak');
			}
			
			if(json_last_error() !== JSON_ERROR_NONE || empty($mvalues) || !is_array($mvalues)){
				return 'Brak';
			}
			
			$dictionaryKitchen = array(
				'brak' => 'Brak',
				'freezer' => 'Zamrażarka',
				'hood' => 'Okap',
				'electricoven' => 'Piekarnik elektryczny',
				'refrigerator' => 'Lodówka',
				'sink' => 'Zlew',
				'kitchenfurniture' => 'Meble',
				'oven' => 'Piekarnik',
				'dishwasher' => 'Zmywarka',
				'microwave' => 'Mikrofalówka',
				'gashob' => 'Płyta gazowa',
				'washingmachine' => 'Pralka',
			);
			
			if(!is_array($mvalues)){
				$mvalues = array('brak');
			}
			
			$labels = [];
			
			foreach($mvalues as $mvalue){
				$k = mb_strtolower($mvalue, 'UTF-8');
				
				if(isSet($dictionaryKitchen[$k])){
					$labels[] = $dictionaryKitchen[$k];
				}
			}

			$meta_value = implode(', ', $labels);
		}else if(!strcmp($atts['meta_key'], 'propertyHeating')){
			if(!is_array($meta_value)){
				$mvalues = json_decode($meta_value, true);
			}else{
				$mvalues = array('brak');
			}
			
			if(json_last_error() !== JSON_ERROR_NONE || empty($mvalues) || ! is_array($mvalues)){
				return 'Brak';
			}
			
			$dictionaryHeating = array(
				'brak' => 'Brak',
				'fireplace' => 'Kominek',
				'gas' => 'Gazowe',
				'floor' => 'Podłogowe',
				'city' => 'Miasto',
				'own' => 'Własne',
				'electric' => 'Elektryczne',
				'oil' => 'Olejowe',
				'coal' => 'Węglowe',
				'environmental' => 'Odnawialne',
				'other' => 'Inne',
				'stove' => 'Piec',
				'heatPump' => 'Pompa ciepła',
				'solidFuel' => 'Paliwo stałe',
				'hotAirBlowerUsingGas' => 'Nagrzewnica powietrza na gaz',
				'hotAirBlowerUsingWater' => 'Nagrzewnica powietrza na wodę',
				'infraredHeater' => 'Promiennik podczerwieni',
				'biomass' => 'Biomasa',
			);
			
			if(!is_array($mvalues)){
				$mvalues = array('brak');
			}
			
			$labels = [];
			
			foreach($mvalues as $mvalue){
				$k = mb_strtolower($mvalue, 'UTF-8');
				
				if(isSet($dictionaryHeating[$k])){
					$labels[] = $dictionaryHeating[$k];
				}
			}

			$meta_value = implode(', ', $labels);
		}else if(!strcmp($atts['meta_key'], 'mortgageMarket')){
			switch($meta_value){
				case 'primary':
					$meta_value = 'Pierwotny';
					break;
				case 'secondary':
					$meta_value = 'Wtórny';
					break;
				default:
					$meta_value = 'Brak';
					break;
			}
		}else if(!strcmp($atts['meta_key'], 'propertyElevator')){
			switch($meta_value){
				case 0:
					$meta_value = 'Brak';
					break;
				case 1:
					$meta_value = 'Jest';
					break;
				default:
					$meta_value = 'Brak';
					break;
			}
		}else if(!strcmp($atts['meta_key'], 'propertyEnergyCertificateState')){
			switch($meta_value){
				case 1:
					$meta_value = 'Jest';
					break;
				case 2:
					$meta_value = 'Nie ma';
					break;
				case 3:
					$meta_value = 'Nie jest wymagany';
					break;
				default:
					$meta_value = 'Brak';
					break;
			}
		}else if(!strcmp($atts['meta_key'], 'propertyGarage')){
			switch($meta_value){
				case 1:
					$meta_value = 'Jest';
					break;
				case 0:
					$meta_value = 'Brak';
					break;
				default:
					$meta_value = 'Brak';
					break;
			}
		}else if(!strcmp($atts['meta_key'], 'propertyWindows')){
			$mvalues = $meta_value;
			
			if(!is_array($mvalues)){
				if($mvalues === '' || $mvalues === null){
					$mvalues = array();
				}else{
					$mvalues = array($mvalues);
				}
			}
			
			$mvaluesCount = count($mvalues);
			$meta_value = '';
			$possibleValues = Array(
				1 => 'Aluminium',
				2 => 'PCV',
				3 => 'Drewniane starego typu',
				4 => 'Drewniane nowego typu',
				5 => 'Stalowe',
				6 => 'Dachowe',
				7 => 'Antywłamaniowe',
				8 => 'Z osłonami',
				9 => 'Z żaluzjami',
				10 => 'Starego typu',
			);
				
			for($i = 0; $i < $mvaluesCount; $i++){
				if($i == $mvaluesCount - 1){
					$meta_value .= $possibleValues[$mvalues[$i]];
				}else{
					$meta_value .= $possibleValues[$mvalues[$i]].', ';
				}
			}
				
			if(substr($meta_value, -2) === ', '){
				$meta_value = substr($meta_value, 0, -2);
			}
			
			if(empty($meta_value)){
				$meta_value = 'Brak';
			}
		}else if(!strcmp($atts['meta_key'], 'propertyWatersType')){
			$mvalues = $meta_value;
			
			if(!is_array($mvalues)){
				if($mvalues === '' || $mvalues === null){
					$mvalues = array();
				}else{
					$mvalues = array($mvalues);
				}
			}
			
			$mvaluesCount = count($mvalues);
			$meta_value = '';
			$possibleValues = Array(
				1 => 'Brak',
				2 => 'Studnia',
				3 => 'Woda miejska',
				4 => 'Woda miejska (na działce)',
				5 => 'Woda miejska (w drodze)',
			);
				
			for($i = 0; $i < $mvaluesCount; $i++){
				if($i == $mvaluesCount - 1){
					$meta_value .= $possibleValues[$mvalues[$i]];
				}else{
					$meta_value .= $possibleValues[$mvalues[$i]].', ';
				}
			}
				
			if(substr($meta_value, -2) === ', '){
				$meta_value = substr($meta_value, 0, -2);
			}
			
			if(empty($meta_value)){
				$meta_value = 'Brak';
			}
		}else if(!strcmp($atts['meta_key'], 'propertyIntercom')){
			switch($meta_value){
				case 0:
					$meta_value = 'Brak';
					break;
				case 1:
					$meta_value = 'Jest';
					break;
				default:
					$meta_value = 'Brak';
					break;
			}
		}else if(!strcmp($atts['meta_key'], 'propertyExposureList')){
			$possibleValues = Array(
				'nord' => 'Północ',
				'south' => 'Południe',
				'east' => 'Wschód',
				'west' => 'Zachód',
			);
			
			if(!is_array($meta_value)){
				if($meta_value === '' || $meta_value === null){
					$meta_value = array();
				}else{
					$meta_value = array($meta_value);
				}
			}
			
			$meta_value = array_map(
				function($direction) use ($possibleValues){
					return $possibleValues[$direction] ?? $direction;
				}
			, $meta_value);
			
			$meta_value = implode(', ', $meta_value);
			
			if(substr($meta_value, -2) === ', '){
				$meta_value = substr($meta_value, 0, -2);
			}
			
			if(empty($meta_value)){
				$meta_value = 'Brak';
			}
		}else if(!strcmp($atts['meta_key'], 'propertyHotWater')){
			$possibleValues = Array(
				1 => 'Brak',
				2 => 'Miejskie',
				3 => 'Podgrzewacz gazowy',
				4 => 'Podgrzewacz elektryczny',
				5 => 'Bojler',
				6 => 'Kolektory słoneczne',
				7 => 'Inne',
				8 => 'Paliwo stałe',
				9 => 'Ogrzewanie geotermalne',
				10 => 'Piec na węgiel',
				11 => 'Pompa ciepła',
			);
			
			if(!is_array($meta_value)){
				if($meta_value === '' || $meta_value === null){
					$meta_value = array();
				}else{
					$meta_value = array($meta_value);
				}
			}
			
			$meta_value = array_map(
				function($direction) use ($possibleValues){
					return $possibleValues[$direction] ?? $direction;
				}
			, $meta_value);
			
			$meta_value = implode(', ', $meta_value);
			
			if(substr($meta_value, -2) === ', '){
				$meta_value = substr($meta_value, 0, -2);
			}
			
			if(empty($meta_value)){
				$meta_value = 'Brak';
			}
		}else if(!strcmp($atts['meta_key'], 'propertyBuildingCondition')){
			$possibleValues = Array(
				'perfect' => 'Idealny',
				'verygood' => 'Bardzo dobry',
				'good' => 'Dobry',
				'needssmallrenovation' => 'Wymaga drobnego remontu',
				'needstotalrenovation' => 'Wymaga generalnego remontu',
				'needsconversion' => 'Wymaga adaptacji',
				'needsfinishing' => 'Wymaga wykończenia',
				'openrawstate' => 'Surowy otwarty',
				'closerawstate' => 'Surowy zamknięty'
			);
			
			$meta_value = $possibleValues[$meta_value];
			
			if(empty($meta_value)){
				$meta_value = "Brak";
			}
		}else if(!strcmp($atts['meta_key'], 'propertyPriceCurrency')){
			switch($meta_value){
				case 'pln':
					$meta_value = 'zł';
					break;
				case 'usd':
					$meta_value = '$';
					break;
				case 'eur':
					$meta_value = '€';
					break;
				default:
					$meta_value = 'zł';
					break;
			}
		}else if(!strcmp($atts['meta_key'], 'propertyStatus')){
			$map = [
				'brak' => 'Brak',
				'closed' => 'Zamknięta',
				'pending' => 'Oczekująca',
				'active' => 'Aktywna',
			];
			
			$meta_value = $map[$meta_value] ?? 'Brak';
		}else if(!strcmp($atts['meta_key'], 'propertySpecial')){
			$meta_value = ((string)$meta_value === '1') ? 'Tak' : 'Nie';
		}
		
		return $meta_value;
	}
	
	public function WWACGetPropertyAgentMetaShortcode($atts){
		global $post;
		
		$possibleValues = array('WWAC_AgentName', 'WWAC_AgentSurname', 'WWAC_AgentFullname', 'WWAC_AgentEmail', 'WWAC_AgentFirstPhoneNumber', 'WWAC_AgentSecondPhoneNumber', 'WWAC_AgentLicenseNumber', 'WWAC_AgentImageID', 'WWAC_AgentImage');
		$atts = shortcode_atts(
			array(
				'meta_key' => '', 
				'post_id' => get_the_ID(), // Identyfikator posta (domyślnie bieżący post)
				'size' => 'large',
				'class' => '',
				'alt' => 'Agent nieruchomości',
			), $atts);
			
		if(!empty($atts['meta_key'])){
			$terms = get_the_terms($atts['post_id'], 'Agent');
				
			if($terms && !is_wp_error($terms) && !empty($terms)){
				$term = reset($terms);
				$term_id = $term -> term_id;
					
				if(in_array($atts['meta_key'], $possibleValues)){
					$postMeta = get_post_custom($atts['post_id']);
						
					if(!strcmp($atts['meta_key'], 'WWAC_AgentName')){
						$name = explode(' ', $term -> name);
						$nameSupply = explode(' ', $postMeta['propertyOfferManager'][0]);
							
						if(!empty($name[0])){
							$meta_value = $name[0];
						}else{
							$meta_value = $nameSupply[0];
						}
					}elseif(!strcmp($atts['meta_key'], 'WWAC_AgentSurname')){
						$surname = explode(' ', $term -> name);
						$surnameSupply = explode(' ', $postMeta['propertyOfferManager'][0]);
							
						if(!empty($surname[1])){
							$meta_value = $surname[1];
						}else{
							$meta_value = $surnameSupply[1];
						}
					}elseif(!strcmp($atts['meta_key'], 'WWAC_AgentFullname')){
						$meta_value = $term -> name;
					}else if(!strcmp($atts['meta_key'], 'WWAC_AgentImage')){
						if(!strcmp($atts['alt'], "Agent nieruchomości")){
							$atts['alt'] .= " ".$term -> name;
						}
						
						$atts['class'] .= " wwac-agent-image";
						$imageID = get_term_meta($term_id, 'WWAC_AgentImageID', true);
						$img = wp_get_attachment_image(intval($imageID), $atts['size'], false, ['class' => $atts['class'], 'alt' => $atts['alt'], 'loading' => 'lazy']);
						
						if(!empty($img)){
							$meta_value = $img;
						}else{
							if(is_user_logged_in() && current_user_can('administrator')){
								$meta_value = '<div style="padding: 5px; border: 1px solid #afafaf; color: #000; background: #fff;"><b>Agent Webist WP Asari CRM:</b> agent nie ma przypisanego zdjęcia (komunikat widoczny wyłącznie dla administratorów witryny).</div>';
							}else{
								$meta_value = '<img loading="lazy" src="'.WWAC_PLUGIN_DIR_URL.'assets/img/agent-placeholder.png" alt="'.$atts['alt'].'" class="'.$atts['class'].'"/>';
							}
						}
					}else{
						$meta_value = get_term_meta($term_id, $atts['meta_key'], true);
					}
				}else{
					$meta_value = 'Błąd: Nie poprawny klucz metadanych.';
				}
			}else{
				$meta_value = '';
			}
		}else{
			$meta_value = 'Błąd: Nie podano klucza metadanych.';
		}
		
		return $meta_value;
	}
	
	public function WWACGetPropertyMapShortcode($atts){
		global $post;

		if(is_singular('nieruchomosci') && $post -> post_type === 'nieruchomosci'){

			$atts = shortcode_atts(
				array(
					'post_id' => get_the_ID(),
				), 
				$atts
			);

			$post_id = $atts['post_id'];
			$loc = str_replace("ul.", "", get_post_meta($post_id, 'propertyLocalization', true));
			$mapZoom = get_option('WWAC_PropertyMapZoom');
			$lat = get_post_meta($post_id, 'propertyLat', true);
			$lng = get_post_meta($post_id, 'propertyLng', true);
			
			if(empty($lat) || empty($lng)){
				$url = "https://nominatim.openstreetmap.org/search?format=json&q=".urlencode($loc);

				$response = wp_remote_get($url, [
					'timeout' => 10,
					'user-agent' => 'Webist WP Asari CRM'
				]);

				if(!is_wp_error($response)){
					$data = json_decode(wp_remote_retrieve_body($response), true);

					if(!empty($data[0])){
						$lat = $data[0]['lat'];
						$lng = $data[0]['lon'];
						
						update_post_meta($post_id, 'propertyLat', $lat);
						update_post_meta($post_id, 'propertyLng', $lng);
					}
				}
			}
			
			if(empty($lat) || empty($lng)){
				return "<p>Nie udało się pobrać lokalizacji dla tej nieruchomości.</p>";
			}

			// Generowanie mapy
			$return = '
			<script src="https://unpkg.com/leaflet/dist/leaflet.js" id="wwac-single-map-scripts-js"></script>
			<link rel="stylesheet" id="wwac-single-map-styles-css" href="https://unpkg.com/leaflet/dist/leaflet.css" />

			<div style="height: 420px;" id="wwac-map"></div>

			<script>
				var lat = '.$lat.';
				var lng = '.$lng.';
				var address = "'.esc_js($loc).'";

				var map = L.map("wwac-map").setView([lat, lng], '.$mapZoom.');

				L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
					attribution: "&copy; OpenStreetMap contributors"
				}).addTo(map);

				L.marker([lat, lng]).addTo(map)
					.bindPopup(address)
					.openPopup();
			</script>';

			return $return;

		}else{
			return 'Ten shortcode może być używany tylko w pojedynczych postach WWAC.';
		}
	}
	
	public function WWACGetPropertyMapInsideShortcode($atts){
		global $post;
		
		if(get_option('WWAC_Map') != 2){
			return '';
		}

		// Sprawdzenie, czy jesteśmy na poście nieruchomości
		if(!is_singular('nieruchomosci') || $post -> post_type !== 'nieruchomosci'){
			return 'Ten shortcode może być używany tylko w pojedynczych postach WWAC.';
		}

		$atts = shortcode_atts(
			array(
				'post_id' => get_the_ID(),
			), 
			$atts
		);

		$post_id = $atts['post_id'];
		$loc = str_replace("ul.", "", get_post_meta($post_id, 'propertyLocalization', true));
		$mapZoom = get_option('WWAC_PropertyMapZoom');
		$lat = get_post_meta($post_id, 'propertyLat', true);
		$lng = get_post_meta($post_id, 'propertyLng', true);
		
		if(empty($lat) || empty($lng)){
			$url = "https://nominatim.openstreetmap.org/search?format=json&q=".urlencode($loc);
			$response = wp_remote_get($url, [
				'timeout' => 10,
				'user-agent' => 'Webist WP Asari CRM'
			]);

			if(!is_wp_error($response)){
				$data = json_decode(wp_remote_retrieve_body($response), true);

				if(!empty($data[0])){
					$lat = $data[0]['lat'];
					$lng = $data[0]['lon'];
					
					update_post_meta($post_id, 'propertyLat', $lat);
					update_post_meta($post_id, 'propertyLng', $lng);
				}
			}
		}
		
		if(empty($lat) || empty($lng)){
			return "<p>Nie udało się pobrać lokalizacji dla tej nieruchomości.</p>";
		}
		
		$return = '
		<script src="https://unpkg.com/leaflet/dist/leaflet.js" id="wwac-single-map-scripts-js"></script>
		<link rel="stylesheet" id="wwac-single-map-styles-css" href="https://unpkg.com/leaflet/dist/leaflet.css" />

		<div style="height: 420px;" id="wwac-map"></div>

		<script>
			var lat = '.$lat.';
			var lng = '.$lng.';
			var address = "'.esc_js($loc).'";

			var map = L.map("wwac-map").setView([lat, lng], '.$mapZoom.');

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "&copy; OpenStreetMap contributors"
			}).addTo(map);

			L.marker([lat, lng]).addTo(map)
				.bindPopup(address)
				.openPopup();
		</script>';

		return $return;
	}
	
	public function WWACGalleryShortcode($atts){
		global $post;
		
		$atts = shortcode_atts(
			array(
				'post_id' => get_the_ID(), // post ID (default is current)
				'type' => 'all', // default is "just show gallery"
			),
		$atts);
		
		$postImagesJSON = get_post_meta($atts['post_id'], 'propertyImages', true);
		$postGalleryType = get_option('WWAC_GalleryType');
		$postImages = $postImagesJSON;
		$allImagesCount = (!empty($postImages)) ? count($postImages) : null;
		$imageAltTag = get_the_title($atts['post_id']);
		
		if(empty($postImages)){
			if(is_user_logged_in() && current_user_can('administrator')){
				return '<div style="padding: 5px; border: 1px solid #afafaf; color: #000; background: #fff;"><b>Galeria Webist WP Asari CRM:</b> w tej nieruchomości nie ma zdjęć, przez co galeria się nie wyświetla (komunikat widoczny wyłącznie dla administratorów witryny).</div>';
			}
			
			return null;
		}
		
		switch($postGalleryType){
			case 1:
				$postGalleryType = 'top';
				break;
			case 2:
				$postGalleryType = 'bottom';
				break;
			case 3:
				$postGalleryType = false;
				break;
			default:
				$postGalleryType = 'all';
				break;
		}
		
		if(strcmp($atts['type'], 'all')){
			if(!$postGalleryType){
				return null;
			}
			
			if(strcmp($atts['type'], $postGalleryType)){ // if not equal strings
				return null;
			}
		}
		
		if(preg_match('/^(http:\/\/|https:\/\/)/', $postImages[0])){
			$galleryDownloadType = 1;
		}else if(is_numeric($postImages[0])){
			$galleryDownloadType = 2;
		}
		
		$returnHTML = '
		<div class="webist-asari-slides-container">
		';
		
		if($galleryDownloadType == 1){
			for($jumps = 0; $jumps < $allImagesCount; $jumps++){
				$returnHTML .= '
				<div class="webist-asari-slide">
					<div class="webist-asari-slide-number" style="display: none;">'.$jumps.'</div>
					<a href="'.$postImages[$jumps].'" target="_blank" rel="nofollow noopener"><img src="'.$postImages[$jumps].'" class="webist-asari-slide-img" alt="'.ucwords(mb_strtolower($imageAltTag)).'"/></a>
				</div>';
			}
		}else if($galleryDownloadType == 2){
			for($jumps = 0; $jumps < $allImagesCount; $jumps++){
				$returnHTML .= '
				<div class="webist-asari-slide">
					<div class="webist-asari-slide-number" style="display: none;">'.$jumps.'</div>
					<a href="'.wp_get_attachment_url($postImages[$jumps]).'" target="_blank" rel="nofollow noopener"><img src="'.wp_get_attachment_url($postImages[$jumps]).'" class="webist-asari-slide-img" alt="'.ucwords(mb_strtolower($imageAltTag)).'"/></a>
				</div>';
			}
		}
		
		$returnHTML .= '
		<a id="webist-asari-slides-previous" class="webist-asari-slides-previous">
				<i class="fa fa-chevron-circle-left webist-asari-fa"></i>
			</a>
			<a id="webist-asari-slides-next" class="webist-asari-slides-next">
				<i class="fa fa-chevron-circle-right webist-asari-fa"></i>
			</a>
		</div>
		<br>
		<div class="webist-asari-dots-container">';
		
		for($j = 0; $j < $allImagesCount; $j++){
			$returnHTML .= '<span class="webist-asari-dot"></span>';
		}
		
		$returnHTML .= '</div>';
		
		return $returnHTML;
	}
	
	public function WWACGetPropertyTaxShortcode($atts){
		global $post;
		
		$availableOptions = Array('localization', 'type', 'category', 'province', 'district');
		$atts = shortcode_atts(
			array(
				'post_id' => get_the_ID(),
				'key' => '',
				'link' => false,
				'title' => false,
				'post_id' => get_the_ID(),
			), $atts);
			
		if(empty($atts['key'])){
			$meta_value = 'Błąd: Nie podano klucza taksonomii.';
		}
			
		if(!strcmp($atts['key'], 'localization')){
			$taxonomy = 'Lokalizacja';
		}else if(!strcmp($atts['key'], 'type')){
			$taxonomy = 'Typ';
		}else if(!strcmp($atts['key'], 'category')){
			$taxonomy = 'Kategorie';
		}else if(!strcmp($atts['key'], 'province')){
			$taxonomy = 'Wojewodztwo';
		}else if(!strcmp($atts['key'], 'district')){
			$taxonomy = 'Dzielnica';
		}
			
		$terms = wp_get_post_terms($atts['post_id'], $taxonomy);
				
		if(!is_wp_error($terms) && !empty($terms)){
			$meta_value = $terms[0] -> name;
		}else{
			$meta_value = 'Brak';
		}
			
		if(!$atts['title']){
			$link_title = 'Wszystkie nieruchomości: '.$meta_value;
		}else{
			$link_title = $atts['title'];
		}
			
		if($atts['link'] == true){
			$tax_link = get_term_link($terms[0]);
			
			if(!is_wp_error($tax_link)){ 
				$meta_value = '<a href="'.$tax_link.'" title="'.esc_attr($link_title).'">'.$meta_value.'</a>';
			}
		}
		
		return $meta_value;
	}
	
	public function WWACPropertySearchShortcode($atts){
		$atts = shortcode_atts(
			array(
				'id' => false,
			), $atts);
		
		if(!$atts['id']){
			if(is_user_logged_in() && current_user_can('administrator')){
				return '<div style="padding: 5px; border: 1px solid #afafaf; color: #000; background: #fff;"><b>Musisz podać ID wyszukiwarki Webist WP Asari CRM</b> (komunikat widoczny wyłącznie dla administratorów witryny).</div>';
			}
			
			return null;
		}
		$formRedirect = get_post_meta($atts['id'], 'WWAC_FormRedirect', true);
		$searchData = unserialize(get_post_meta($atts['id'], 'WWAC_SearchInfo', true));
		$searchDataCounted = (is_array($searchData)) ? count($searchData['panel']) : 0;
		$metaTitles = array('price' => 'Cena', 'area' => 'Metraż');
		$taxTitles = array('category' => 'Kategorie', 'type' => 'Typ', 'localization' => 'Lokalizacja', 'district' => 'Dzielnica', 'agent' => 'Agent');
		
		if(!strcmp($formRedirect, 'none')){
			$formURL = '';
		}else{
			$formURL = site_url()."/".$formRedirect."/";
		}
		
		$metaHTML = '';
		$taxHTML = '';
		$returnHTML = '
		<div id="wwac-search-'.$atts['id'].'" class="wwac-search-container" data-form-id="'.$atts['id'].'">
			<form action="'.$formURL.'" method="GET">';
		
		for($i = 0; $i < $searchDataCounted; $i++){
			if(!strcmp($searchData['panel'][$i]['type'], "meta")){
				switch($searchData['panel'][$i]['key']){
					case 'price':
						$key = 'propertyPriceRaw';
						$name = 'cena';
						$unit = 'zł';
						break;
					case 'area':
						$key = 'propertyAreaRaw';
						$name = 'powierzchnia';
						$unit = 'm<sup>2</sup>';
						break;
					default:
						break;
				}
				
				if($searchData['panel'][$i]['min_val'] == 1){
					$min = 0;
				}else if($searchData['panel'][$i]['min_val'] == 2){
					remove_action('pre_get_posts', array($this, 'WWAC_SearchParamsQueryModifier'));
					
					$minQuery = new WP_Query(array(
						'post_type'      => 'nieruchomosci',
						'posts_per_page' => 1,
						'meta_key'       => $key,
						'orderby'        => 'meta_value_num',
						'order'          => 'ASC',
						'meta_query'     => array(
							array(
								'key'     => $key,
								'value'   => '',
								'compare' => '!=',
							),
						),
						'suppress_filters' => true,
					));
					
					add_action('pre_get_posts', array($this, 'WWAC_SearchParamsQueryModifier'));
					
					if($minQuery -> have_posts()){
						while($minQuery -> have_posts()){
							$minQuery -> the_post();
							$min = floatval(get_post_meta(get_the_ID(), $key, true));
						}
					}else{
						$min = 0;
					}
					
					wp_reset_postdata();
				}
				
				remove_action('pre_get_posts', array($this, 'WWAC_SearchParamsQueryModifier'));
				
				$maxQuery = new WP_Query(array(
					'post_type'      => 'nieruchomosci',
					'posts_per_page' => 1,
					'meta_key'       => $key,
					'orderby'        => 'meta_value_num',
					'order'          => 'DESC',
					'meta_query'     => array(
						array(
							'key'     => $key,
							'value'   => '',
							'compare' => '!=',
						),
					),
					'suppress_filters' => true,
				));
				
				add_action('pre_get_posts', array($this, 'WWAC_SearchParamsQueryModifier'));

				if($maxQuery->have_posts()){
					while ($maxQuery->have_posts()) {
						$maxQuery->the_post();
						$max = get_post_meta(get_the_ID(), $key, true);
					}
					
					wp_reset_postdata();
				}else{
					$max = 0;
				}
				
				$minVal = isset($_GET[$name.'_min']) ? $_GET[$name.'_min'] : $min;
				$maxVal = isset($_GET[$name.'_max']) ? $_GET[$name.'_max'] : $max;
				
				$rangeIDMin = "wwac-search-{$key}-min-{$atts['id']}";
				$rangeIDMax = "wwac-search-{$key}-max-{$atts['id']}";
				
				$metaHTML .= '
				<div class="wwac-search-meta-item wwac-search-meta-'.$searchData['panel'][$i]['key'].'">
					<label>'.esc_html($metaTitles[$searchData['panel'][$i]['key']]).':</label><br>

					Min: <input type="range" 
						name="'.$name.'_min" 
						id="'.esc_attr($rangeIDMin).'" 
						min="'.esc_attr($min).'" 
						max="'.esc_attr($max).'" 
						step="1" 
						value="'.esc_attr($minVal).'"
						data-unit="'.esc_attr($unit).'"
						data-format="space"> 
					<span id="'.esc_attr($rangeIDMin).'-value">'.esc_html($minVal).'</span><br>

					Max: <input type="range" 
						name="'.$name.'_max" 
						id="'.esc_attr($rangeIDMax).'" 
						min="'.esc_attr($min).'" 
						max="'.esc_attr($max). '" 
						step="1" 
						value="'.esc_attr($maxVal).'"
						data-unit="'.esc_attr($unit).'"
						data-format="space"> 
					<span id="'.esc_attr($rangeIDMax).'-value">'.esc_html($maxVal).'</span>
				</div>
				';
			}else if(!strcmp($searchData['panel'][$i]['type'], "taxonomy")){
				$taxKey  = $searchData['panel'][$i]['key'];
				$taxName = strtolower($taxTitles[$taxKey]);
				
				$item  = '<div class="wwac-search-tax-item wwac-search-tax-'.esc_attr($taxKey).'">';
				$item .= '<label for="'.esc_attr($taxName).'">'.esc_html($taxTitles[$taxKey]).':</label>';
				$item .= '<select id="'.esc_attr($taxName).'" name="'.esc_attr($taxName).'">';

				$hide_empty = ($searchData['panel'][$i]['empty_elements'] == 2) ? false : true;
				$terms = get_terms([
					'taxonomy'   => $taxTitles[$taxKey],
					'hide_empty' => $hide_empty,
				]);
				
				if(!empty($searchData['panel'][$i]['placeholder'])){
					$item .= '<option value="">'.$searchData['panel'][$i]['placeholder'].'</option>';
				}else{
					$item .= '<option value="">- Wybierz '.esc_html($taxTitles[$taxKey]).' -</option>';
				}

				foreach($terms as $term){
					$filters = $_GET;
					$filters[$taxName] = $term->slug;
					
					$args = [
						'post_type'      => 'nieruchomosci',
						'posts_per_page' => -1,
						'fields'         => 'ids',
					];
					
					foreach($filters as $key => $value){
						if($value !== ''){
							$args[$key] = $value;
						}
					}

					$query = new WP_Query($args);
					$post_count = count($query->posts);
					wp_reset_postdata();

					$selected = (isset($_GET[$taxName]) && $_GET[$taxName] === $term->slug) ? 'selected' : '';
					//$returnHTML .= '<option value="'.esc_attr($term->slug).'" '.$selected.'>';
					//$returnHTML .= esc_html($term->name).' ('.$post_count.')</option>';
					$item .= '<option value="'.esc_attr($term->slug).'" '.$selected.'>';
					$item .= esc_html($term->name).' ('.$post_count.')</option>';
				}

				//$returnHTML .= '</select>';
				$item .= '</select></div>';
				$taxHTML .= $item;
			}
		}
		
		$returnHTML .= '
				<div class="wwac-search-tax-group">'.$taxHTML.'</div>
				<div class="wwac-search-meta-group">'.$metaHTML.'</div>
		
				<input type="submit" value="Szukaj" class="wwac-search-submit-btn"/>
			</form>
		
			<div class="wwac-loader" style="display: none;">
				<div class="spinner"></div>
			</div>
		</div>

		<script>
		var ajaxurl = "'.admin_url('admin-ajax.php').'";
		const container = document.getElementById("wwac-search-'.$atts['id'].'");
		</script>';
		
		return $returnHTML;
	}
		
	public function WWACRegisterDashboardWidgets(){
		wp_add_dashboard_widget('dashboard_widget', 'Webist WP Asari CRM', array($this, 'WWACDashboardWidgetSummary'));
	}
		
	public function WWACDashboardWidgetSummary($post, $callback_args){
		$postsInfo = self::WWACGetCustomPostTypeInfo();
		?>
		<table style="width: 100%; text-align: justify;">
			<tr>
				<th scope="row">
					<label for="footerStatus">Wszystkich postów</label>
				</th>
				<td>
					<?php echo $postsInfo -> all; ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="footerStatus">Opublikowanych postów</label>
				</th>
				<td>
					<?php echo $postsInfo -> publish; ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="footerStatus">Zaplanowanych postów</label>
				</th>
				<td>
					<?php echo $postsInfo -> future; ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="footerStatus">Szkice postów</label>
				</th>
				<td>
					<?php echo $postsInfo -> draft; ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="footerStatus">Prywatnych postów</label>
				</th>
				<td>
					<?php echo $postsInfo -> private; ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="footerStatus">Postów w koszu</label>
				</th>
				<td>
					<?php echo $postsInfo -> trash; ?>
				</td>
			</tr>
		</table>
		<center><a href="edit.php?post_type=nieruchomosci">Przejdź do nieruchomości</a></center>
		<?php
	}
	
	public function WWACPluginRowMeta($links, $file){
		if(WWAC_PLUGIN_DIR_NAME.'/'.WWAC_PLUGIN_MAIN_FILE === $file){
			$links[] = '<a href="https://license.webist.pl" target="_blank">Panel licencji</a>';
		}

		return $links;
	}
		
	/*public function WWACTinyMCEOnClick($settings) {
		$settings['extended_valid_elements'] =  "a[rel|rev|charset|hreflang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur|onclick]";
		return $settings;
	}*/
	
		
	public function WWACResetOptions(){
		$optionsNames = Array(
			'WWAC_LicenseKey' => '',
			'WWAC_ValidLicense' => 0,
			'WWAC_RequirementsCode' => 0,
			'WWAC_AsariAPIType' => 'apiasaripro', 
			'WWAC_AsariConnectionStatus' => 0,
			'WWAC_AsariUserID' => '',
			'WWAC_AsariSiteToken' => '',
			'WWAC_TitleType' => 1,
			'WWAC_TitleIDType' => 1,
			'WWAC_GalleryType' => 1,
			'WWAC_PriceType' => 1,
			'WWAC_FooterStatus' => 1,
			'WWAC_Footer_Name' => '',
			'WWAC_Footer_Address' => '',
			'WWAC_Footer_PhoneNumber' => '',
			'WWAC_Footer_Email' => '',
			//0.3
			//0.4
			'WWAC_downloadImages' => 1,
			//0.6
			'WWAC_LastUpdatedNumber' => 0,
			'WWAC_LastUpdatedJump' => 1,
			'WWAC_agentInfo' => 1,
			'WWAC_updateListingsType' => 1,
			//0.7
			'WWAC_Map' => 1,
			'WWAC_PropertyMapZoom' => 18,
			//0.8
			//'WWAC_GalleryDownloadType' => 1,
			'WWAC_downloadImages' => 1,
			'WWAC_PriceTypeSQM' => 1,
			//0.9
			'WWAC_Archives_SingleOffer_Template' => 'basic',
			'WWAC_Archives_SingleOffer_TemplateType' => 'internal',
			'WWAC_Archives_SingleOffer_TemplateStatus' => 1,
			'WWAC_Archives_SingleOffer_TemplateHero' => 1,
			'WWAC_Archives_SingleOffer_AgentPanel' => 1,
			'WWAC_Archives_SingleOffer_AgentPhoto' => 1,
			'WWAC_Archives_SingleOffer_AgentLicenseNr' => 1,
			'WWAC_Archives_SingleOffer_AgentNames' => 1,
			'WWAC_Archives_SingleOffer_AgentPhoneNumbers' => 1,
			'WWAC_Archives_SingleOffer_AgentEmailAddress' => 1,
			'WWAC_Archives_SingleOffer_propertyPrice' => 1,
			'WWAC_Archives_SingleOffer_Localization' => 1,
			'WWAC_Archives_SingleOffer_Category' => 1,
			'WWAC_Archives_SingleOffer_Type' => 1,
			'WWAC_Archives_SingleOffer_propertyArea' => 1,
			'WWAC_Archives_SingleOffer_propertyYearBuilt' => 1,
			'WWAC_Archives_SingleOffer_propertyFloor' => 1,
			'WWAC_Archives_SingleOffer_propertyFloors' => 1,
			'WWAC_Archives_SingleOffer_propertyGarage' => 1,
			'WWAC_Archives_SingleOffer_propertyParkingSpacesNo' => 1,
			'WWAC_Archives_SingleOffer_propertyRooms' => 1,
			'WWAC_Archives_SingleOffer_propertyElevator' => 1,
			'WWAC_Archives_SingleOffer_mortgageMarket' => 1,
			'WWAC_Archives_AllOffers_Template' => 'basic',
			'WWAC_Archives_AllOffers_TemplateType' => 'internal',
			'WWAC_Archives_AllOffers_TemplateStatus' => 0,
			'WWAC_Archives_AllOffers_TemplateHero' => 1,
			'WWAC_Archives_AllOffers_propertyPrice' => 1,
			'WWAC_Archives_AllOffers_Localization' => 1,
			'WWAC_Archives_AllOffers_Category' => 0,
			'WWAC_Archives_AllOffers_Type' => 0,
			'WWAC_Archives_AllOffers_propertyArea' => 1,
			'WWAC_Archives_AllOffers_propertyYearBuilt' => 0,
			'WWAC_Archives_AllOffers_propertyFloor' => 0,
			'WWAC_Archives_AllOffers_propertyFloors' => 0,
			'WWAC_Archives_AllOffers_propertyGarage' => 0,
			'WWAC_Archives_AllOffers_propertyParkingSpacesNo' => 0,
			'WWAC_Archives_AllOffers_propertyRooms' => 0,
			'WWAC_Archives_AllOffers_propertyElevator' => 0,
			'WWAC_Archives_AllOffers_mortgageMarket' => 1,
			'WWAC_Archives_AllOffers_excerpt' => 1,
		);
			
		foreach($optionsNames as $key => $value){
			if(!option_exists($key)){
				add_option($key, $value);
			}else{
				update_option($key, $value);
			}
		}
	}
	
	/* AJAX BEGIN */
	public function WWACAjax_getUpdaterValues(){
		$WWAC_LastUpdatedNumber = get_option('WWAC_LastUpdatedNumber');
		$WWAC_LastUpdatedJump = get_option('WWAC_LastUpdatedJump');

		if($WWAC_LastUpdatedNumber > 0 && $WWAC_LastUpdatedJump > 1){
			$status = "Włączony! Trwa aktualizacja nieruchomości...";
		}else{
			$status = "Wyłączony";
		}
		
		$values = array(
			'WWAC_LastUpdatedNumber' => $WWAC_LastUpdatedNumber,
			'WWAC_LastUpdatedJump' => $WWAC_LastUpdatedJump,
			'WWAC_UpdaterStatus' => $status,
		);

		echo json_encode($values);
		wp_die();
	}
	
	public function WWACAjax_refreshSearchFormOptions(){
		if(!isset($_POST['form'])){
			wp_send_json_error();
		}

		$form = json_decode(stripslashes($_POST['form']), true);
		
		if(!is_array($form)){
			wp_send_json_error();
		}

		$form_id = $_POST['form_id'] ?? null;
		if(!is_numeric($form_id)){
			wp_send_json_error();
		}

		// Mapa: klucz z meta => prawdziwa nazwa taksonomii w WP
		$taxonomyKeyMap = [
			'category' => 'Kategorie',
			'type' => 'Typ',
			'localization' => 'Lokalizacja',
			'district' => 'Dzielnica',
			'agent' => 'Agent',
		];

		$searchInfo = unserialize(get_post_meta($form_id, 'WWAC_SearchInfo', true));
		$options_html = [];

		foreach($taxonomyKeyMap as $formKey => $taxonomyName){
			$hideEmpty = false;
			$panelConfig = null;
			
			if(!empty($searchInfo['panel']) && is_array($searchInfo['panel'])){
				foreach($searchInfo['panel'] as $field){
					if($field['type'] === 'taxonomy' && $field['key'] === $formKey){
						$panelConfig = $field;
						break;
					}
				}
			}
			
			if(!empty($panelConfig['empty_elements']) && (int)$panelConfig['empty_elements'] === 1){
				$hideEmpty = true;
			}
			
			$taxonomyQueryLogic = 'IN';
			
			if(!empty($panelConfig['query_logic'])){
				switch((int)$panelConfig['query_logic']){
					case 2:
						$taxonomyQueryLogic = 'OR';
						break;
					case 3:
						$taxonomyQueryLogic = 'AND';
						break;
					default:
						$taxonomyQueryLogic = 'IN';
				}
			}

			$terms = get_terms([
				'taxonomy'   => $taxonomyName,
				'hide_empty' => $hideEmpty,
			]);

			$html = '<option value="">- Wybierz ' . $taxonomyName . ' -</option>';

			foreach($terms as $term){
				$args = [
					'post_type'      => 'nieruchomosci',
					'posts_per_page' => -1,
					'fields'         => 'ids',
					'meta_query'     => [],
				];
				
				foreach($form as $key => $value){
					if($value !== ''){
						if($formKey === 'agent' || $key !== $formKey){
							$args[$key] = $value;
						}
					}
				}
				
				if(isset($form['cena_min']) && is_numeric($form['cena_min'])){
					$args['meta_query'][] = [
						'key'     => 'propertyPriceRaw',
						'value'   => floatval($form['cena_min']),
						'type'    => 'NUMERIC',
						'compare' => '>=',
					];
				}
				
				if(isset($form['cena_max']) && is_numeric($form['cena_max'])){
					$args['meta_query'][] = [
						'key'     => 'propertyPriceRaw',
						'value'   => floatval($form['cena_max']),
						'type'    => 'NUMERIC',
						'compare' => '<=',
					];
				}
				
				if(isset($form['powierzchnia_min']) && is_numeric($form['powierzchnia_min'])){
					$args['meta_query'][] = [
						'key'     => 'propertyAreaRaw',
						'value'   => floatval($form['powierzchnia_min']),
						'type'    => 'NUMERIC',
						'compare' => '>=',
					];
				}
				
				if(isset($form['powierzchnia_max']) && is_numeric($form['powierzchnia_max'])){
					$args['meta_query'][] = [
						'key'     => 'propertyAreaRaw',
						'value'   => floatval($form['powierzchnia_max']),
						'type'    => 'NUMERIC',
						'compare' => '<=',
					];
				}
				
				$args['tax_query'][] = [
					'taxonomy' => $taxonomyName,
					'field'    => 'slug',
					'terms'    => $term->slug,
				];

				$query = new WP_Query($args);
				$post_count = count($query->posts);
				wp_reset_postdata();
				
				$selected = (isset($form[$formKey]) && $form[$formKey] === $term->slug) ? 'selected' : '';
				//$html .= '<option value="'.esc_attr($term->slug).'" '.$selected.'>'.esc_html($term->name).' ('.$post_count.')</option>';
				if(!$hideEmpty || $post_count > 0){
					$html .= '<option value="'.esc_attr($term->slug).'" '.$selected.'>'.esc_html($term->name).' ('.$post_count.')</option>';
				}
			}
			$options_html[strtolower($taxonomyName)] = $html;
		}
		wp_send_json_success(['options_html' => $options_html]);
	}
	/* AJAX END */
		
	public function WWACTestConnection(){
		if(isCurlExist()){
			$ch = curl_init();

			curl_setopt($ch, CURLOPT_URL, 'https://api.asari.pro/site/exportedListingIdList');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_POST, 1);

			$headers = array();
			$headers[] = 'Siteauth:'.WWAC_ASARI_USERID.':'.WWAC_ASARI_SITETOKEN;
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			curl_setopt($ch, CURLOPT_POSTFIELDS, []);

			$result = curl_exec($ch);
			$jsonResult = json_decode($result, true);
			
			if(curl_errno($ch)){
				curl_close($ch);
				return false;
			}
			
			if(is_array($jsonResult)){
				if(!$jsonResult['success']){
					curl_close($ch);
					return false;
				}else if($jsonResult['success']){
					curl_close($ch);
					return true;
				}
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
		
	public function WWACGetCustomPostTypeInfo($type = 'all'){
		if(!empty($type)){
			$countPosts = wp_count_posts('nieruchomosci');
			$return = new stdClass();
				
			$return -> all = $countPosts -> publish + $countPosts -> future + $countPosts -> draft + $countPosts -> private + $countPosts -> trash;
			$return -> publish = $countPosts -> publish;
			$return -> future = $countPosts -> future;
			$return -> draft = $countPosts -> draft;
			$return -> private = $countPosts -> private;
			$return -> trash = $countPosts -> trash;
				
			return $return;
		}
	}
	
	public function WWACRandomConnectionChecker(){
		$rand = random_int(1, 36);
		
		if($rand == 9){
			if(get_option('WWAC_ValidLicense')){
				if(FlovWPAsariCRM::WWACTestConnection()){
					update_option('WWAC_AsariConnectionStatus', 2);
				}else{
					update_option('WWAC_AsariConnectionStatus', 1);
				}
			}
		}
	}
}