<?php
$postsInfo = FlovWPAsariCRM::WWACGetCustomPostTypeInfo(); 
if(isSet($_GET['action'])){
	if(isset($_GET['_wpnonce']) && wp_verify_nonce($_GET['_wpnonce'], 'reset_settings_nonce')){
		switch($_GET['action']){
			case 'reset-to-default':
				try{
					FlovWPAsariCRM::WWACResetOptions();
					echo '<div class="notice notice-success is-dismissible">
						<p>Pomyślnie zresetowano ustawienia wtyczki.</p>
					</div>';
				}catch(Exception $e){
					echo '<div class="notice notice-warning is-dismissible">
						<p>Nie udało się zresetować ustawień wtyczki.</p>
					</div>';
				}
				break;
			default:
				break;
		}
	}
}
?>
<div class="row">
	<div class="column">
		<h2 class="column-title">Webist WP Asari CRM</h2>
		<p>
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
						<label for="footerStatus">Prywantych postów</label>
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
		</p>
	</div>
	
	<div class="column">
		<h2 class="column-title">Klucz Asari CRM</h2>
		<p>
			<table style="width: 100%; text-align: justify;">
				<tr>
					<th scope="row">
						<label for="footerStatus">userID</label>
					</th>
					<td>
						<?php echo WWAC_ASARI_USERID; ?>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="footerStatus">siteToken</label>
					</th>
					<td>
						<?php echo (!empty(WWAC_ASARI_SITETOKEN)) ? substr_replace(substr(WWAC_ASARI_SITETOKEN, 0, -5), '', -20).'********************' : ''; ?>
					</td>
				</tr>
			</table>
			<center>
				<a href="<?php echo wp_nonce_url(WWAC_PLUGIN_DIR_URL."update-offers.php", 'update_offers'); ?>" target="_blank" class="button">Odśwież oferty ręcznie</a><br>
				<a href="?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-asari-key">Przejdź do zarządzania tymi danymi</a>
			</center>
		</p>
	</div>
	
	<div class="column">
		<h2 class="column-title">Licencja</h2>
		<table style="width: 100%; text-align: justify;">
				<tr>
					<th scope="row">
						<label for="footerStatus">Klucz licencyjny</label>
					</th>
					<td>
						<?php echo (!empty(get_option('WWAC_LicenseKey'))) ? substr_replace(substr(get_option('WWAC_LicenseKey'), 0, -5), '', -10).'***************' : ''; ?>
					</td>
				</tr>
			</table>
		<?php
		if(get_option('WWAC_ValidLicense') > 1){
		?>
		<p>Klucz licencyjny <b style="color: green;">jest poprawny</b>.</p>
		<?php
		}elseif(get_option('WWAC_ValidLicense') == 1){
		?>
		<p>Klucz licencyjny <b style="color: red;">nie jest poprawny</b>.</p>
		<?php
		}elseif(get_option('WWAC_ValidLicense') == 0){
		?>
		<p>Klucz licencyjny <b style="color: orange;">nie został sprawdzony</b>.</p>
		<?php
		}
		?>
	</div>
</div>

<div class="row">
	<div class="column">
		<h2 class="column-title">Wymagania wtyczki</h2>
		<?php
		if(!empty(WWAC_API_TYPE) && WWAC_ASARI_CONNECTION_STATUS > 1 && !empty(WWAC_ASARI_USERID) && !empty(WWAC_ASARI_SITETOKEN) && isSSL() && get_option('WWAC_ValidLicense')){
			?>
			<center><div class="dashicons dashicons-saved"></div></center>
			<p><center>Wszystkie wymagania zostały spełnione!</center></p>
			<?php
		}else{
			?>
			<center><div class="dashicons dashicons-no-alt"></div></center><br>
			Wymagania nie zostały spełnione. Przejdź do zakładki "<a href="?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-req">Wymagania</a>" i sprawdź co należy skonfigurować.
			<?php
		}
		?>
		<p></p>
	</div>
	
	<div class="column">
		<h2 class="column-title">Wstępne ustawienia</h2>
		<p>Skorzystaj z wstępnych (już gotowych) ustawień wtyczki, a następnie dopasuj je do swoich wymagań. Pamiętaj, że zawsze możesz zresetować swoje ustawienia.</p>
		<p class="option"><a href="#" class="button">Uruchom</a></p>
	</div>
	
	<div class="column">
		<h2 class="column-title">Reset ustawień</h2>
		<p>Jeśli potrzebujesz zresetować swoje ustawienia do ustawień fabrycznych, kliknij przycisk poniżej. <b>UWAGA!</b> Operacja jest nieodwracalna.</p>
		<p class="option"><a href="<?php echo wp_nonce_url('?page='.WWAC_PLUGIN_MENU_SLUG.'&action=reset-to-default', 'reset_settings_nonce'); ?>" class="button">Resetuj ustawienia</a></p>
	</div>
</div>