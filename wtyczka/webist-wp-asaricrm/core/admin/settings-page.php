<?php 
if(isSet($_GET['action'])){
	if((isSet($_POST['settings_save_nonce']) && wp_verify_nonce($_POST['settings_save_nonce'], basename(__FILE__))) || (isSet($_GET['nonce']) && wp_verify_nonce($_GET['nonce'], basename(__FILE__)))){
		switch($_GET['action']){
			case 'test-connection':
				if(FlovWPAsariCRM::WWACTestConnection()){
					echo '<div class="notice notice-success is-dismissible">
						<p>Test połączenia przebiegł pomyślnie.</p>
					</div>';
					update_option('WWAC_AsariConnectionStatus', 2);
				}else{
					echo '<div class="notice notice-error is-dismissible">
						<p>Nie udało się połączyć z Asari.</p>
					</div>';
					update_option('WWAC_AsariConnectionStatus', 1);
				}
				break;
			case 'save':
				if($_SERVER['REQUEST_METHOD'] == 'POST'){
					foreach($_POST as $key => $value){
						if(empty($value)){
							update_option($key, '');
						}else{
							update_option($key, sanitize_text_field($value));
						}
					}
					echo '<div class="notice notice-success is-dismissible">
						<p>Zaktualizowano ustawienia.</p>
					</div>';
				}else{
					echo '<div class="notice notice-error is-dismissible">
						<p>Nie udało się zaktualizować ustawień.</p>
					</div>';
				}
				break;
			default:
				break;
		}
	}else{
		echo '<div class="notice notice-error is-dismissible">
			<p>Błąd sumy nonce.</p>
		</div>';
	}
}
?>
<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-settings&action=save" method="POST">
	<?php
	$nonceField = wp_nonce_field(basename(__FILE__), 'settings_save_nonce');
	$html = $nonceField;
	$dom = new DomDocument();
	$dom->loadHTML($html);
	$signuptoken = $dom->getElementById("settings_save_nonce");
	$nonceValue = $signuptoken->getAttribute('value');
	?>
	<h2>Rodzaj API</h2>
	<p>Wybierz rodzaj API, przez które chcesz się połączyć z Asari CRM. <b>Uwaga!</b> przed testowaniem połączenia wpisz klucz Asari CRM oraz klucz licencyjny!</p>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="apiType">Rodzaj API</label>
				</th>
				<td>
					<select name="WWAC_AsariAPIType" id="apiType" class="regular-text ltr">
						<?php
						echo (empty(get_option('WWAC_AsariAPIType'))) ? '<option value="">Nie wybrano</option>' : '';
						?>
						<option value="apiasaripro" <?php echo (!strcmp('apiasaripro', get_option('WWAC_AsariAPIType'))) ? 'selected' : ''; ?>>api.asari.pro</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>
					<a href="?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-settings&action=test-connection&nonce=<?php echo $nonceValue; ?>" class="button">Testuj połączenie</a>
				</td>
				<td>
					<b>Status:</b> <?php if(get_option('WWAC_AsariConnectionStatus') == 0){echo '<span style="color: orange;">nie sprawdzono</span>';}elseif(get_option('WWAC_AsariConnectionStatus') == 1){echo '<span style="color: red;">nie połączono</span>';}else{echo '<span style="color: green;">połączono</span>';} ?>.
				</td>
			</tr>
		</tbody>
	</table>
	
	<h2>Ustawienia aktualizatora</h2>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="WWAC_Updater_RefreshRate">Ilość odświeżanych ofert</label>
				</th>
				<td>
					<input type="number" name="WWAC_Updater_RefreshRate" id="WWAC_Updater_RefreshRate" class="regular-text ltr" placeholder="Ilość ofert" value="<?php echo get_option('WWAC_Updater_RefreshRate'); ?>" style="width: 25em;">
							
					<p>Tutaj ustawić ilość odświeżanych ofert co jedno uruchomienie skryptu. Standardowo jest to 25, ale liczbę można dostosować do potrzeb oraz możliwości strony i serwera.</p>
				</td>
			</tr>
					
			<tr>
				<th scope="row">
					<label for="WWAC_Updater_FlushCache">Czyszczenie cache</label>
				</th>
				<td>
					<select name="WWAC_Updater_FlushCache" id="WWAC_Updater_FlushCache" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_Updater_FlushCache') == 1) ? 'selected' : ''; ?>>Nie, nie czyść</option>
						<option value="2" <?php echo (get_option('WWAC_Updater_FlushCache') == 2) ? 'selected' : ''; ?>>Tak, czyść</option>
					</select>
							
					<p>Jeśli opcja czyszczenia pamięci podręcznej jest włączona to wtyczka będzie próbować wyczyścić ją podczas aktualizacji ofert. Zostanie to wykonane przed dodawaniem ofert do WordPress'a (na samym początku).</p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_UpdaterSpeedMode">Tryb zoptymalizowany</label>
				</th>
				<td>
					<select name="WWAC_UpdaterSpeedMode" id="WWAC_UpdaterSpeedMode" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_UpdaterSpeedMode') == 1) ? 'selected' : ''; ?>>Tryb zwykły</option>
						<option value="2" <?php echo (get_option('WWAC_UpdaterSpeedMode') == 2) ? 'selected' : ''; ?>>Tryb zoptymalizowany</option>
					</select>
							
					<p><i>Tryb zwykły</i> to standardowy tryb pobierania ofert. <i>Tryb zoptymalizowany</i> podczas aktualizacji ofert wyłącza niektóre opcje WordPress'a co pozwala zaoszczędzić na CPU. Funkcje te są włączane ponownie po aktualizacji.</p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_Updater_AutoCall">Automatyczne wywołanie</label>
				</th>
				<td>
					<select name="WWAC_Updater_AutoCall" id="WWAC_Updater_AutoCall" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_Updater_AutoCall') == 1) ? 'selected' : ''; ?>>Wyłączone</option>
						<option value="2" <?php echo (get_option('WWAC_Updater_AutoCall') == 2) ? 'selected' : ''; ?>>Włączone</option>
					</select>
							
					<p>Jeśli automatyczne wywołanie jest włączone to przy uruchomieniu skryptu będzie on wywoływał sam siebie automatycznie, aż do ukończenia pobierania wszystkich ofert. Jeśli nie to skrypt pobierze przy jednorazowym uruchomieniu <?php echo get_option('WWAC_Updater_RefreshRate'); ?> ofert.</p>
				</td>
			</tr>
		</tbody>
	</table>
	
	<h2>Pobieranie informacji</h2>
	<p>Tutaj ustawisz w jaki sposób i jakie informacje mają zostać zapisane wewnątrz strony.</p>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="WWAC_downloadImages">Pobieranie obrazów</label>
				</th>
				<td>
					<select name="WWAC_downloadImages" id="WWAC_downloadImages" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_downloadImages') == 1) ? 'selected' : ''; ?>>Nie pobieraj</option>
						<option value="2" <?php echo (get_option('WWAC_downloadImages') == 2) ? 'selected' : ''; ?>>Pobieraj</option>
					</select>
					
					<p><b>UWAGA!</b> Proces pobierania obrazów zazwyczaj pochłania więcej zasobów niż zwykłe funkcjonowanie strony. Istnieje możliwość, że skrypt nie pobierze wszystkich obrazów/nieruchomości. Jest to zależne od serwera, na którym jest strona oraz serwerów ASARI (ograniczenia API). Jeśli skrypt nie pobiera obrazów, proszę wyłączyć opcję pobierania obrazów.</p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_agentInfo">Informacje o agencie</label>
				</th>
				<td>
					<select name="WWAC_agentInfo" id="WWAC_agentInfo" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_agentInfo') == 1) ? 'selected' : ''; ?>>Agent nieruchomości</option>
						<option value="2" <?php echo (get_option('WWAC_agentInfo') == 2) ? 'selected' : ''; ?>>Menadżer agenta (podwładny)</option>
						<option value="3" <?php echo (get_option('WWAC_agentInfo') == 3) ? 'selected' : ''; ?>>Autor oferty</option>
					</select>
					
					<p>Opcja "<b>Agent nieruchomości</b>" pozwala na pobranie głównej osoby odpowiedzialnej za nieruchomość. Wybranie opcji "<b>Menadżer agenta (podwładny)</b>" oznacza pobranie i zapisanie informacji o osobie, która została wybrana przez podwładnego agenta nieruchomości. W przypadku wybrania opcji "<b>Autor oferty</b>" wtyczka pobierze informacje o agencie, który utworzył ofertę w systemie Asari (użytkownik).</p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_updateDownloadAgentImage">Zdjęcie agenta</label>
				</th>
				<td>
					<select name="WWAC_updateDownloadAgentImage" id="WWAC_updateDownloadAgentImage" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_updateDownloadAgentImage') == 1) ? 'selected' : ''; ?>>Pobieraj</option>
						<option value="2" <?php echo (get_option('WWAC_updateDownloadAgentImage') == 2) ? 'selected' : ''; ?>>Nie pobieraj</option>
					</select>
					
					<p>Wybierz, czy zdjęcie agenta ma być pobierane z serwerów CRM'a.</p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_updateListingsType">Zasięg pobierania nieruchomości</label>
				</th>
				<td>
					<select name="WWAC_updateListingsType" id="WWAC_updateListingsType" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_updateListingsType') == 1) ? 'selected' : ''; ?>>Centrala</option>
						<option value="2" <?php echo (get_option('WWAC_updateListingsType') == 2) ? 'selected' : ''; ?>>Wszystko</option>
					</select>
					
					<p>Wybierz, czy nieruchomości mają być pobieranie tylko z centrali, czy raczej wszystkie udostępnione poprzez system Asari.</p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_updateListingsParameters">Parametry pobierania nieruchomości</label>
				</th>
				<td>
					<select name="WWAC_updateListingsParameters" id="WWAC_updateListingsParameters" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_updateListingsParameters') == 1) ? 'selected' : ''; ?>>Brak</option>
						<option value="2" <?php echo (get_option('WWAC_updateListingsParameters') == 2) ? 'selected' : ''; ?>>Sprzedane/wynajęte (closedDays)</option>
						<option value="3" <?php echo (get_option('WWAC_updateListingsParameters') == 3) ? 'selected' : ''; ?>>Zamknięte (blockedDays)</option>
					</select>
					
					<p>Wybierz, czy wtyczka ma pobierać dodatkowo (oprócz aktywnych) oferty <b>Sprzedane/wynajęte</b> lub <b>Zamknięte</b>.</p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_updateListingsParametersDays">Zasięg dni wstecz</label>
				</th>
				<td>
					<input type="number" name="WWAC_updateListingsParametersDays" id="WWAC_updateListingsParametersDays" class="regular-text ltr" placeholder="Ilość dni" value="<?php echo (int) get_option('WWAC_updateListingsParametersDays'); ?>" min="1">
					
					<p>Wpisz, zasięg dni pobierania ofert (<b>Sprzedane/wynajęte</b> lub <b>Zamknięte</b>) wstecz od <?php echo date("d-m-Y"); ?>.</p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_updateContentShortcodes">Shortcode w opisie nieruchomości</label>
				</th>
				<td>
					<select name="WWAC_updateContentShortcodes" id="WWAC_updateContentShortcodes" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_updateContentShortcodes') == 1) ? 'selected' : ''; ?>>Nie</option>
						<option value="2" <?php echo (get_option('WWAC_updateContentShortcodes') == 2) ? 'selected' : ''; ?>>Tak</option>
					</select>
					
					<p>Wybierz, czy do opisu nieruchomości mają być dodawane shortcode związane z galerią oraz mapą.</p>
				</td>
			</tr>
		</tbody>
	</table>
	
	<h2>Wyświetlanie</h2>
	<p>Wybierz w jaki sposób mają się zapisywać posty (np. tytuł).</p>
	<h3>Tytuł</h3>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="titleType">Rodzaj tytułu</label>
				</th>
				<td>
					<select name="WWAC_TitleType" id="titleType" class="regular-text ltr">
						<option value="9" <?php echo (get_option('WWAC_TitleType') == 9) ? 'selected' : ''; ?>>Bez zmian</option>
						<!--<option value="1" <?php echo (get_option('WWAC_TitleType') == 1) ? 'selected' : ''; ?>>Tytuł ogłoszenia</option>-->
						<!--<option value="2" <?php echo (get_option('WWAC_TitleType') == 2) ? 'selected' : ''; ?>>Tytuł Ogłoszenia</option>-->
						<option value="3" <?php echo (get_option('WWAC_TitleType') == 3) ? 'selected' : ''; ?>>tytuł ogłoszenia</option>
						<option value="4" <?php echo (get_option('WWAC_TitleType') == 4) ? 'selected' : ''; ?>>TYTUŁ OGŁOSZENIA</option>
					</select>
				</td>
			</tr>
		</tbody>
	</table>
	
	<h3>ID posta</h3>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="WWAC_TitleIDType">ID nieruchomości w tytule</label>
				</th>
				<td>
					<select name="WWAC_TitleIDType" id="WWAC_TitleIDType" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_TitleIDType') == 1) ? 'selected' : ''; ?>>Tytuł bez ID</option>
						<option value="2" <?php echo (get_option('WWAC_TitleIDType') == 2) ? 'selected' : ''; ?>>Tytuł #000000</option>
						<option value="3" <?php echo (get_option('WWAC_TitleIDType') == 3) ? 'selected' : ''; ?>>Tytuł (#000000)</option>
						<option value="4" <?php echo (get_option('WWAC_TitleIDType') == 4) ? 'selected' : ''; ?>>Tytuł [#000000]</option>
						<option value="5" <?php echo (get_option('WWAC_TitleIDType') == 5) ? 'selected' : ''; ?>>Tytuł 000000</option>
						<option value="6" <?php echo (get_option('WWAC_TitleIDType') == 6) ? 'selected' : ''; ?>>Tytuł (000000)</option>
						<option value="7" <?php echo (get_option('WWAC_TitleIDType') == 7) ? 'selected' : ''; ?>>Tytuł [000000]</option>
						<option value="8" <?php echo (get_option('WWAC_TitleIDType') == 8) ? 'selected' : ''; ?>>#000000 Tytuł</option>
						<option value="9" <?php echo (get_option('WWAC_TitleIDType') == 9) ? 'selected' : ''; ?>>(#000000) Tytuł</option>
						<option value="10" <?php echo (get_option('WWAC_TitleIDType') == 10) ? 'selected' : ''; ?>>[#000000] Tytuł</option>
						<option value="11" <?php echo (get_option('WWAC_TitleIDType') == 11) ? 'selected' : ''; ?>>000000 Tytuł</option>
						<option value="12" <?php echo (get_option('WWAC_TitleIDType') == 12) ? 'selected' : ''; ?>>(000000) Tytuł</option>
						<option value="13" <?php echo (get_option('WWAC_TitleIDType') == 13) ? 'selected' : ''; ?>>[000000] Tytuł</option>
					</select>
				</td>
			</tr>
		</tbody>
	</table>
	
	<h3>Galeria</h3>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="WWAC_GalleryType">Galeria zdjęć nieruchomości</label>
				</th>
				<td>
					<select name="WWAC_GalleryType" id="WWAC_GalleryType" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_GalleryType') == 1) ? 'selected' : ''; ?>>Na początku oferty</option>
						<option value="2" <?php echo (get_option('WWAC_GalleryType') == 2) ? 'selected' : ''; ?>>Na końcu oferty</option>
						<option value="3" <?php echo (get_option('WWAC_GalleryType') == 3) ? 'selected' : ''; ?>>Brak</option>
					</select>
				</td>
			</tr>
		</tbody>
	</table>
	
	<h3>Mapa</h3>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="WWAC_Map">Mapa nieruchomości</label>
				</th>
				<td>
					<select name="WWAC_Map" id="WWAC_Map" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_Map') == 1) ? 'selected' : ''; ?>>Wyłączona</option>
						<option value="2" <?php echo (get_option('WWAC_Map') == 2) ? 'selected' : ''; ?>>Na końcu opisu</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_PropertyMapZoom">Przybliżenie mapy</label>
				</th>
				<td>
					<input type="number" name="WWAC_PropertyMapZoom" id="WWAC_PropertyMapZoom" class="regular-text ltr" value="<?php echo get_option('WWAC_PropertyMapZoom'); ?>" />
				</td>
			</tr>
		</tbody>
	</table>
	
	<h3>Cena</h3>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="WWAC_PriceType">Typ ceny</label>
				</th>
				<td>
					<select name="WWAC_PriceType" id="WWAC_PriceType" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_PriceType') == 1) ? 'selected' : ''; ?>>1000000.99 złotych</option>
						<option value="2" <?php echo (get_option('WWAC_PriceType') == 2) ? 'selected' : ''; ?>>1,000,000.99 złotych</option>
						<option value="3" <?php echo (get_option('WWAC_PriceType') == 3) ? 'selected' : ''; ?>>1.000.000,99 złotych</option>
						<option value="4" <?php echo (get_option('WWAC_PriceType') == 4) ? 'selected' : ''; ?>>100000 złotych (bez groszy)</option>
						<option value="5" <?php echo (get_option('WWAC_PriceType') == 5) ? 'selected' : ''; ?>>100 000 złotych (bez groszy)</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="WWAC_PriceTypeSQM">Typ ceny za m<sup>2</sup></label>
				</th>
				<td>
					<select name="WWAC_PriceTypeSQM" id="WWAC_PriceTypeSQM" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_PriceTypeSQM') == 1) ? 'selected' : ''; ?>>1000000.99 złotych</option>
						<option value="2" <?php echo (get_option('WWAC_PriceTypeSQM') == 2) ? 'selected' : ''; ?>>1,000,000.99 złotych</option>
						<option value="3" <?php echo (get_option('WWAC_PriceTypeSQM') == 3) ? 'selected' : ''; ?>>1.000.000,99 złotych</option>
						<option value="4" <?php echo (get_option('WWAC_PriceTypeSQM') == 4) ? 'selected' : ''; ?>>100000 złotych (bez groszy)</option>
						<option value="5" <?php echo (get_option('WWAC_PriceTypeSQM') == 5) ? 'selected' : ''; ?>>100 000 złotych (bez groszy)</option>
					</select>
				</td>
			</tr>
		</tbody>
	</table>
	
	<h3>Stopka ogłoszenia</h3>
	<p>Do każdego ogłoszenia możesz dodać stopkę w postaci wybranych pól poniżej. Pola nie uzupełnione nie wyświetlają się.</p>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="footerStatus">Włączyć stopkę?</label>
				</th>
				<td>
					<select name="WWAC_FooterStatus" id="footerStatus" class="regular-text ltr">
						<option value="1" <?php echo (get_option('WWAC_FooterStatus') == 1) ? 'selected' : ''; ?>>Nie</option>
						<option value="2" <?php echo (get_option('WWAC_FooterStatus') == 2) ? 'selected' : ''; ?>>Tak</option>
					</select>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="nameNSurname">Imię i nazwisko/nazwa firmy</label>
				</th>
				<td>
					<input type="text" name="WWAC_Footer_Name" id="nameNSurname" class="regular-text ltr" placeholder="Imię i nazwisko lub nazwa firmy" value="<?php echo get_option('WWAC_Footer_Name'); ?>"/>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="officeAddress">Adres biura</label>
				</th>
				<td>
					<input type="text" name="WWAC_Footer_Address" id="officeAddress" class="regular-text ltr" placeholder="Adres fizyczny biura" value="<?php echo get_option('WWAC_Footer_Address'); ?>"/>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="phoneNumber">Numer telefonu</label>
				</th>
				<td>
					<input type="tel" name="WWAC_Footer_PhoneNumber" id="phoneNumber" class="regular-text ltr" placeholder="Numer telefonu" value="<?php echo get_option('WWAC_Footer_PhoneNumber'); ?>"/>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="emailAddress">Adres e-mail</label>
				</th>
				<td>
					<input type="email" name="WWAC_Footer_Email" id="emailAddress" class="regular-text ltr" placeholder="Adres e-mail" value="<?php echo get_option('WWAC_Footer_Email'); ?>"/>
				</td>
			</tr>
		</tbody>
	</table>
		
	<?php submit_button(); ?>
</form>