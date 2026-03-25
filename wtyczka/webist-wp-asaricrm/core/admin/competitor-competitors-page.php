<?php
if(!defined('ABSPATH')){
	exit;
}

if(isset($_POST['wwac_competitor_save']) && check_admin_referer('wwac_competitor_settings', 'wwac_competitor_settings_nonce')){
	$url = isset($_POST['WWAC_CompetitorBridgeURL']) ? esc_url_raw(wp_unslash($_POST['WWAC_CompetitorBridgeURL'])) : '';
	update_option('WWAC_CompetitorBridgeURL', $url);
	echo '<div class="notice notice-success is-dismissible"><p>Zapisano ustawienia mostu.</p></div>';
}

$bridge_url = (string) get_option('WWAC_CompetitorBridgeURL', '');
$cache = get_option('WWAC_CompetitorAccountsCache', array());
if(!is_array($cache)){
	$cache = array();
}
$defs = WWACCompetitorBridge::platform_definitions();
?>
<h2>Konkurencja — konta i most (bridge)</h2>
<p>Moduł działa w tej samej architekturze co reszta wtyczki: opcje w bazie, AJAX w panelu, opcjonalny zewnętrzny serwis (Node/Python) pod adresem <code>…/search</code> dla platform wymagających crawlera.</p>

<form method="post" action="" class="wwac-competitor-settings" style="max-width:720px;margin-bottom:2em;">
	<?php wp_nonce_field('wwac_competitor_settings', 'wwac_competitor_settings_nonce'); ?>
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row"><label for="WWAC_CompetitorBridgeURL">URL mostu (bez końcowego /search)</label></th>
			<td>
				<input type="url" name="WWAC_CompetitorBridgeURL" id="WWAC_CompetitorBridgeURL" class="regular-text code" value="<?php echo esc_attr($bridge_url); ?>" placeholder="https://twoj-serwer.example.com/api/competitors">
				<p class="description">WordPress wyśle <code>POST</code> JSON na <code>{URL}/search</code> z polami: <code>platform</code>, <code>keyword</code>, <code>category</code>. Bez mostu dostępny jest tylko podstawowy podgląd dla platformy <strong>Civitai</strong> (publiczne API).</p>
			</td>
		</tr>
	</table>
	<p>
		<button type="submit" name="wwac_competitor_save" class="button button-primary">Zapisz</button>
	</p>
</form>

<h3>Wyszukiwanie</h3>
<p>Wybierz kategorię, platformę i wpisz identyfikator (np. nazwę użytkownika).</p>

<div class="wwac-competitor-search" style="max-width:720px;">
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row">Kategoria</th>
			<td>
				<select id="wwac-comp-category">
					<?php foreach($defs as $cat_key => $block){ ?>
						<option value="<?php echo esc_attr($cat_key); ?>"><?php echo esc_html($block['label']); ?></option>
					<?php } ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row">Platforma</th>
			<td>
				<select id="wwac-comp-platform"></select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="wwac-comp-keyword">Słowo kluczowe</label></th>
			<td>
				<input type="text" id="wwac-comp-keyword" class="regular-text" placeholder="np. nazwa użytkownika">
			</td>
		</tr>
	</table>
	<p>
		<button type="button" class="button button-primary" id="wwac-comp-search-btn">Pobierz</button>
		<span id="wwac-comp-spinner" class="spinner" style="float:none;margin-top:4px;"></span>
	</p>
	<div id="wwac-comp-message" class="notice" style="display:none;padding:8px 12px;"></div>
	<pre id="wwac-comp-result" style="background:#f6f7f7;padding:12px;overflow:auto;max-height:320px;border:1px solid #c3c4c7;"></pre>
</div>

<?php if(!empty($cache)){ ?>
<h3>Ostatnio zapisane w pamięci podręcznej</h3>
<table class="widefat striped" style="max-width:960px;">
	<thead>
		<tr>
			<th>Platforma</th>
			<th>Słowo</th>
			<th>Czas</th>
		</tr>
	</thead>
	<tbody>
		<?php
		$entries = array_values($cache);
		usort($entries, static function($a, $b){
			return (int) ($b['time'] ?? 0) <=> (int) ($a['time'] ?? 0);
		});
		$rows = array_slice($entries, 0, 15);
		foreach($rows as $row){
			if(!is_array($row)){
				continue;
			}
			$t = isset($row['time']) ? (int) $row['time'] : 0;
			?>
			<tr>
				<td><?php echo isset($row['platform']) ? esc_html($row['platform']) : '—'; ?></td>
				<td><?php echo isset($row['keyword']) ? esc_html($row['keyword']) : '—'; ?></td>
				<td><?php echo $t ? esc_html(wp_date(get_option('date_format').' '.get_option('time_format'), $t)) : '—'; ?></td>
			</tr>
		<?php } ?>
	</tbody>
</table>
<?php } ?>

<script type="application/json" id="wwac-platform-defs"><?php echo wp_json_encode($defs); ?></script>
