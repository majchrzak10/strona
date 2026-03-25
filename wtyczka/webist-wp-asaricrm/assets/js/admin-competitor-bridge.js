(function($){
	'use strict';

	function readDefs(){
		var el = document.getElementById('wwac-platform-defs');
		if(!el || !el.textContent){
			return {};
		}
		try{
			return JSON.parse(el.textContent);
		}catch(e){
			return {};
		}
	}

	function fillPlatforms(defs, category){
		var $sel = $('#wwac-comp-platform');
		$sel.empty();
		var block = defs[category];
		if(!block || !block.items){
			return;
		}
		block.items.forEach(function(it){
			$sel.append($('<option></option>').attr('value', it.key).text(it.label));
		});
	}

	$(function(){
		var defs = readDefs();
		var $cat = $('#wwac-comp-category');
		var first = Object.keys(defs)[0];
		if(first){
			fillPlatforms(defs, first);
		}
		$cat.on('change', function(){
			fillPlatforms(defs, $(this).val());
		});

		$('#wwac-comp-search-btn').on('click', function(){
			var $msg = $('#wwac-comp-message');
			var $spin = $('#wwac-comp-spinner');
			var $out = $('#wwac-comp-result');
			$msg.hide().removeClass('notice-error notice-success');
			$out.text('');
			$spin.addClass('is-active');

			$.post(wwacCompetitor.ajaxurl, {
				action: 'wwac_competitor_search',
				nonce: wwacCompetitor.nonce,
				platform: $('#wwac-comp-platform').val(),
				keyword: $('#wwac-comp-keyword').val(),
				category: $('#wwac-comp-category').val()
			}).done(function(res){
				if(res && res.success){
					$msg.addClass('notice-success').text('OK').show();
					$out.text(JSON.stringify(res.data, null, 2));
				}else{
					var m = (res && res.data && res.data.message) ? res.data.message : 'Błąd żądania';
					$msg.addClass('notice-error').text(m).show();
				}
			}).fail(function(xhr){
				var m = 'Błąd sieci';
				try{
					var j = xhr.responseJSON;
					if(j && j.data && j.data.message){
						m = j.data.message;
					}
				}catch(e){}
				$msg.addClass('notice-error').text(m).show();
			}).always(function(){
				$spin.removeClass('is-active');
			});
		});
	});
})(jQuery);
