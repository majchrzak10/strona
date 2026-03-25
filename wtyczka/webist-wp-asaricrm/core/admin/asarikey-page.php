<?php 
if(isSet($_GET['action'])){
	if(isset($_POST['asarikey_save_nonce']) && wp_verify_nonce($_POST['asarikey_save_nonce'], basename(__FILE__))){
		switch($_GET['action']){
			case 'save':
				update_option('WWAC_AsariSiteToken', filter($_POST['sitetoken']));
				update_option('WWAC_AsariUserID', filter($_POST['userid']));
				echo '
				<div class="notice notice-success is-dismissible">
					<p>Pomyślnie zapisano userId oraz siteToken.</p>
				</div>';
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
<form action="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-asari-key&action=save" method="POST">
	<?php wp_nonce_field(basename(__FILE__), 'asarikey_save_nonce'); ?>
	<h2>Klucz Asari CRM</h2>
	<p>Podaj userID oraz siteToken, a następnie wykonaj test połączenia.</p>
	<table class="form-table" role="presentation">
		<tbody>
			<tr>
				<th scope="row">
					<label for="userid">userID</label>
				</th>
				<td>
					<input type="text" id="userid" name="userid" value="<?php echo get_option('WWAC_AsariUserID'); ?>" class="regular-text ltr" placeholder="userID od Asari."/>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="sitetoken">siteToken</label>
				</th>
				<td>
					<input type="text" id="sitetoken" name="sitetoken" value="<?php echo get_option('WWAC_AsariSiteToken'); ?>" class="regular-text ltr" placeholder="siteToken od Asari."/>
				</td>
			</tr>
		</tbody>
	</table>
		
	<?php submit_button(); ?>
</form>