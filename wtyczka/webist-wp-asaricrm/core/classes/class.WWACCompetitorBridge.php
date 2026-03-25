<?php
/**
 * Most konkurencyjnych kont (digital / model / app) — zgodnie z architekturą WWAC:
 * opcje w bazie, AJAX admin-only, opcjonalny HTTP bridge do zewnętrznego worker’a (Node/Python).
 */
if(!defined('ABSPATH')){
	exit;
}

class WWACCompetitorBridge{

	public static function init(){
		add_action('wp_ajax_wwac_competitor_search', array(__CLASS__, 'ajax_search'));
		add_action('rest_api_init', array(__CLASS__, 'register_rest'));
		add_action('admin_enqueue_scripts', array(__CLASS__, 'enqueue_admin'));
	}

	public static function enqueue_admin($hook){
		if($hook !== 'webist-wp-asaricrm_page_webist-wp-asaricrm-competitors'){
			return;
		}
		wp_enqueue_script(
			'wwac-admin-competitor',
			WWAC_PLUGIN_DIR_URL.'assets/js/admin-competitor-bridge.js',
			array('jquery'),
			WWAC_PLUGIN_VERSION,
			true
		);
		wp_localize_script('wwac-admin-competitor', 'wwacCompetitor', array(
			'ajaxurl' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('wwac_competitor_nonce'),
		));
	}

	/**
	 * Odczyt konfiguracji dla frontu headless (Next.js) — tylko odczyt, bez sekretów.
	 */
	public static function register_rest(){
		register_rest_route('wwac/v1', '/competitor-config', array(
			'methods' => 'GET',
			'callback' => array(__CLASS__, 'rest_competitor_config'),
			'permission_callback' => '__return_true',
		));
	}

	public static function rest_competitor_config($req){
		$bridge = (string) get_option('WWAC_CompetitorBridgeURL', '');
		return new \WP_REST_Response(array(
			'bridge_configured' => $bridge !== '',
			'platforms' => self::platform_definitions(),
		), 200);
	}

	/**
	 * Definicje platform (klucz = worker Python / bridge).
	 */
	public static function platform_definitions(){
		return array(
			'digital_human' => array(
				'label' => 'Digital Human',
				'items' => array(
					array('key' => 'janitorai', 'label' => 'JanitorAI', 'site' => 'https://janitorai.com/'),
					array('key' => 'character_ai', 'label' => 'Character.ai', 'site' => 'https://character.ai/'),
					array('key' => 'saucepan', 'label' => 'Saucepan', 'site' => 'https://saucepan.ai/'),
					array('key' => 'happy_chat', 'label' => 'Happy Chat', 'site' => 'https://happy.chat/'),
					array('key' => 'crushon', 'label' => 'Crushon', 'site' => 'https://crushon.ai/'),
				),
			),
			'model' => array(
				'label' => 'Model',
				'items' => array(
					array('key' => 'civitai', 'label' => 'Civitai', 'site' => 'https://civitai.com/'),
					array('key' => 'tensor_art_zh', 'label' => 'Tensor (zh)', 'site' => 'https://tensor.art/zh'),
					array('key' => 'liblib', 'label' => 'Liblib', 'site' => 'https://www.liblib.art/image-model'),
				),
			),
			'application' => array(
				'label' => 'Application',
				'items' => array(
					array('key' => 'tensor_art_app', 'label' => 'Tensor', 'site' => 'https://tensor.art/'),
					array('key' => 'shakker', 'label' => 'Shakker', 'site' => 'https://www.shakker.ai/'),
					array('key' => 'runninghub', 'label' => 'RunningHub', 'site' => 'https://www.runninghub.ai/'),
				),
			),
		);
	}

	public static function ajax_search(){
		if(!check_ajax_referer('wwac_competitor_nonce', 'nonce', false)){
			wp_send_json_error(array('message' => 'Nieprawidłowy token bezpieczeństwa.'), 403);
		}
		if(!current_user_can('manage_options')){
			wp_send_json_error(array('message' => 'Brak uprawnień.'), 403);
		}

		$platform = isset($_POST['platform']) ? sanitize_key(wp_unslash($_POST['platform'])) : '';
		$keyword = isset($_POST['keyword']) ? sanitize_text_field(wp_unslash($_POST['keyword'])) : '';
		$category = isset($_POST['category']) ? sanitize_key(wp_unslash($_POST['category'])) : '';

		if($platform === '' || $keyword === ''){
			wp_send_json_error(array('message' => 'Podaj platformę i słowo kluczowe (np. nazwę użytkownika).'), 400);
		}

		$bridge = trim((string) get_option('WWAC_CompetitorBridgeURL', ''));
		if($bridge !== ''){
			$out = self::request_bridge($bridge, $platform, $keyword, $category);
			if(is_wp_error($out)){
				wp_send_json_error(array('message' => $out->get_error_message()), 500);
			}
			self::cache_result($platform, $keyword, $out);
			wp_send_json_success($out);
		}

		/* Fallback bez bridge: tylko Civitai — publiczne API */
		if($platform === 'civitai'){
			$out = self::fetch_civitai_username($keyword);
			if(is_wp_error($out)){
				wp_send_json_error(array('message' => $out->get_error_message()), 500);
			}
			self::cache_result($platform, $keyword, $out);
			wp_send_json_success($out);
		}

		wp_send_json_error(array(
			'message' => 'Skonfiguruj URL mostu (Node/Python) w ustawieniach poniżej lub użyj platformy Civitai bez bridge.',
		), 400);
	}

	private static function request_bridge($base, $platform, $keyword, $category){
		$url = trailingslashit($base).'search';
		$body = wp_json_encode(array(
			'platform' => $platform,
			'keyword' => $keyword,
			'category' => $category,
		));
		$r = wp_remote_post($url, array(
			'timeout' => 120,
			'headers' => array('Content-Type' => 'application/json'),
			'body' => $body,
		));
		if(is_wp_error($r)){
			return $r;
		}
		$code = wp_remote_retrieve_response_code($r);
		$raw = wp_remote_retrieve_body($r);
		$data = json_decode($raw, true);
		if($code < 200 || $code >= 300){
			$msg = is_array($data) && isset($data['message']) ? $data['message'] : 'HTTP '.$code;
			return new \WP_Error('bridge_http', $msg);
		}
		if(!is_array($data)){
			return new \WP_Error('bridge_json', 'Niepoprawna odpowiedź JSON z mostu.');
		}
		return $data;
	}

	private static function fetch_civitai_username($username){
		$url = add_query_arg(array('username' => $username), 'https://civitai.com/api/v1/creators');
		$r = wp_remote_get($url, array('timeout' => 20));
		if(is_wp_error($r)){
			return $r;
		}
		$code = wp_remote_retrieve_response_code($r);
		$raw = wp_remote_retrieve_body($r);
		if($code < 200 || $code >= 300){
			return new \WP_Error('civitai_http', 'Civitai API: HTTP '.$code);
		}
		$data = json_decode($raw, true);
		if(!is_array($data) || empty($data['items'][0])){
			return new \WP_Error('civitai_empty', 'Brak wyniku dla: '.$username);
		}
		$item = $data['items'][0];
		return array(
			'platform' => 'civitai',
			'username' => $item['username'] ?? $username,
			'profile_url' => isset($item['link']) ? $item['link'] : 'https://civitai.com/user/'.$username,
			'raw' => $item,
		);
	}

	private static function cache_result($platform, $keyword, $payload){
		$key = 'wwac_comp_'.md5($platform.'|'.$keyword);
		$all = get_option('WWAC_CompetitorAccountsCache', array());
		if(!is_array($all)){
			$all = array();
		}
		$all[$key] = array(
			'time' => time(),
			'platform' => $platform,
			'keyword' => $keyword,
			'data' => $payload,
		);
		update_option('WWAC_CompetitorAccountsCache', $all, false);
	}
}
