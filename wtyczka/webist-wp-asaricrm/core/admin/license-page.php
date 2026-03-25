<?php 
$checkLicense = new checkLicense();

if(isSet($_GET['action'])){
	if( (isSet($_POST['license_save_nonce']) && wp_verify_nonce($_POST['license_save_nonce'], basename(__FILE__))) || (isSet($_GET['nonce']) && wp_verify_nonce($_GET['nonce'], basename(__FILE__)))){
		switch($_GET['action']){
			case 'check-license':
				if($checkLicense -> checkLicenseKey()){
					update_option('WWAC_ValidLicense', 2);
					echo '<div class="notice notice-success is-dismissible">
						<p>Klucz licencyjny wtyczki jest poprawny.</p>
					</div>';
				}else{
					update_option('WWAC_ValidLicense', 1);
					echo '<div class="notice notice-error is-dismissible">
						<p>Klucz licencyjny wtyczki jest niepoprawny.</p>
					</div>';
				}
				break;
			case 'save':
				if($_SERVER['REQUEST_METHOD'] == 'POST'){
					foreach($_POST as $key => $value){
						if(empty($value)){
							update_option($key, '');
							echo '<div class="notice notice-success is-dismissible">
								<p>Pomyślnie zapisano klucz licencyjny wtyczki.</p>
							</div>';
						}else{
							if(!strcmp($key, 'WWAC_LicenseKey')){
								if(update_option($key, sanitize_text_field($value)) || !strcmp($value, get_option($key))){
									echo '<div class="notice notice-success is-dismissible">
										<p>Pomyślnie zapisano klucz licencyjny wtyczki.</p>
									</div>';
								}else{
									echo '<div class="notice notice-error is-dismissible">
										<p>Nie udało się zapisać klucza licencyjnego wtyczki.</p>
									</div>';
								}
							}
						}
					}
				}
				break;
			default:
				break;
		}
	}else{
		echo '
		<div class="notice notice-error is-dismissible">
			<p>Suma nonce jest niepoprawna! Zaloguj się ponownie i spróbuj jeszcze raz.</p>
		</div>';
	}
}
?>
<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-license&action=save" method="POST">
	<?php
	$nonceField = wp_nonce_field(basename(__FILE__), 'license_save_nonce');
	$html = $nonceField;
	$dom = new DomDocument();
	$dom->loadHTML($html);
	$signuptoken = $dom->getElementById("license_save_nonce");
	$nonceValue = $signuptoken->getAttribute('value');
	?>
	<h2>Klucz</h2>
	<p>Podaj klucz licencyjny, aby móc w pełni korzystać z wtyczki.</p>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="apiType">Klucz licencyjny</label>
				</th>
				<td>
					<input type="text" name="WWAC_LicenseKey" id="emailAddress" class="regular-text ltr" placeholder="Twój klucz licencyjny" value="<?php echo get_option('WWAC_LicenseKey'); ?>"/>
				</td>
			</tr>
			<tr>
				<td>
					<a href="?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-license&action=check-license&nonce=<?php echo $nonceValue; ?>" class="button">Sprawdź licencje</a>
				</td>
				<td>
					<b>Status licencji:</b>
					<?php
					if(get_option('WWAC_ValidLicense') == 0){
						echo '<span style="color: orange;">nie sprawdzono</span>';
					}elseif(get_option('WWAC_ValidLicense') == 1){
						echo '<span style="color: red;">nie poprawny klucz licencyjny</span>';
					}else{
						echo '<span style="color: green;">poprawny klucz licencyjny</span>';
					}
					?>.
				</td>
			</tr>
		</tbody>
	</table>
	
	<?php submit_button(); ?>
</form>