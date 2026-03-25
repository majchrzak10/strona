<?php
$isSSLActive = isSSL();
$iscURLActive = extension_loaded('curl');
?>
<h2>Wymagania wtyczki</h2>
<p>Sprawdź, czy twoja strona spełnia wymagania wtyczki. Wszystkie dane podane poniżej to minimum niezbędne do działania wtyczki.</p>

<table class="widefat fixed" cellspacing="0">
	<thead>
		<tr>
			<th id="cb" class="manage-column column-cb" scope="col">Nazwa wymagania</th>
			<th id="minimum" class="manage-column column-minimum" scope="col">Minimalne</th>
			<th id="available" class="manage-column column-available" scope="col">Dostępne</th>
			<th id="status" class="manage-column column-status" scope="col">Status</th>
		</tr>
	</thead>
				
	<tfoot>
		<tr>
			<th id="cb" class="manage-column column-cb" scope="col">Nazwa wymagania</th>
			<th id="minimum" class="manage-column column-minimum" scope="col">Minimalne</th>
			<th id="available" class="manage-column column-available" scope="col">Dostępne</th>
			<th id="status" class="manage-column column-status" scope="col">Status</th>
		</tr>
	</tfoot>
				
	<tbody>
		<tr class="alternate">
			<th class="check-column" scope="row">SSL</th>
			<td class="column-minimum">Włączony</td>
			<td class="column-available"><?php echo ($isSSLActive) ? '<span style="color: green;">Włączony</span>' : '<span style="color: red;">Wyłączony</span>' ; ?></td>
			<td class="column-status"><?php echo ($isSSLActive) ? '<span class="dashicons dashicons-yes-alt" style="color: green;"></span>' : '<span class="dashicons dashicons-dismiss" style="color: red;"></span>' ; ?></td>
		</tr>
		
		<tr>
			<th class="check-column" scope="row">Wersja PHP</th>
			<td class="column-minimum">8.1</td>
			<td class="column-available"><?php echo phpversion(); ?></td>
			<td class="column-status"><?php echo (version_compare('8.1', phpversion(), '>')) ? '<span class="dashicons dashicons-dismiss" style="color: red;"></span>' : '<span class="dashicons dashicons-yes-alt" style="color: green;"></span>'; ?></td>
		</tr>
		
		<tr class="alternate">
			<th class="check-column" scope="row">Obsługa cURL</th>
			<td class="column-minimum">Włączona</td>
			<td class="column-available"><?php echo ($iscURLActive) ? '<span style="color: green;">Włączona</span>' : '<span style="color: red;">Wyłączona</span>' ; ?></td>
			<td class="column-status"><?php echo ($iscURLActive) ? '<span class="dashicons dashicons-yes-alt" style="color: green;"></span>' : '<span class="dashicons dashicons-dismiss" style="color: red;"></span>' ; ?></td>
		</tr>
		
		<tr>
			<th class="check-column" scope="row">Klucz licencyjny</th>
			<td class="column-minimum">Poprawny</td>
			<td class="column-available">
				<?php
				if(get_option('WWAC_ValidLicense') == 0){
					echo '<span style="color: orange;">Nie sprawdzono</span>';
				}elseif(get_option('WWAC_ValidLicense') == 1){
					echo '<span style="color: red;">Nie poprawny</span>';
				}else{
					echo '<span style="color: green;">Poprawny</span>';
				}
				?>
			</td>
			<td class="column-status">
			<?php
				if(get_option('WWAC_ValidLicense') == 0 || get_option('WWAC_ValidLicense') == 1){
					echo '<span class="dashicons dashicons-dismiss" style="color: red;"></span>';
				}else{
					echo '<span class="dashicons dashicons-yes-alt" style="color: green;"></span>';
				}
				?>
			</td>
		</tr>
		
		<tr class="alternate">
			<th class="check-column" scope="row">Połączenie Asari CRM</th>
			<td class="column-minimum">Włączona</td>
			<td class="column-available">
				<?php
				if(get_option('WWAC_AsariConnectionStatus') == 0){
					echo '<span style="color: orange;">Nie sprawdzono</span>';
				}elseif(get_option('WWAC_AsariConnectionStatus') == 1){
					echo '<span style="color: red;">Nie połączono</span>';
				}else{
					echo '<span style="color: green;">Połączono</span>';
				}
				?>
			</td>
			<td class="column-status">
				<?php
				if(get_option('WWAC_AsariConnectionStatus') == 0 || get_option('WWAC_AsariConnectionStatus') == 1){
					echo '<span class="dashicons dashicons-dismiss" style="color: red;"></span>';
				}else{
					echo '<span class="dashicons dashicons-yes-alt" style="color: green;"></span>';
				}
				?>
			</td>
		</tr>
	</tbody>
</table>