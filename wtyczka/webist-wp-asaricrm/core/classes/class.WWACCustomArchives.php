<?php
class WWACCustomArchives{
	protected $WPUploadDirCustomTemplates;
	
	/* SINGLE */
	public $WWAC_Archives_SingleOffer_TemplateHero;
	public $WWAC_Archives_SingleOffer_AgentPanel;
	public $WWAC_Archives_SingleOffer_AgentPhoto;
	public $WWAC_Archives_SingleOffer_AgentLicenseNr;
	public $WWAC_Archives_SingleOffer_AgentNames;
	public $WWAC_Archives_SingleOffer_AgentPhoneNumbers;
	public $WWAC_Archives_SingleOffer_AgentEmailAddress;
	public $WWAC_Archives_SingleOffer_propertyPrice;
	public $WWAC_Archives_SingleOffer_Localization;
	public $WWAC_Archives_SingleOffer_Category;
	public $WWAC_Archives_SingleOffer_Type;
	public $WWAC_Archives_SingleOffer_propertyArea;
	public $WWAC_Archives_SingleOffer_propertyYearBuilt;
	public $WWAC_Archives_SingleOffer_propertyFloor;
	public $WWAC_Archives_SingleOffer_propertyFloors;
	public $WWAC_Archives_SingleOffer_propertyGarage;
	public $WWAC_Archives_SingleOffer_propertyParkingSpacesNo;
	public $WWAC_Archives_SingleOffer_mortgageMarket;
	public $WWAC_Archives_SingleOffer_propertyRooms;
	public $WWAC_Archives_SingleOffer_propertyElevator;
	
	/* ALL ARCHIVE */
	public $WWAC_Archives_AllOffers_TemplateHero;
	public $WWAC_Archives_AllOffers_propertyPrice;
	public $WWAC_Archives_AllOffers_Localization;
	public $WWAC_Archives_AllOffers_Category;
	public $WWAC_Archives_AllOffers_Type;
	public $WWAC_Archives_AllOffers_propertyArea;
	public $WWAC_Archives_AllOffers_propertyYearBuilt;
	public $WWAC_Archives_AllOffers_propertyFloor;
	public $WWAC_Archives_AllOffers_propertyFloors;
	public $WWAC_Archives_AllOffers_propertyGarage;
	public $WWAC_Archives_AllOffers_propertyParkingSpacesNo;
	public $WWAC_Archives_AllOffers_propertyRooms;
	public $WWAC_Archives_AllOffers_propertyElevator;
	public $WWAC_Archives_AllOffers_mortgageMarket;
	public $WWAC_Archives_AllOffers_excerpt;
	
	/* AGENT */
	public $WWAC_Archives_Agent_TemplateHero;
	public $WWAC_Archives_Agent_AgentPanel;
	public $WWAC_Archives_Agent_AgentPhoto;
	public $WWAC_Archives_Agent_AgentLicenseNr;
	public $WWAC_Archives_Agent_AgentNames;
	public $WWAC_Archives_Agent_AgentPhoneNumbers;
	public $WWAC_Archives_Agent_AgentEmailAddress;
	public $WWAC_Archives_Agent_propertyPrice;
	public $WWAC_Archives_Agent_Localization;
	public $WWAC_Archives_Agent_Category;
	public $WWAC_Archives_Agent_Type;
	public $WWAC_Archives_Agent_propertyArea;
	public $WWAC_Archives_Agent_propertyYearBuilt;
	public $WWAC_Archives_Agent_propertyFloor;
	public $WWAC_Archives_Agent_propertyFloors;
	public $WWAC_Archives_Agent_propertyGarage;
	public $WWAC_Archives_Agent_propertyParkingSpacesNo;
	public $WWAC_Archives_Agent_propertyRooms;
	public $WWAC_Archives_Agent_propertyElevator;
	public $WWAC_Archives_Agent_mortgageMarket;
	public $WWAC_Archives_Agent_excerpt;

	function __construct(){
		$this -> checkDirs();
		$this -> WPUploadDirCustomTemplates = $this -> getWPUploadDirCustomTemplates();
		
		/* SINGLE */
		$this -> WWAC_Archives_SingleOffer_TemplateHero = get_option('WWAC_Archives_SingleOffer_TemplateHero');
		$this -> WWAC_Archives_SingleOffer_AgentPanel = get_option('WWAC_Archives_SingleOffer_AgentPanel');
		$this -> WWAC_Archives_SingleOffer_AgentPhoto = get_option('WWAC_Archives_SingleOffer_AgentPhoto');
		$this -> WWAC_Archives_SingleOffer_AgentLicenseNr = get_option('WWAC_Archives_SingleOffer_AgentLicenseNr');
		$this -> WWAC_Archives_SingleOffer_AgentNames = get_option('WWAC_Archives_SingleOffer_AgentNames');
		$this -> WWAC_Archives_SingleOffer_AgentPhoneNumbers = get_option('WWAC_Archives_SingleOffer_AgentPhoneNumbers');
		$this -> WWAC_Archives_SingleOffer_AgentEmailAddress = get_option('WWAC_Archives_SingleOffer_AgentEmailAddress');
		$this -> WWAC_Archives_SingleOffer_propertyPrice = get_option('WWAC_Archives_SingleOffer_propertyPrice');
		$this -> WWAC_Archives_SingleOffer_Localization = get_option('WWAC_Archives_SingleOffer_Localization');
		$this -> WWAC_Archives_SingleOffer_Category = get_option('WWAC_Archives_SingleOffer_Category');
		$this -> WWAC_Archives_SingleOffer_Type = get_option('WWAC_Archives_SingleOffer_Type');
		$this -> WWAC_Archives_SingleOffer_propertyArea = get_option('WWAC_Archives_SingleOffer_propertyArea');
		$this -> WWAC_Archives_SingleOffer_propertyYearBuilt = get_option('WWAC_Archives_SingleOffer_propertyYearBuilt');
		$this -> WWAC_Archives_SingleOffer_propertyFloor = get_option('WWAC_Archives_SingleOffer_propertyFloor');
		$this -> WWAC_Archives_SingleOffer_propertyFloors = get_option('WWAC_Archives_SingleOffer_propertyFloors');
		$this -> WWAC_Archives_SingleOffer_propertyGarage = get_option('WWAC_Archives_SingleOffer_propertyGarage');
		$this -> WWAC_Archives_SingleOffer_propertyParkingSpacesNo = get_option('WWAC_Archives_SingleOffer_propertyParkingSpacesNo');
		$this -> WWAC_Archives_SingleOffer_mortgageMarket = get_option('WWAC_Archives_SingleOffer_mortgageMarket');
		$this -> WWAC_Archives_SingleOffer_propertyRooms = get_option('WWAC_Archives_SingleOffer_propertyRooms');
		$this -> WWAC_Archives_SingleOffer_propertyElevator = get_option('WWAC_Archives_SingleOffer_propertyElevator');
		
		/* ALL ARCHIVE */
		$this -> WWAC_Archives_AllOffers_TemplateHero = get_option('WWAC_Archives_AllOffers_TemplateHero');
		$this -> WWAC_Archives_AllOffers_propertyPrice = get_option('WWAC_Archives_AllOffers_propertyPrice');
		$this -> WWAC_Archives_AllOffers_Localization = get_option('WWAC_Archives_AllOffers_Localization');
		$this -> WWAC_Archives_AllOffers_Category = get_option('WWAC_Archives_AllOffers_Category');
		$this -> WWAC_Archives_AllOffers_Type = get_option('WWAC_Archives_AllOffers_Type');
		$this -> WWAC_Archives_AllOffers_propertyArea = get_option('WWAC_Archives_AllOffers_propertyArea');
		$this -> WWAC_Archives_AllOffers_propertyYearBuilt = get_option('WWAC_Archives_AllOffers_propertyYearBuilt');
		$this -> WWAC_Archives_AllOffers_propertyFloor = get_option('WWAC_Archives_AllOffers_propertyFloor');
		$this -> WWAC_Archives_AllOffers_propertyFloors = get_option('WWAC_Archives_AllOffers_propertyFloors');
		$this -> WWAC_Archives_AllOffers_propertyGarage = get_option('WWAC_Archives_AllOffers_propertyGarage');
		$this -> WWAC_Archives_AllOffers_propertyParkingSpacesNo = get_option('WWAC_Archives_AllOffers_propertyParkingSpacesNo');
		$this -> WWAC_Archives_AllOffers_propertyRooms = get_option('WWAC_Archives_AllOffers_propertyRooms');
		$this -> WWAC_Archives_AllOffers_propertyElevator = get_option('WWAC_Archives_AllOffers_propertyElevator');
		$this -> WWAC_Archives_AllOffers_mortgageMarket = get_option('WWAC_Archives_AllOffers_mortgageMarket');
		$this -> WWAC_Archives_AllOffers_excerpt = get_option('WWAC_Archives_AllOffers_excerpt');
		
		/* AGENT */
		$this -> WWAC_Archives_Agent_TemplateHero = get_option('WWAC_Archives_Agent_TemplateHero');
		$this -> WWAC_Archives_Agent_AgentPanel = get_option('WWAC_Archives_Agent_AgentPanel');
		$this -> WWAC_Archives_Agent_AgentPhoto = get_option('WWAC_Archives_Agent_AgentPhoto');
		$this -> WWAC_Archives_Agent_AgentLicenseNr = get_option('WWAC_Archives_Agent_AgentLicenseNr');
		$this -> WWAC_Archives_Agent_AgentNames = get_option('WWAC_Archives_Agent_AgentNames');
		$this -> WWAC_Archives_Agent_AgentPhoneNumbers = get_option('WWAC_Archives_Agent_AgentPhoneNumbers');
		$this -> WWAC_Archives_Agent_AgentEmailAddress = get_option('WWAC_Archives_Agent_AgentEmailAddress');
		$this -> WWAC_Archives_Agent_propertyPrice = get_option('WWAC_Archives_Agent_propertyPrice');
		$this -> WWAC_Archives_Agent_Localization = get_option('WWAC_Archives_Agent_Localization');
		$this -> WWAC_Archives_Agent_Category = get_option('WWAC_Archives_Agent_Category');
		$this -> WWAC_Archives_Agent_Type = get_option('WWAC_Archives_Agent_Type');
		$this -> WWAC_Archives_Agent_propertyArea = get_option('WWAC_Archives_Agent_propertyArea');
		$this -> WWAC_Archives_Agent_propertyYearBuilt = get_option('WWAC_Archives_Agent_propertyYearBuilt');
		$this -> WWAC_Archives_Agent_propertyFloor = get_option('WWAC_Archives_Agent_propertyFloor');
		$this -> WWAC_Archives_Agent_propertyFloors = get_option('WWAC_Archives_Agent_propertyFloors');
		$this -> WWAC_Archives_Agent_propertyGarage = get_option('WWAC_Archives_Agent_propertyGarage');
		$this -> WWAC_Archives_Agent_propertyParkingSpacesNo = get_option('WWAC_Archives_Agent_propertyParkingSpacesNo');
		$this -> WWAC_Archives_Agent_propertyRooms = get_option('WWAC_Archives_Agent_propertyRooms');
		$this -> WWAC_Archives_Agent_propertyElevator = get_option('WWAC_Archives_Agent_propertyElevator');
		$this -> WWAC_Archives_Agent_mortgageMarket = get_option('WWAC_Archives_Agent_mortgageMarket');
		$this -> WWAC_Archives_Agent_excerpt = get_option('WWAC_Archives_Agent_excerpt');
	}
	
	public function checkDirs(){
		if(!is_admin()) return false;
		
		$mainDirArchivesInternal = WWAC_PLUGIN_DIR_PATH."core/templates/";
		$mainDirArchivesExternal = $this -> getWPUploadDirCustomTemplates()."/";
		$WPUploadDir = wp_upload_dir();
		//$wpDir = !wp_mkdir_p($WPUploadDir['path']) ? $WPUploadDir['basedir'] : $WPUploadDir['path'];
		$wpDir = $WPUploadDir['basedir'];
		$dirsList = Array(
			'single-templates',
			'properties-templates',
			'agent-templates',
		);
		$jumps = count($dirsList);
		
		clearstatcache();
		
		if(!is_dir($wpDir.'/webist-wp-asaricrm')){
			wp_mkdir_p($wpDir.'/webist-wp-asaricrm');
		}
		
		if(!is_dir($wpDir.'/webist-wp-asaricrm/templates')){
			wp_mkdir_p($wpDir.'/webist-wp-asaricrm/templates');
		}
		
		for($i = 0; $i < $jumps; $i++){
			if(!file_exists($mainDirArchivesInternal.$dirsList[$i])){
				wp_mkdir_p($mainDirArchivesInternal.$dirsList[$i]);
			}
		}
		
		for($i = 0; $i < $jumps; $i++){
			if(!file_exists($mainDirArchivesExternal.$dirsList[$i])){
				wp_mkdir_p($mainDirArchivesExternal.$dirsList[$i]);
			}
		}
		
		clearstatcache();
	}
	
	public function getWPUploadDirCustomTemplates(){
		$WPUploadDir = wp_upload_dir();
		$wpDir = $WPUploadDir['basedir']; // stały katalog "/uploads/"
		$base = $wpDir.'/webist-wp-asaricrm';
		$proBase = $wpDir.'/webist-wp-asaricrm-pro';
		
		if(is_dir($base.'/templates')){
			return $base.'/templates';
		}else if(is_dir($proBase.'/templates')){
			return $proBase.'/templates';
		}else{
			wp_mkdir_p($base.'/templates');
			return $base.'/templates';
		}
	}
	
	public function getAllArchiveTemplates($type = null, $format = "with_info"){
		if(is_null($type)){
			return false;
		}
		
		switch($type){
			case 'single_offer':
				$dir = "single-templates";
				break;
			case 'all_offers':
				$dir = "properties-templates";
				break;
			case 'agent':
				$dir = "agent-templates";
				break;
			default:
				return false;
				break;
		}
		
		$templatesFullDir = WWAC_PLUGIN_DIR_PATH."core/templates/".$dir."/";
		$customTemplatesFullDir = $this -> WPUploadDirCustomTemplates."/".$dir."/";
		$webistTemplates = scandir($templatesFullDir);
		$webistTemplatesItems = array();
		$customTemplates = scandir($customTemplatesFullDir);
		$customTemplatesItems = array();
		$allTemplates = array();
		
		foreach($webistTemplates as $item){
			if(is_dir($templatesFullDir.$item) && $item != '.' && $item != '..'){
				$webistTemplatesItems[] = array(
					'item' => $item,
					'dir' => $templatesFullDir
				);
			}
		}
		
		foreach($customTemplates as $item){
			if(is_dir($customTemplatesFullDir.$item) && $item != '.' && $item != '..'){
				$customTemplatesItems[] = array(
					'item' => $item,
					'dir' => $customTemplatesFullDir
				);
			}
		}
		
		$allRawTemplates = array_merge($webistTemplatesItems, $customTemplatesItems);
		
		foreach($allRawTemplates as $template){
			if($this -> verifyTemplate($template['dir'], $template['item'])){
				if(!strcmp($format, "raw")){
					$allTemplates[] = $template;
				}elseif(!strcmp($format, "with_info")){
					$allTemplates[] = array_merge($template, $this -> getArchiveTemplateInfo($template));
				}elseif(!strcmp($format, "only_info")){
					$allTemplates[] = $this -> getArchiveTemplateInfo($template);
				}
			}
		}
		
		return $allTemplates;
	}
	
	public function getArchiveTemplateInfo(array $info){
		if(!is_array($info)){
			return ['broken' => true];
		}
		
		$filePath = $info['dir'].$info['item']."/template.json";
		
		if(!file_exists($filePath)){
			return ['broken' => true];
		}
		
		$jsonInfo = @file_get_contents($filePath);
		
		if($jsonInfo !== false){
			$jsonData = json_decode($jsonInfo, true);
			
			if(json_last_error() == JSON_ERROR_NONE){
				if(isSet($jsonData['name'], $jsonData['desc'], $jsonData['version'], $jsonData['type'])){
					return array_merge($jsonData, ['broken' => false]);
				}else{
					return ['broken' => true];
				}
			}else{
				return ['broken' => true];
			}
		}else{
			return ['broken' => true];
		}
	}
	
	public function getActiveArchiveTemplateInfo($type = null){
		if(is_null($type)){
			return false;
		}
		
		switch($type){
			case 'single_offer':
				$optionName = "WWAC_Archives_SingleOffer_Template";
				$dirName = "single-templates";
				$templateType = get_option('WWAC_Archives_SingleOffer_TemplateType');
				break;
			case 'all_offers':
				$optionName = "WWAC_Archives_AllOffers_Template";
				$dirName = "properties-templates";
				$templateType = get_option('WWAC_Archives_AllOffers_TemplateType');
				break;
			case 'agent':
				$optionName = "WWAC_Archives_Agent_Template";
				$dirName = "agent-templates";
				$templateType = get_option('WWAC_Archives_Agent_TemplateType');
				break;
			default:
				return false;
				break;
		}
		
		$activeTemplate = get_option($optionName);
		
		switch($templateType){
			case 'internal':
				$infoFile = WWAC_PLUGIN_DIR_PATH."core/templates/".$dirName."/".$activeTemplate."/template.json";
				break;
			case 'external':
				$infoFile = $this -> WPUploadDirCustomTemplates."/".$dirName."/".$activeTemplate."/template.json";
				break;
			default:
				return false;
				break;
		}
		
		if(!file_exists($infoFile)){
			return false;
		}
		
		$jsonInfo = @file_get_contents($infoFile);
		
		if($jsonInfo !== false){
			$jsonData = json_decode($jsonInfo, true);
			
			if(json_last_error() == JSON_ERROR_NONE){
				if(isSet($jsonData['name'], $jsonData['desc'], $jsonData['version'], $jsonData['type'])){
					return array_merge($jsonData);
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	public function uploadNewTemplate($files, $type = null) {
		if(!is_array($files)) return false;
		if(is_null($type)) return false;
		
		switch($type){
			case 'single':
				$typeDir = '/single-templates/';
				$inputName = 'WWAC_Archives_Single_Upload_File';
				break;
			case 'all_offers':
				$typeDir = '/properties-templates/';
				$inputName = 'WWAC_Archives_All_Upload_File';
				break;
			case 'agent':
				$typeDir = '/agent-templates/';
				$inputName = 'WWAC_Archives_Agent_Upload_File';
				break;
			default:
				break;
		}
		
		if($files[$inputName]['error'] == UPLOAD_ERR_OK){
			$file = $files[$inputName];
			$uploadDir = $this->WPUploadDirCustomTemplates.$typeDir;
			$tmpDir = $this->WPUploadDirCustomTemplates.'/tmp/';
			
			if(!file_exists($tmpDir)){
				if(!mkdir($tmpDir, 0755, true)){
					return false;
				}
			}

			$zipPath = $tmpDir.basename($file['name']);
			
			if(move_uploaded_file($file['tmp_name'], $zipPath)){
				$zip = new ZipArchive;
				
				if($zip -> open($zipPath) === TRUE){
					if($this -> verifyZipContent($zip)){
						if($zip -> extractTo($uploadDir)){
							$zip-> close();
							unlink($zipPath);
							$this -> deleteDir($tmpDir);
							
							return true;
						}else{
							echo '<div class="notice notice-error is-dismissible"><p>Nie udało się wypakować archiwum <i>*.zip</i> z szablonem!</p></div>';
						}
					}else{
						echo '<div class="notice notice-error is-dismissible"><p>Niepoprawna struktura szablonu!</p></div>';
					}
				}else{
					echo '<div class="notice notice-error is-dismissible"><p>Nie udało się otworzyć archiwum <i>*.zip</i> z szablonem!</p></div>';
				}
			}else{
				echo '<div class="notice notice-error is-dismissible"><p>Nie udało się prznieść plików z archiwum <i>*.zip</i>!</p></div>';
			}
		}else{
			echo '<div class="notice notice-error is-dismissible"><p>Błąd związany z uploadem plików: '.$files[$inputName]['error'].'</p></div>';
		}
	}
	
	private function verifyTemplate($fullDir = null, $item = null){
		if(is_null($item) || is_null($fullDir)){
			return false;
		}
		
		$status = false;
		$desiredFiles = array('template.php', 'functions.php', 'template.json');
		$filesInDirectory = scandir($fullDir.$item.'/');
		$foundFiles = [];
		
		foreach($desiredFiles as $file){
			if(in_array($file, $filesInDirectory)){
				$status = true;
			}else{
				$status = false;
			}
		}
		
		return $status;
	}
	
	private function verifyZipContent($zip){
		$desiredFiles = array('template.php', 'functions.php', 'template.json');
		$foundFiles = [];
		
		for($i = 0; $i < $zip->numFiles; $i++){
			$stat = $zip->statIndex($i);
			$fileName = basename($stat['name']);
			
			if(in_array($fileName, $desiredFiles)){
				$foundFiles[] = $fileName;
			}
		}
		
		if(count($foundFiles) === count($desiredFiles)){
			return true;
		}
		
		return false;
	}
	
	private function deleteDir($dirPath){
		if(!is_dir($dirPath)){
			return false;
		}
		
		$files = array_diff(scandir($dirPath), array('.', '..'));
		
		foreach($files as $file){
			$filePath = $dirPath.'/'.$file;
			if(is_dir($filePath)){
				$this->deleteDir($filePath);
			}else{
				unlink($filePath);
			}
		}
		
		return rmdir($dirPath);
	}
	
	public function getTemplateAssetURL($type = null, $path = ''){
		if(is_null($type)){
			return false;
		}

		switch($type){
			case 'single_offer':
				$optionName = "WWAC_Archives_SingleOffer_Template";
				$dirName = "single-templates";
				$templateType = get_option('WWAC_Archives_SingleOffer_TemplateType');
				break;
			case 'all_offers':
				$optionName = "WWAC_Archives_AllOffers_Template";
				$dirName = "properties-templates";
				$templateType = get_option('WWAC_Archives_AllOffers_TemplateType');
				break;
			case 'agent':
				$optionName = "WWAC_Archives_Agent_Template";
				$dirName = "agent-templates";
				$templateType = get_option('WWAC_Archives_Agent_TemplateType');
				break;
			default:
				return false;
		}

		$templateName = get_option($optionName);
		
		if($templateType === 'internal'){
			$baseURL = WWAC_PLUGIN_DIR_URL."core/templates/{$dirName}/{$templateName}";
		}else{
			$upload = wp_upload_dir();
			$baseURL = $upload['baseurl']."/webist-wp-asaricrm/templates/{$dirName}/{$templateName}";
		}
		
		$path = trim($path);
		$path = str_replace('\\', '/', $path);
		
		if(strpos($path, '../') !== false || strpos($path, '..\\') !== false){
			return false;
		}
		
		$path = preg_replace('#/+#', '/', $path);
		$path = ltrim($path, '/');
		
		return rtrim($baseURL, '/').'/'.$path;
	}
	
	public function getTemplateAssetPath($type = null, $path = ''){
		if($type === null){
			return false;
		}

		switch($type){
			case 'single_offer':
				$optionName = "WWAC_Archives_SingleOffer_Template";
				$dirName = "single-templates";
				$templateType = get_option('WWAC_Archives_SingleOffer_TemplateType');
				break;

			case 'all_offers':
				$optionName = "WWAC_Archives_AllOffers_Template";
				$dirName = "properties-templates";
				$templateType = get_option('WWAC_Archives_AllOffers_TemplateType');
				break;

			case 'agent':
				$optionName = "WWAC_Archives_Agent_Template";
				$dirName = "agent-templates";
				$templateType = get_option('WWAC_Archives_Agent_TemplateType');
				break;

			default:
				return false;
		}

		$templateName = get_option($optionName);
		
		if($templateType === 'internal'){
			$basePath = WWAC_PLUGIN_DIR_PATH."core/templates/{$dirName}/{$templateName}";
		}else{
			$upload = wp_upload_dir();
			$basePath = $upload['basedir']."/webist-wp-asaricrm/templates/{$dirName}/{$templateName}";
		}
		
		$path = trim($path);
		$path = str_replace('\\', '/', $path);
		
		if(strpos($path, '../') !== false){
			return false;
		}
		
		$path = preg_replace('#/+#', '/', $path);
		$path = ltrim($path, '/');

		return rtrim($basePath, '/').'/'.$path;
	}
	
	/* ********* METHODS TO USE IN CUSTOM ARCHIVES ********* */
	
	/* GENERAL */
	public function isHeroActive(){
		if(is_single()){
			return (bool) $this -> WWAC_Archives_SingleOffer_TemplateHero;
		}
		
		if(is_post_type_archive('nieruchomosci')){
			return (bool) $this -> WWAC_Archives_AllOffers_TemplateHero;
		}
		
		if(is_tax('Agent')){
			return (bool) $this -> WWAC_Archives_Agent_TemplateHero;
		}
	}
	
	public function isExcerptActive(){
		if(is_post_type_archive('nieruchomosci')){
			return (bool) $this -> WWAC_Archives_AllOffers_excerpt;
		}
		
		if(is_tax('Agent')){
			return (bool) $this -> WWAC_Archives_Agent_excerpt;
		}
	}
	
	/* AGENT */
	public function isAgentInfoEnabled(){
		if(is_single()){
			return (bool) $this -> WWAC_Archives_SingleOffer_AgentPanel;
		}
		
		if(is_tax('Agent')){
			return (bool) $this -> WWAC_Archives_Agent_AgentPanel;
		}
	}
	
	public function showAgentPhoto($class = 'default', $postID = null, $id = 'default', $alt = 'default', $subImg = 'default'){
		if(is_tax('Agent')){
			if(!$this -> WWAC_Archives_Agent_AgentPhoto){
				return null;
			}

			$agentTerm = get_queried_object();
			$termID = $agentTerm -> term_id;
			$agentName = $agentTerm -> name;
			$agentImageID = get_term_meta($termID, 'WWAC_AgentImageID', true);
			$agentImageURL = wp_get_attachment_image_url($agentImageID, 'large');
			$altText = get_post_meta($agentImageID, '_wp_attachment_image_alt', true);

			// klasa
			if(!strcmp($class, 'default')){
				$class = 'wwac-agent-image';
			}else{
				$class = htmlspecialchars($class).' wwac-agent-image';
			}

			// id
			if(!strcmp($id, 'default')){
				$id = 'wwac-agent-image';
			}else{
				$id = htmlspecialchars($id);
			}

			// alt
			if(!strcmp($alt, 'default')){
				$alt = !empty($altText) ? str_replace('{agent.name}', $agentName, $altText) : 'Agent nieruchomości '.$agentName;
			}else{
				$alt = htmlspecialchars($alt);
			}

			// fallback IMG
			if(!strcmp($subImg, 'default')){
				$subImg = WWAC_PLUGIN_DIR_URL.'assets/img/agent-placeholder.png';
			}

			if(!$agentImageURL){
				$agentImageURL = $subImg;
			}

			return '<img src="'.$agentImageURL.'" alt="'.$alt.'" class="'.$class.'" id="'.$id.'"/>';
		}
		
		if(is_single()){
			if(!$this -> WWAC_Archives_SingleOffer_AgentPhoto){
				return null;
			}

			// Pobranie agenta przypisanego do oferty
			if(is_null($postID) || !is_int($postID)){
				$postID = get_the_ID();
			}

			$agentTerms = get_the_terms($postID, 'Agent');
			
			if(!$agentTerms || !is_array($agentTerms)){
				return null;
			}

			$agentTerm = reset($agentTerms);
			$termID = $agentTerm -> term_id;
			$agentName = $agentTerm -> name;
			$agentImageID = get_term_meta($termID, 'WWAC_AgentImageID', true);
			$agentImageURL = wp_get_attachment_image_url($agentImageID, 'large');
			$altText = get_post_meta($agentImageID, '_wp_attachment_image_alt', true);

			// klasa
			if(!strcmp($class, 'default')){
				$class = 'wwac-agent-image';
			}else{
				$class = htmlspecialchars($class).' wwac-agent-image';
			}

			// id
			if(!strcmp($id, 'default')){
				$id = 'wwac-agent-image';
			}else{
				$id = htmlspecialchars($id);
			}

			// alt
			if(!strcmp($alt, 'default')){
				$alt = !empty($altText) ? str_replace('{agent.name}', $agentName, $altText) : 'Agent nieruchomości '.$agentName;
			}else{
				$alt = htmlspecialchars($alt);
			}

			// fallback IMG
			if(!strcmp($subImg, 'default')){
				$subImg = WWAC_PLUGIN_DIR_URL.'assets/img/agent-placeholder.png';
			}

			if(!$agentImageURL){
				$agentImageURL = $subImg;
			}

			return '<img src="'.$agentImageURL.'" alt="'.$alt.'" class="'.$class.'" id="'.$id.'"/>';
		}
	}
	
	public function showAgentLicenseNr($pattern = '{agent.licensenr}', $postID = null, $prefix = null, $suffix = null){
		if(is_tax('Agent')){
			if(!$this -> WWAC_Archives_Agent_AgentLicenseNr){
				return null;
			}

			$agentTerm = get_queried_object();
			$termID = $agentTerm -> term_id;
			$agentLicenseNumber = get_term_meta($termID, 'WWAC_AgentLicenseNumber', true);

			if(!$agentLicenseNumber){
				return null;
			}

			// prefix/suffix fallback
			$prefix = $prefix ?? '';
			$suffix = $suffix ?? '';

			$rawReturn = $prefix.$pattern.$suffix;
			return str_replace('{agent.licensenr}', $agentLicenseNumber, $rawReturn);
		}

		// SINGLE OFFER
		if(is_single()){
			if(!$this -> WWAC_Archives_SingleOffer_AgentLicenseNr){
				return null;
			}

			if(is_null($postID) || !is_int($postID)){
				$postID = get_the_ID();
			}

			$agentTerms = get_the_terms($postID, 'Agent');
			
			if(!$agentTerms || !is_array($agentTerms)){
				return null;
			}

			$agentTerm = reset($agentTerms);
			$termID = $agentTerm -> term_id;

			$agentLicenseNumber = get_term_meta($termID, 'WWAC_AgentLicenseNumber', true);
			
			if(!$agentLicenseNumber){
				return null;
			}

			// prefix/suffix fallback
			$prefix = $prefix ?? '';
			$suffix = $suffix ?? '';

			$rawReturn = $prefix.$pattern.$suffix;
			return str_replace('{agent.licensenr}', $agentLicenseNumber, $rawReturn);
		}

		return null;
	}
	
	public function showAgentNames($pattern = '{agent.names}', $postID = null, $prefix = null, $suffix = null){
		if(is_tax('Agent')){

			if(!$this -> WWAC_Archives_Agent_AgentNames){
				return null;
			}

			$agentTerm = get_queried_object();
			
			if(!$agentTerm){
				return null;
			}

			$agentName = $agentTerm -> name;
			$prefix = $prefix ?? '';
			$suffix = $suffix ?? '';

			$raw = $prefix.$pattern.$suffix;
			
			return str_replace('{agent.names}', $agentName, $raw);
		}
		
		if(is_single()){

			if(!$this -> WWAC_Archives_SingleOffer_AgentNames){
				return null;
			}

			if(is_null($postID) || !is_int($postID)){
				$postID = get_the_ID();
			}

			$agentTerms = get_the_terms($postID, 'Agent');
			
			if(!$agentTerms || !is_array($agentTerms)){
				return null;
			}

			$agentTerm = reset($agentTerms);
			
			if(!$agentTerm){
				return null;
			}

			$agentName = $agentTerm -> name;
			$prefix = $prefix ?? '';
			$suffix = $suffix ?? '';

			$raw = $prefix.$pattern.$suffix;
			
			return str_replace('{agent.names}', $agentName, $raw);
		}
		
		return null;
	}
	
	public function showAgentPhoneNumbers($pattern = '{agent.phones}', $postID = null, $prefix = null, $suffix = null){
		if(is_tax('Agent')){
			if(!$this -> WWAC_Archives_Agent_AgentPhoneNumbers){
				return null;
			}

			$agentTerm = get_queried_object();
			
			if(!$agentTerm){
				return null;
			}

			$termID = $agentTerm -> term_id;
			$phone1 = get_term_meta($termID, 'WWAC_AgentFirstPhoneNumber', true);

			if(!$phone1){
				return null;
			}
			
			$prefix = $prefix ?? '';
			$suffix = $suffix ?? '';

			$raw = $prefix.$pattern.$suffix;

			return str_replace('{agent.phones}', $phone1, $raw);
		}
		
		if(is_single()){
			if(!$this -> WWAC_Archives_SingleOffer_AgentPhoneNumbers){
				return null;
			}

			if(is_null($postID) || !is_int($postID)){
				$postID = get_the_ID();
			}

			$agentTerms = get_the_terms($postID, 'Agent');
			
			if (!$agentTerms || !is_array($agentTerms)){
				return null;
			}

			$agentTerm = reset($agentTerms);
			
			if(!$agentTerm){
				return null;
			}

			$termID = $agentTerm -> term_id;
			$phone1 = get_term_meta($termID, 'WWAC_AgentFirstPhoneNumber', true);

			if(!$phone1){
				return null;
			}

			$prefix = $prefix ?? '';
			$suffix = $suffix ?? '';

			$raw = $prefix.$pattern.$suffix;

			return str_replace('{agent.phones}', $phone1, $raw);
		}
		
		return null;
	}
	
	public function showAgentEmailAddress($pattern = '{agent.email}', $postID = null, $prefix = null, $suffix = null){
		if(is_tax('Agent')){
			if(!$this -> WWAC_Archives_Agent_AgentEmailAddress){
				return null;
			}

			$agentTerm = get_queried_object();
			
			if(!$agentTerm){
				return null;
			}

			$termID = $agentTerm -> term_id;
			$email = get_term_meta($termID, 'WWAC_AgentEmail', true);

			if(!$email){
				return null;
			}
			
			$prefix = $prefix ?? '';
			$suffix = $suffix ?? '';
			$raw = $prefix.$pattern.$suffix;

			return str_replace('{agent.email}', $email, $raw);
		}
		
		if(is_single()){
			if(!$this -> WWAC_Archives_SingleOffer_AgentEmailAddress){
				return null;
			}

			if(is_null($postID) || !is_int($postID)){
				$postID = get_the_ID();
			}

			$agentTerms = get_the_terms($postID, 'Agent');
			
			if(!$agentTerms || !is_array($agentTerms)){
				return null;
			}

			$agentTerm = reset($agentTerms);
			
			if(!$agentTerm){
				return null;
			}

			$termID = $agentTerm -> term_id;
			$email = get_term_meta($termID, 'WWAC_AgentEmail', true);

			if(!$email){
				return null;
			}
			
			$prefix = $prefix ?? '';
			$suffix = $suffix ?? '';
			$raw = $prefix.$pattern.$suffix;

			return str_replace('{agent.email}', $email, $raw);
		}
		
		return null;
	}
	
	/* TAXONOMIES */
	
	public function showPropertyTax($pattern = '{taxonomy}', $taxName = null, $postID = null, $link = false, $prefix = null, $suffix = null){
		if(is_null($taxName) || !is_string($taxName)){
			return null;
		}
		
		if(is_null($postID) || !is_int($postID)){
			$postID = get_the_ID();
		}
		
		if(get_post_type($postID) !== 'nieruchomosci'){
			return null;
		}

		$taxName = htmlspecialchars($taxName);
		$formattedTaxName = ucwords(strtolower($taxName));
		
		if(is_single()){
			if(!$this -> {'WWAC_Archives_SingleOffer_'.$formattedTaxName}){
				return null;
			}
		}

		if(is_post_type_archive('nieruchomosci')){
			if(!$this -> {'WWAC_Archives_AllOffers_'.$formattedTaxName}){
				return null;
			}
		}

		if(is_tax('Agent')){
			if(!$this->{'WWAC_Archives_Agent_'.$formattedTaxName}){
				return null;
			}
		}
		
		switch($formattedTaxName){
			case 'Type':
				$termName = 'Typ';
				break;
			case 'Localization':
				$termName = 'Lokalizacja';
				break;
			case 'Category':
				$termName = 'Kategorie';
				break;
			default:
				return null;
		}
		
		$terms = get_the_terms($postID, $termName);
		
		if(!$terms || empty($terms[0])){
			return null;
		}

		$termsName = $terms[0] -> name;
		
		if($link){
			$termsName = '<a href="'.get_term_link($terms[0]).'" title="Sprawdź wszystkie nieruchomości typu '.esc_attr($termsName).'">'.$termsName.'</a>';
		}
		
		$prefix = $prefix ?? '';
		$suffix = $suffix ?? '';
		
		$rawReturn = $prefix.$pattern.$suffix;
		
		return str_replace('{taxonomy}', $termsName, $rawReturn);
	}
	
	/* META */
	
	/*** TESTOWE START ***/
	public function showAgentInfo($pattern = '{agent.info}', $postID = null){
		if(is_null($postID) || !is_int($postID)){
			$postID = get_the_ID();
		}
		
		
	}
	/*** TESTOWE END ***/
	
	public function showPropertyMeta($pattern = '{meta}', $metaName = null, $postID = null, $prefix = null, $suffix = null){
		if(is_null($metaName) || !is_string($metaName)){
			return null;
		}

		$metaName = htmlspecialchars($metaName);
		
		if(is_null($postID) || !is_int($postID)){
			$postID = get_the_ID();
		}
		
		if(get_post_type($postID) !== 'nieruchomosci'){
			return null;
		}
		
		if(is_single()){
			if(!$this -> {'WWAC_Archives_SingleOffer_'.$metaName}){
				return null;
			}
		}

		if(is_post_type_archive('nieruchomosci')){
			if(!$this -> {'WWAC_Archives_AllOffers_'.$metaName}){
				return null;
			}
		}

		if(is_tax('Agent')){
			if(!$this -> {'WWAC_Archives_Agent_'.$metaName}){
				return null;
			}
		}
		
		$meta = get_post_meta($postID, $metaName, true);

		if($meta === '' || $meta === null){
			return null;
		}
		
		switch($metaName){
			case 'propertyPrice':
				$currency = strtolower(get_post_meta($postID, 'propertyPriceCurrency', true));
				
				switch($currency){
					case 'pln':
						$meta .= " zł";
						break;
					case 'usd':
						$meta .= " $";
						break;
					case 'eur':
						$meta .= " €";
						break;
					default:
						$meta .= " zł";
						break;
				}
				break;

			case 'propertyArea':
				$meta .= " m<sup>2</sup>";
				break;

			case 'propertyYearBuilt':
				$meta .= " r.";
				break;

			case 'propertyGarage':
				$meta = ($meta == 1) ? 'Jest' : 'Brak';
				break;

			case 'mortgageMarket':
				switch ($meta) {
					case 'primary':
						$meta = 'Pierwotny';
						break;
					case 'secondary':
						$meta = 'Wtórny';
						break;
					default:
						$meta = 'Brak';
						break;
				}
				break;

			case 'propertyElevator':
				$meta = ($meta == 1) ? 'Jest' : 'Brak';
				break;
		}
		
		$prefix = $prefix ?? '';
		$suffix = $suffix ?? '';
		
		$raw = $prefix.$pattern.$suffix;
		
		return str_replace('{meta}', $meta, $raw);
	}
}