<?php 
if(isSet($_GET['action'])){
	switch($_GET['action']){
		case 'reset-updater-values':
			update_option('WWAC_LastUpdatedNumber', 0);
			update_option('WWAC_LastUpdatedJump', 1);
			echo '
			<div class="notice notice-success is-dismissible">
				<p>Zresetowano <i>ostatni numer nieruchomości</i> oraz <i>ostatni skok pętli</i>!</p>
			</div>';
			break;
			
		case 'delete-offers-wp':
			$allposts = get_posts(array('post_type' => 'nieruchomosci', 'numberposts' => -1));
			
			foreach($allposts as $eachpost){
				$attachments = get_attached_media('', $eachpost -> ID);
				
				foreach($attachments as $attachment){
					wp_delete_attachment($attachment -> ID, true);
					}
				
				if(has_post_thumbnail($eachpost -> ID)){
					$attachment_id = get_post_thumbnail_id($eachpost -> ID);
					wp_delete_attachment($attachment_id, true);

					wp_delete_post($eachpost -> ID, true);
				}else{
					wp_delete_post($eachpost -> ID, true);
				}
			}
			
			echo '
			<div class="notice notice-success is-dismissible">
				<p>Usunięto z WordPress\'a wszystkie oferty nieruchomości wraz ze zdjęciami!</p>
			</div>';
			break;
			
		default:
			break;
	}
}
?>
<style>
.flex-wrapper {
    display: flex;
    justify-content: space-between;
}
.flex-wrapper .flex-column {
    flex: 1;
    margin-right: 10px;
}
.flex-wrapper .flex-column:last-child {
    margin-right: 0;
}

</style>

<h2>Aktualizator nieruchomości</h2>

<?php
$WWAC_LastUpdatedNumber = get_option('WWAC_LastUpdatedNumber');
$WWAC_LastUpdatedJump = get_option('WWAC_LastUpdatedJump');

if($WWAC_LastUpdatedNumber > 0 && $WWAC_LastUpdatedJump > 1){
	$status = "Włączony! Trwa aktualizacja nieruchomości...";
}else{
	$status = "Wyłączony";
}
?>

<div class="flex-wrapper">
    <div class="flex-column">
        <p>Tutaj znajduje się tabela z informacjami na temat aktualizatora ofert. Jeśli w tym momencie oferty nie są odświeżane to <i>Ostatni numer nieruchomości</i> oraz <i>Ostatni skok pętli</i> muszą mieć odpowiednio wartości 0 oraz 1.</p>
		
		<p>Co około 15 sekund wartości są odświeżane na tej stronie, aby móc na bieżąco sprawdzać stan aktualizatora. Dodatkowo, co 25 nieruchomości aktualizator robi "przerwę" (np.: aby załadować zdjęcia). Następnie kontynuuje działanie i aktualizację ofert.</p>
		
		<p>Jeśli wartości nie zmieniają się dłuższy czas (np.: 15 minut) oznacza to, że skrypt nie mógł dokończyć aktualizowania ofert. W takim przypadku proszę użyć jednej z poniższych opcji, a następnie zwiększyć dostępną ilość pamięci RAM na serwerze, <i>WP_MEMORY_LIMIT</i> oraz maksymalny czas wykonywania skryptów PHP.</p>
    </div>
    <div class="flex-column">
        <table class="widefat fixed" cellspacing="0">
			<thead>
				<tr>
					<th id="cb" class="manage-column column-cb" scope="col">Nazwa wartości</th>
					<th id="minimum" class="manage-column column-minimum" scope="col">Wartość</th>
				</tr>
			</thead>
						
			<tfoot>
				<tr>
					<th id="cb" class="manage-column column-cb" scope="col">Nazwa wartości</th>
					<th id="minimum" class="manage-column column-minimum" scope="col">Wartość</th>
				</tr>
			</tfoot>
						
			<tbody>
				<tr class="alternate">
					<th class="check-column" scope="row">Ostatni numer nieruchomości</th>
					<td class="column-minimum" id="WWAC_LastUpdatedNumber"><?php echo $WWAC_LastUpdatedNumber; ?></td>
				</tr>
				
				<tr>
					<th class="check-column" scope="row">Ostatni skok pętli</th>
					<td class="column-minimum" id="WWAC_LastUpdatedJump"><?php echo $WWAC_LastUpdatedJump; ?></td>
				</tr>
				
				<tr class="alternate">
					<th class="check-column" scope="row">WP_MEMORY_LIMIT</th>
					<td class="column-minimum"><?php echo WP_MEMORY_LIMIT; ?></td>
				</tr>
				
				<tr>
					<th class="check-column" scope="row">Status aktualizatora</th>
					<td class="column-minimum" id="WWAC_UpdaterStatus"><?php echo $status; ?></td>
				</tr>
				
				<tr class="alternate">
					<th class="check-column" scope="row">Ostatnie odświeżenie powyższych wartości</th>
					<td class="column-minimum" id="WWAC_UpdaterLastRefreshInfo">Nigdy</td>
				</tr>
			</tbody>
		</table>
    </div>
</div>

<a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-reu&action=reset-updater-values" class="button">Resetuj wartości ręcznie</a> &nbsp; <a href="admin.php?page=<?php echo WWAC_PLUGIN_MENU_SLUG; ?>-reu&action=delete-offers-wp" class="button">Usuń oferty wraz ze zdjęciami</a>

<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function(){
	Date.prototype.timeNow = function (){
		return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
	}
	
	let ajaxRequest;
	var time = 16000;
	
    function updateValues(){
		var currentDate = new Date();
		
		if(ajaxRequest && ajaxRequest.readyState !== 4){
            ajaxRequest.abort();
        }
		
        ajaxRequest = jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'WWACAjax_getUpdaterValues',
            },
            success: function(response){
                var data = JSON.parse(response);
				console.log("AJAX wywoałany: " + currentDate.timeNow());

                document.getElementById('WWAC_LastUpdatedNumber').innerText = data.WWAC_LastUpdatedNumber;
                document.getElementById('WWAC_LastUpdatedJump').innerText = data.WWAC_LastUpdatedJump;
                document.getElementById('WWAC_UpdaterStatus').innerText = data.WWAC_UpdaterStatus;
				document.getElementById('WWAC_UpdaterLastRefreshInfo').innerText = currentDate.timeNow();
            },
			error: function(xhr, status, error) {
                alert('Błąd AJAX:', status, error);
                setTimeout(updateValues, time);
            }
        });
    }

    setInterval(updateValues, time);
    updateValues();
});
</script>