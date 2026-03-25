<?php
include_once(WWAC_PLUGIN_DIR_PATH."core/classes/class.WWACCustomArchives.php");
$WWACCustomArchives = new WWACCustomArchives();

if(isSet($_GET['action']) && isSet($_GET['atype'])){
	if(!strcmp($_GET['atype'], 'single')){
		switch($_GET['action']){
			case 'save':
				if(wp_verify_nonce($_POST['WWAC_Archives_Single_Save'], 'WWAC_Archives_Single_Save')){
					foreach($_POST as $key => $value){
						if(empty($value)){
							update_option($key, '');
						}else{
							if(!strcmp('WWAC_Archives_SingleOffer_Template', $key)){
								$option = explode(":", $value);
								update_option('WWAC_Archives_SingleOffer_Template', sanitize_text_field($option[0]));
								update_option('WWAC_Archives_SingleOffer_TemplateType', sanitize_text_field($option[1]));
							}else{
								update_option($key, sanitize_text_field($value));
							}
						}
					}
					
					echo '<div class="notice notice-success is-dismissible">
						<p>Zaktualizowano ustawienia.</p>
					</div>';
				}
				break;
				
			case 'upload':
				if(isSet($_POST['WWAC_Archives_Single_Upload']) && wp_verify_nonce($_POST['WWAC_Archives_Single_Upload'], 'WWAC_Archives_Single_Upload')){
					if($WWACCustomArchives -> uploadNewTemplate($_FILES, 'single')){
						echo '<div class="notice notice-success is-dismissible"><p>Dodano nowy szablon pojedynczej oferty!</p></div>';
					}
				}else{
					echo '<div class="notice notice-error is-dismissible"><p>Problem z nonce! Wyloguj się i spróbuj ponownie!</p></div>';
				}
				break;
				
			default:
				break;
		}
	}else if(!strcmp($_GET['atype'], 'all')){
		switch($_GET['action']){
			case 'save':
				if(wp_verify_nonce($_POST['WWAC_Archives_All_Save'], 'WWAC_Archives_All_Save')){
					foreach($_POST as $key => $value){
						if(empty($value)){
							update_option($key, '');
						}else{
							if(!strcmp('WWAC_Archives_AllOffers_Template', $key)){
								$option = explode(":", $value);
								update_option('WWAC_Archives_AllOffers_Template', sanitize_text_field($option[0]));
								update_option('WWAC_Archives_AllOffers_TemplateType', sanitize_text_field($option[1]));
							}else{
								update_option($key, (int) sanitize_text_field($value));
							}
						}
					}
					
					echo '<div class="notice notice-success is-dismissible">
						<p>Zaktualizowano ustawienia archiwum nieruchomości.</p>
					</div>';
				}else{
					echo '<div class="notice notice-error is-dismissible"><p>Problem z nonce! Wyloguj się i spróbuj ponownie!</p></div>';
				}
				break;
				
			case 'upload':
				if(isSet($_POST['WWAC_Archives_All_Upload']) && wp_verify_nonce($_POST['WWAC_Archives_All_Upload'], 'WWAC_Archives_All_Upload')){
					if($WWACCustomArchives -> uploadNewTemplate($_FILES, 'all_offers')){
						echo '<div class="notice notice-success is-dismissible"><p>Dodano nowy szablon archiwum nieruchomości!</p></div>';
					}
				}else{
					echo '<div class="notice notice-error is-dismissible"><p>Problem z nonce! Wyloguj się i spróbuj ponownie!</p></div>';
				}
				break;
				
			default:
				break;
		}
	}else if(!strcmp($_GET['atype'], 'agent')){
		switch($_GET['action']){
			case 'save':
				if(wp_verify_nonce($_POST['WWAC_Archives_Agent_Save'], 'WWAC_Archives_Agent_Save')){
					foreach($_POST as $key => $value){
						if(empty($value)){
							update_option($key, '');
						}else{
							if(!strcmp('WWAC_Archives_Agent_Template', $key)){
								$option = explode(":", $value);
								update_option('WWAC_Archives_Agent_Template', sanitize_text_field($option[0]));
								update_option('WWAC_Archives_Agent_TemplateType', sanitize_text_field($option[1]));
							}else{
								update_option($key, (int) sanitize_text_field($value));
							}
						}
					}
					
					echo '<div class="notice notice-success is-dismissible">
						<p>Zaktualizowano ustawienia archiwum nieruchomości agenta.</p>
					</div>';
				}else{
					echo '<div class="notice notice-error is-dismissible"><p>Problem z nonce! Wyloguj się i spróbuj ponownie!</p></div>';
				}
				break;
				
			case 'upload':
				if(isSet($_POST['WWAC_Archives_Agent_Upload']) && wp_verify_nonce($_POST['WWAC_Archives_Agent_Upload'], 'WWAC_Archives_Agent_Upload')){
					if($WWACCustomArchives -> uploadNewTemplate($_FILES, 'agent')){
						echo '<div class="notice notice-success is-dismissible"><p>Dodano nowy szablon archiwum nieruchomości agenta!</p></div>';
					}
				}else{
					echo '<div class="notice notice-error is-dismissible"><p>Problem z nonce! Wyloguj się i spróbuj ponownie!</p></div>';
				}
				break;
				
			default:
				break;
		}
	}
}
?>
<style>
/* *** TEST *** */
h3{
	font-size: 1.15em;
}
.container {
  display: flex;
}

.sidebar {
  width: 250px;
  background: #f9f9f9;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.tab-titles {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tab-titles li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.tab-titles li:hover,
.tab-titles li.active {
  background: #e0e0e0;
}

.tab-title {
  font-weight: bold;
}

.tab-description {
  font-size: 0.9em;
  color: #555;
  margin: 5px 0;
}

.content {
  flex: 1;
  padding: 10px;
  background: #f9f9f9;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  margin-left: 21px;
}

.tab-content .tab-pane {
  display: none;
}

.tab-content .tab-pane.active {
  display: block;
}

.WWAC_Archives_SingleOffer_Supports, .WWAC_Archives_AllOffers_Supports{
	display: block;
}
</style>

<h2>Archiwa nieruchomości</h2>

<div class="container">
	<div class="sidebar">
		<ul class="tab-titles">
			<li class="active" data-tab="tab1">
				<span class="tab-title">Pojedyncza oferta</span>
				<p class="tab-description">Opcje pojedynczej oferty</p>
			</li>
			
			<li data-tab="tab2">
				<span class="tab-title">Archiwum nieruchomości</span>
				<p class="tab-description">Opcje archiwum wszystkich ofert</p>
			</li>
			
			<li data-tab="tab3">
				<span class="tab-title">Archiwum agenta</span>
				<p class="tab-description">Opcje archiwum ofert agenta</p>
			</li>
			
			<!-- <li data-tab="tab3">
				<span class="tab-title">Archiwum kategorii (Pro)</span>
				<p class="tab-description">Opcje archiwum kategorii</p>
			</li>
			
			<li data-tab="tab4">
				<span class="tab-title">Archiwum typu (Pro)</span>
				<p class="tab-description">Opcje archiwum typu nieruchomości</p>
			</li>
			
			<li data-tab="tab5">
				<span class="tab-title">Archiwum lokalizacji (Pro)</span>
				<p class="tab-description">Opcje archiwum lokalizacji</p>
			</li>
			
			<li data-tab="tab6">
				<span class="tab-title">Archiwum agenta (Pro)</span>
				<p class="tab-description">Opcje archiwum agenta</p>
			</li> -->
		</ul>
	</div>
	
	<div class="content">
		<div id="tab1" class="tab-pane active">
			<?php
			$allSingleTemplates = $WWACCustomArchives -> getAllArchiveTemplates("single_offer");
			$activeSingleTemplate = $WWACCustomArchives -> getActiveArchiveTemplateInfo('single_offer');
			?>
			<h2>Pojedyncza oferta</h2>
			<p>W tym miejscu możesz wybrać dostępny szablon pojedynczej oferty nieruchomości. Standardowo we wtyczce jest wgrany jeden szablon nieruchomości. Na podstawie tego szablonu można stworzyć własny. Zachęcamy do skorzystania z naszej oferty <a href="https://webist.pl/wtyczki/integracja-webist-wp-asari-crm/szablony-archiwum/" target="_blank">gotowych szablonów</a>. Należy także pamiętać o tym, że nie każdy szablon obsługuje podane opcje.</p>
			
			<h3>Dodaj szablon</h3>
			<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-archives&action=upload&atype=single" method="POST" enctype="multipart/form-data">
				<?php wp_nonce_field('WWAC_Archives_Single_Upload', 'WWAC_Archives_Single_Upload'); ?>
				<input type="file" name="WWAC_Archives_Single_Upload_File" id="WWAC_Archives_Single_Upload_File" accept=".zip" />
				<?php submit_button('Dodaj szablon singla', 'primary', 'submit', true, array('id' => 'WWAC_Archives_Single_Upload_File_Button')); ?>
			</form>
			
			<h3>Szablon</h3>
			<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-archives&action=save&atype=single" method="POST">
				<?php wp_nonce_field('WWAC_Archives_Single_Save', 'WWAC_Archives_Single_Save'); ?>
				<table class="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_Template">Szablon pojedynczej oferty</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_Template" id="WWAC_Archives_SingleOffer_Template">
								<?php
								foreach($allSingleTemplates as $singleTemplate){
									if(!$singleTemplate['broken']){
									?>
									<option value="<?php echo $singleTemplate['item'].":".$singleTemplate['type']; ?>" <?php echo (!strcmp($singleTemplate['item'], get_option('WWAC_Archives_SingleOffer_Template'))) ? 'selected' : ''; ?>><?php echo (!strcmp($singleTemplate['type'], 'external')) ? $singleTemplate['name'].' (upload)' : $singleTemplate['name'] ; ?></option>
									<?php
									}
								}
								?>
								</select>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_TemplateStatus">Włączyć na stronie?</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_TemplateStatus" id="WWAC_Archives_SingleOffer_TemplateStatus">
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_TemplateStatus') == 1) ? 'selected' : ''; ?>>Nie</option>
									<option value="2" <?php echo (get_option('WWAC_Archives_SingleOffer_TemplateStatus') == 2) ? 'selected' : ''; ?>>Tak</option>
								</select>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_TemplateHero">Sekcja Hero</label>
							</th>
								
							<td>
								<select name="WWAC_Archives_SingleOffer_TemplateHero" id="WWAC_Archives_SingleOffer_TemplateHero">
									<option value="0" <?php echo ((int) get_option('WWAC_Archives_SingleOffer_TemplateHero') == 0) ? 'selected' : ''; ?>>Wyłączona</option>
									<option value="1" <?php echo ((int) get_option('WWAC_Archives_SingleOffer_TemplateHero') == 1) ? 'selected' : ''; ?>>Włączona</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_hero']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
					</tbody>
				</table>
				
				<h3>Informacje o agencie</h3>
				<p>Tutaj możesz ustawić, jakie dane (na temat agenta w ofercie) ma wyświetlać dany template.</p>
				
				<table class="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_AgentPanel">Czy wyświetlać informacje o agencie?</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_AgentPanel" id="WWAC_Archives_SingleOffer_AgentPanel">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentPanel') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentPanel') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_AgentPanel']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_AgentPhoto">Zdjęcie agenta</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_AgentPhoto" id="WWAC_Archives_SingleOffer_AgentPhoto">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentPhoto') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentPhoto') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_AgentPhoto']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_AgentLicenseNr">Numer licencji</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_AgentLicenseNr" id="WWAC_Archives_SingleOffer_AgentLicenseNr">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentLicenseNr') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentLicenseNr') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_AgentLicenseNr']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_AgentNames">Imię i nazwisko</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_AgentNames" id="WWAC_Archives_SingleOffer_AgentNames">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentNames') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentNames') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_AgentNames']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_AgentPhoneNumbers">Numer telefonu</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_AgentPhoneNumbers" id="WWAC_Archives_SingleOffer_AgentPhoneNumbers">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentPhoneNumbers') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentPhoneNumbers') == 1) ? 'selected' : ''; ?>>Wyświetlaj jeden</option>
									<!-- <option value="2" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentPhoneNumbers') == 2) ? 'selected' : ''; ?>>Wyświetlaj dwa</option> -->
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_AgentPhoneNumbers']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_AgentEmailAddress">Adres e-mail</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_AgentEmailAddress" id="WWAC_Archives_SingleOffer_AgentEmailAddress">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentEmailAddress') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_AgentEmailAddress') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_AgentEmailAddress']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
					</tbody>
				</table>
				
				<h3>Informacje o nieruchomości</h3>
				<p>Tutaj możesz ustawić, jakie dane (na temat samej oferty) ma wyświetlać dany template.</p>
				
				<table class="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyPrice">Cena</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyPrice" id="WWAC_Archives_SingleOffer_propertyPrice">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyPrice') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyPrice') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyPrice']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_Localization">Lokalizacja</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_Localization" id="WWAC_Archives_SingleOffer_Localization">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_Localization') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_Localization') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_Localization']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_Category">Kategoria</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_Category" id="WWAC_Archives_SingleOffer_Category">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_Category') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_Category') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_Category']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_Type">Typ</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_Type" id="WWAC_Archives_SingleOffer_Type">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_Type') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_Type') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_Type']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyArea">Powierzchnia nieruchomości</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyArea" id="WWAC_Archives_SingleOffer_propertyArea">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyArea') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyArea') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyArea']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyYearBuilt">Rok budowy</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyYearBuilt" id="WWAC_Archives_SingleOffer_propertyYearBuilt">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyYearBuilt') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyYearBuilt') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyYearBuilt']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyFloor">Piętro</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyFloor" id="WWAC_Archives_SingleOffer_propertyFloor">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyFloor') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyFloor') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyFloor']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyFloors">Liczba pięter</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyFloors" id="WWAC_Archives_SingleOffer_propertyFloors">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyFloors') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyFloors') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyFloors']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyGarage">Garaż</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyGarage" id="WWAC_Archives_SingleOffer_propertyGarage">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyGarage') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyGarage') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyGarage']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyParkingSpacesNo">Miejsca parkingowe</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyParkingSpacesNo" id="WWAC_Archives_SingleOffer_propertyParkingSpacesNo">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyParkingSpacesNo') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyParkingSpacesNo') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyParkingSpacesNo']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyRooms">Liczba pokoi</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyRooms" id="WWAC_Archives_SingleOffer_propertyRooms">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyRooms') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyRooms') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyRooms']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_propertyElevator">Winda</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_propertyElevator" id="WWAC_Archives_SingleOffer_propertyElevator">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyElevator') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_propertyElevator') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_propertyElevator']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_SingleOffer_mortgageMarket">Rynek</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_SingleOffer_mortgageMarket" id="WWAC_Archives_SingleOffer_mortgageMarket">
									<option value="0" <?php echo (get_option('WWAC_Archives_SingleOffer_mortgageMarket') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_SingleOffer_mortgageMarket') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_SingleOffer_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_SingleOffer_mortgageMarket']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
					</tbody>
				</table>
				
				<?php submit_button(); ?>
			</form>
		</div>
		
		<div id="tab2" class="tab-pane">
			<?php
			$allSingleTemplates = $WWACCustomArchives -> getAllArchiveTemplates("all_offers");
			$activeSingleTemplate = $WWACCustomArchives -> getActiveArchiveTemplateInfo('all_offers');
			?>
			<h2>Archiwum nieruchomości</h2>
			<p>W tym miejscu możesz wybrać dostępny szablon listy wszystkich nieruchomości. Standardowo we wtyczce jest wgrany jeden szablon archiwum nieruchomości. Na podstawie tego szablonu można stworzyć własny. Zachęcamy do skorzystania z naszej oferty <a href="https://webist.pl/wtyczki/integracja-webist-wp-asari-crm/szablony-archiwum/" target="_blank">gotowych szablonów</a>. Należy także pamiętać o tym, że nie każdy szablon obsługuje podane opcje.</p>
			
			<h3>Dodaj szablon</h3>
			<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-archives&action=upload&atype=all#tab2" method="POST" enctype="multipart/form-data">
				<?php wp_nonce_field('WWAC_Archives_All_Upload', 'WWAC_Archives_All_Upload'); ?>
				<input type="file" name="WWAC_Archives_All_Upload_File" id="WWAC_Archives_All_Upload_File" accept=".zip" />
				<?php submit_button('Dodaj szablon archiwum', 'primary', 'submit', true, array('id' => 'WWAC_Archives_All_Upload_File_Button')); ?>
			</form>
			
			<h3>Szablon</h3>
			<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-archives&action=save&atype=all#tab2" method="POST">
				<?php wp_nonce_field('WWAC_Archives_All_Save', 'WWAC_Archives_All_Save'); ?>
				<table class="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_Template">Szablon pojedynczej oferty</label>
							</th>
								
							<td>
								<select name="WWAC_Archives_AllOffers_Template" id="WWAC_Archives_AllOffers_Template">
								<?php
								foreach($allSingleTemplates as $singleTemplate){
									if(!$singleTemplate['broken']){
									?>
									<option value="<?php echo $singleTemplate['item'].":".$singleTemplate['type']; ?>" <?php echo (!strcmp($singleTemplate['item'], get_option('WWAC_Archives_AllOffers_Template'))) ? 'selected' : ''; ?>><?php echo (!strcmp($singleTemplate['type'], 'external')) ? $singleTemplate['name'].' (upload)' : $singleTemplate['name'] ; ?></option>
									<?php
									}
								}
								?>
								</select>
							</td>
						</tr>
							
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_TemplateStatus">Włączyć na stronie?</label>
							</th>
								
							<td>
								<select name="WWAC_Archives_AllOffers_TemplateStatus" id="WWAC_Archives_AllOffers_TemplateStatus">
									<option value="0" <?php echo ((int) get_option('WWAC_Archives_AllOffers_TemplateStatus') == 0) ? 'selected' : ''; ?>>Nie</option>
									<option value="1" <?php echo ((int) get_option('WWAC_Archives_AllOffers_TemplateStatus') == 1) ? 'selected' : ''; ?>>Tak</option>
								</select>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_TemplateHero">Sekcja Hero</label>
							</th>
								
							<td>
								<select name="WWAC_Archives_AllOffers_TemplateHero" id="WWAC_Archives_AllOffers_TemplateHero">
									<option value="0" <?php echo ((int) get_option('WWAC_Archives_AllOffers_TemplateHero') == 0) ? 'selected' : ''; ?>>Wyłączona</option>
									<option value="1" <?php echo ((int) get_option('WWAC_Archives_AllOffers_TemplateHero') == 1) ? 'selected' : ''; ?>>Włączona</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_hero']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
					</tbody>
				</table>
				
				<h3>Informacje o nieruchomości</h3>
				<p></p>
				
				<table class="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyPrice">Cena</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyPrice" id="WWAC_Archives_AllOffers_propertyPrice">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyPrice') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyPrice') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyPrice']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_Localization">Lokalizacja</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_Localization" id="WWAC_Archives_AllOffers_Localization">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_Localization') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_Localization') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_Localization']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_Category">Kategoria</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_Category" id="WWAC_Archives_AllOffers_Category">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_Category') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_Category') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_Category']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_Type">Typ</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_Type" id="WWAC_Archives_AllOffers_Type">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_Type') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_Type') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_Type']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyArea">Powierzchnia nieruchomości</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyArea" id="WWAC_Archives_AllOffers_propertyArea">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyArea') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyArea') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyArea']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyYearBuilt">Rok budowy</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyYearBuilt" id="WWAC_Archives_AllOffers_propertyYearBuilt">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyYearBuilt') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyYearBuilt') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyYearBuilt']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyFloor">Piętro</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyFloor" id="WWAC_Archives_AllOffers_propertyFloor">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyFloor') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyFloor') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyFloor']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyFloors">Liczba pięter</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyFloors" id="WWAC_Archives_AllOffers_propertyFloors">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyFloors') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyFloors') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyFloors']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyGarage">Garaż</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyGarage" id="WWAC_Archives_AllOffers_propertyGarage">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyGarage') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyGarage') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyGarage']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyParkingSpacesNo">Miejsca parkingowe</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyParkingSpacesNo" id="WWAC_Archives_AllOffers_propertyParkingSpacesNo">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyParkingSpacesNo') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyParkingSpacesNo') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyParkingSpacesNo']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyRooms">Liczba pokoi</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyRooms" id="WWAC_Archives_AllOffers_propertyRooms">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyRooms') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyRooms') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyRooms']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_propertyElevator">Winda</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_propertyElevator" id="WWAC_Archives_AllOffers_propertyElevator">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_propertyElevator') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_propertyElevator') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_propertyElevator']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
						
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_mortgageMarket">Rynek</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_mortgageMarket" id="WWAC_Archives_AllOffers_mortgageMarket">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_mortgageMarket') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_mortgageMarket') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_mortgageMarket']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
							
							<th scope="row">
								<label for="WWAC_Archives_AllOffers_excerpt">Krótki opis</label>
							</th>
							
							<td>
								<select name="WWAC_Archives_AllOffers_excerpt" id="WWAC_Archives_AllOffers_excerpt">
									<option value="0" <?php echo (get_option('WWAC_Archives_AllOffers_excerpt') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_AllOffers_excerpt') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_AllOffers_Supports"><?php echo ($activeSingleTemplate['usable_settings']['WWAC_Archives_AllOffers_excerpt']) ? '<span style="color: green;">Template obsługuje</span>' : '<span style="color: red;">Template nie obsługuje</span>' ?></small>
							</td>
						</tr>
					</tbody>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		
		<div id="tab3" class="tab-pane active">
			<?php
			$allAgentTemplates = $WWACCustomArchives->getAllArchiveTemplates("agent");
			$activeAgentTemplate = $WWACCustomArchives->getActiveArchiveTemplateInfo('agent');
			?>
			
			<h2>Agent</h2>
			<p>W tym miejscu możesz wybrać dostępny szablon archiwum agenta. Na podstawie tego szablonu można stworzyć własny.</p>
			
			<h3>Dodaj szablon agenta</h3>
			<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-archives&action=upload&atype=agent" method="POST" enctype="multipart/form-data">
				<?php wp_nonce_field('WWAC_Archives_Agent_Upload', 'WWAC_Archives_Agent_Upload'); ?>
				<input type="file" name="WWAC_Archives_Agent_Upload_File" id="WWAC_Archives_Agent_Upload_File" accept=".zip" />
				<?php submit_button('Dodaj szablon agenta', 'primary', 'submit', true, array('id' => 'WWAC_Archives_Agent_Upload_File_Button')); ?>
			</form>
			
			<h3>Szablon archiwum agenta</h3>
			<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-archives&action=save&atype=agent" method="POST">
				<?php wp_nonce_field('WWAC_Archives_Agent_Save', 'WWAC_Archives_Agent_Save'); ?>
				
				<table class="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label for="WWAC_Archives_Agent_Template">Szablon agenta</label>
							</th>
							<td>
								<select name="WWAC_Archives_Agent_Template" id="WWAC_Archives_Agent_Template">
									<?php
									foreach($allAgentTemplates as $agentTemplate){
										if(!$agentTemplate['broken']){
										?>
										<option value="<?php echo $agentTemplate['item'].":".$agentTemplate['type']; ?>" 
											<?php echo (!strcmp($agentTemplate['item'], get_option('WWAC_Archives_Agent_Template'))) ? 'selected' : ''; ?>>
											<?php echo (!strcmp($agentTemplate['type'], 'external')) ? $agentTemplate['name'].' (upload)' : $agentTemplate['name']; ?>
										</option>
										<?php
										}
									}
									?>
								</select>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_TemplateStatus">Włączyć na stronie?</label></th>
							<td>
								<select name="WWAC_Archives_Agent_TemplateStatus" id="WWAC_Archives_Agent_TemplateStatus">
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_TemplateStatus') == 1) ? 'selected' : ''; ?>>Nie</option>
									<option value="2" <?php echo (get_option('WWAC_Archives_Agent_TemplateStatus') == 2) ? 'selected' : ''; ?>>Tak</option>
								</select>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_TemplateHero">Sekcja Hero</label></th>
							<td>
								<select name="WWAC_Archives_Agent_TemplateHero" id="WWAC_Archives_Agent_TemplateHero">
									<option value="0" <?php echo ((int)get_option('WWAC_Archives_Agent_TemplateHero') == 0) ? 'selected' : ''; ?>>Wyłączona</option>
									<option value="1" <?php echo ((int)get_option('WWAC_Archives_Agent_TemplateHero') == 1) ? 'selected' : ''; ?>>Włączona</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_hero']) 
										? '<span style="color: green;">Template obsługuje</span>' 
										: '<span style="color: red;">Template nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
					</tbody>
				</table>
				
				<h3>Informacje o agencie</h3>
				<p>Ustaw, jakie dane o agencie ma wyświetlać template.</p>
				
				<table class="form-table" role="presentation">
					<tbody>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_AgentPanel">Czy wyświetlać informacje o agencie?</label></th>
							<td>
								<select name="WWAC_Archives_Agent_AgentPanel" id="WWAC_Archives_Agent_AgentPanel">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_AgentPanel') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_AgentPanel') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_AgentPanel']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_AgentPhoto">Zdjęcie agenta</label></th>
							<td>
								<select name="WWAC_Archives_Agent_AgentPhoto" id="WWAC_Archives_Agent_AgentPhoto">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_AgentPhoto') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_AgentPhoto') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_AgentPhoto']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
							
							<th scope="row"><label for="WWAC_Archives_Agent_AgentLicenseNr">Numer licencji</label></th>
							<td>
								<select name="WWAC_Archives_Agent_AgentLicenseNr" id="WWAC_Archives_Agent_AgentLicenseNr">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_AgentLicenseNr') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_AgentLicenseNr') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_AgentLicenseNr']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_AgentNames">Imię i nazwisko</label></th>
							<td>
								<select name="WWAC_Archives_Agent_AgentNames" id="WWAC_Archives_Agent_AgentNames">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_AgentNames') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_AgentNames') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_AgentNames']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
							
							<th scope="row"><label for="WWAC_Archives_Agent_AgentPhoneNumbers">Numer telefonu</label></th>
							<td>
								<select name="WWAC_Archives_Agent_AgentPhoneNumbers" id="WWAC_Archives_Agent_AgentPhoneNumbers">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_AgentPhoneNumbers') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_AgentPhoneNumbers') == 1) ? 'selected' : ''; ?>>Wyświetlaj jeden</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_AgentPhoneNumbers']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_AgentEmailAddress">Adres e-mail</label></th>
							<td>
								<select name="WWAC_Archives_Agent_AgentEmailAddress" id="WWAC_Archives_Agent_AgentEmailAddress">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_AgentEmailAddress') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_AgentEmailAddress') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_AgentEmailAddress']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
					</tbody>
				</table>
				
				<h3>Informacje o nieruchomości</h3>
				<p>Ustaw, jakie dane ma wyświetlać template.</p>
				
				<table class="form-table" role="presentation">
					<tbody>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_propertyPrice">Cena</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyPrice" id="WWAC_Archives_Agent_propertyPrice">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyPrice') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyPrice') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyPrice']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
							
							<th scope="row"><label for="WWAC_Archives_Agent_Localization">Lokalizacja</label></th>
							<td>
								<select name="WWAC_Archives_Agent_Localization" id="WWAC_Archives_Agent_Localization">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_Localization') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_Localization') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_Localization']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_Category">Kategoria</label></th>
							<td>
								<select name="WWAC_Archives_Agent_Category" id="WWAC_Archives_Agent_Category">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_Category') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_Category') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_Category']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
							
							<th scope="row"><label for="WWAC_Archives_Agent_Type">Typ</label></th>
							<td>
								<select name="WWAC_Archives_Agent_Type" id="WWAC_Archives_Agent_Type">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_Type') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_Type') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_Type']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_propertyArea">Powierzchnia</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyArea" id="WWAC_Archives_Agent_propertyArea">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyArea') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyArea') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyArea']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
							
							<th scope="row"><label for="WWAC_Archives_Agent_propertyYearBuilt">Rok budowy</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyYearBuilt" id="WWAC_Archives_Agent_propertyYearBuilt">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyYearBuilt') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyYearBuilt') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyYearBuilt']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_propertyFloor">Piętro</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyFloor" id="WWAC_Archives_Agent_propertyFloor">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyFloor') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyFloor') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyFloor']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
							
							<th scope="row"><label for="WWAC_Archives_Agent_propertyFloors">Liczba pięter</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyFloors" id="WWAC_Archives_Agent_propertyFloors">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyFloors') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyFloors') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyFloors']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_propertyGarage">Garaż</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyGarage" id="WWAC_Archives_Agent_propertyGarage">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyGarage') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyGarage') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyGarage']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
							
							<th scope="row"><label for="WWAC_Archives_Agent_propertyParkingSpacesNo">Miejsca parkingowe</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyParkingSpacesNo" id="WWAC_Archives_Agent_propertyParkingSpacesNo">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyParkingSpacesNo') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyParkingSpacesNo') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyParkingSpacesNo']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_propertyRooms">Liczba pokoi</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyRooms" id="WWAC_Archives_Agent_propertyRooms">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyRooms') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyRooms') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyRooms']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
							
							<th scope="row"><label for="WWAC_Archives_Agent_propertyElevator">Winda</label></th>
							<td>
								<select name="WWAC_Archives_Agent_propertyElevator" id="WWAC_Archives_Agent_propertyElevator">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_propertyElevator') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_propertyElevator') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_propertyElevator']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
						<tr>
							<th scope="row"><label for="WWAC_Archives_Agent_mortgageMarket">Rynek</label></th>
							<td>
								<select name="WWAC_Archives_Agent_mortgageMarket" id="WWAC_Archives_Agent_mortgageMarket">
									<option value="0" <?php echo (get_option('WWAC_Archives_Agent_mortgageMarket') == 0) ? 'selected' : ''; ?>>Nie wyświetlaj</option>
									<option value="1" <?php echo (get_option('WWAC_Archives_Agent_mortgageMarket') == 1) ? 'selected' : ''; ?>>Wyświetlaj</option>
								</select>
								
								<small class="WWAC_Archives_Agent_Supports">
									<?php echo ($activeAgentTemplate['usable_settings']['WWAC_Archives_Agent_mortgageMarket']) 
										? '<span style="color: green;">Obsługuje</span>' : '<span style="color: red;">Nie obsługuje</span>'; ?>
								</small>
							</td>
						</tr>
						
					</tbody>
				</table>
				
				<?php submit_button(); ?>
			</form>
		</div>

	</div>
</div>

<script type="text/javascript">
jQuery(".sidebar").height(jQuery(".tab-titles").height());

document.addEventListener('DOMContentLoaded', function() {
	jQuery('#WWAC_Archives_Single_Upload_File_Button, #WWAC_Archives_All_Upload_File_Button, #WWAC_Archives_Agent_Upload_File_Button').prop('disabled', true);

	const tabTitles = document.querySelectorAll('.tab-titles li');
	const tabPanes = document.querySelectorAll('.tab-pane');
	
	function activateTab(tabId){
		tabTitles.forEach(item => item.classList.remove('active'));
		tabPanes.forEach(pane => pane.classList.remove('active'));

		const targetTitle = document.querySelector(`.tab-titles li[data-tab="${tabId}"]`);
		const targetPane = document.getElementById(tabId);

		if(targetTitle && targetPane){
			targetTitle.classList.add('active');
			targetPane.classList.add('active');
		}
	}

	tabTitles.forEach(title => {
		title.addEventListener('click', function(){
			event.preventDefault();
			const targetTab = this.getAttribute('data-tab');
			
			activateTab(targetTab);
			history.pushState(null, null, `#${targetTab}`);
		});
	});
	
	const currentHash = window.location.hash.substring(1);
	if(currentHash){
		activateTab(currentHash);
	}else{
		activateTab('tab1');
	}
});

jQuery('#WWAC_Archives_Single_Upload_File').on('change', function(){
	if(jQuery(this).val()){
		jQuery('#WWAC_Archives_Single_Upload_File_Button').prop('disabled', false);
	}else{
		jQuery('#WWAC_Archives_Single_Upload_File_Button').prop('disabled', true);
	}
});

jQuery('#WWAC_Archives_All_Upload_File').on('change', function(){
	if(jQuery(this).val()){
		jQuery('#WWAC_Archives_All_Upload_File_Button').prop('disabled', false);
	}else{
		jQuery('#WWAC_Archives_All_Upload_File_Button').prop('disabled', true);
	}
});

jQuery('#WWAC_Archives_Agent_Upload_File').on('change', function(){
	if(jQuery(this).val()){
		jQuery('#WWAC_Archives_Agent_Upload_File_Button').prop('disabled', false);
	}else{
		jQuery('#WWAC_Archives_Agent_Upload_File_Button').prop('disabled', true);
	}
});
</script>