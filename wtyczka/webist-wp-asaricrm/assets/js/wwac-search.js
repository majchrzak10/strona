function formatValue(value, format){
	value = parseFloat(value);
	if (isNaN(value)) return value;

	switch (format) {
		case "space":
			return value.toLocaleString("pl-PL").replace(/\u00A0/g, " ");
		case "dot":
			return value.toLocaleString("de-DE"); // np. 150.000
		case "comma":
			return value.toLocaleString("en-US"); // np. 150,000
		case "plain":
		default:
			return value.toString();
	}
}

document.addEventListener("DOMContentLoaded", function(){
	if (!container) return;

	const inputs = container.querySelectorAll("input[type=\'range\']");
	const ranges = {};

	function updateSpanValue(input, span){
		if (!span) return;

		const unit = input.dataset.unit || "";
		const format = input.dataset.format || "plain";
		span.innerHTML = formatValue(input.value, format) + " " + unit;
	}

	inputs.forEach(input => {
		const span = document.getElementById(input.id + "-value");
		updateSpanValue(input, span);

		input.addEventListener("input", function() {
			updateSpanValue(input, span);
		});

		// grupy min/max
		const parts = input.name.split("_");
		const base = parts[0]; // np. "cena"
		const type = parts[1]; // "min" albo "max"
		if (!ranges[base]) ranges[base] = {};
		ranges[base][type] = input;
	});

	// min < max
	Object.keys(ranges).forEach(base => {
		const minInput = ranges[base].min;
		const maxInput = ranges[base].max;

		if(minInput && maxInput){
			const minSpan = document.getElementById(minInput.id + "-value");
			const maxSpan = document.getElementById(maxInput.id + "-value");

			minInput.addEventListener("input", () => {
				if(parseFloat(minInput.value) > parseFloat(maxInput.value)){
					maxInput.value = minInput.value;
					updateSpanValue(maxInput, maxSpan);
				}
			});

			maxInput.addEventListener("input", () => {
				if(parseFloat(maxInput.value) < parseFloat(minInput.value)){
					minInput.value = maxInput.value;
					updateSpanValue(minInput, minSpan);
				}
			});
		}
	});
});

document.addEventListener("DOMContentLoaded", function(){
	const container = document.querySelector(".wwac-search-container");
	if (!container) return;

	const searchForm = document.querySelector(".wwac-search-container form");
	if (!searchForm) return;

	const loader = document.querySelector(".wwac-loader");
	const formId = container.dataset.formId;
	const selects = searchForm.querySelectorAll("select");

	function setSelectValue(select, value){
		for(let option of select.options){
			option.selected = option.value === value;
		}
	}

	function setRangeValue(input, value){
		if (!input) return;
		input.value = value;
		const span = document.querySelector(`#${input.id}-value`);
		if (span) {
			//span.textContent = value + " " + input.dataset.unit;
			const format = input.dataset.format || "plain";
			const unit = input.dataset.unit || "";
			span.innerHTML = formatValue(value, format) + " " + unit;
		}
	}

	searchForm.addEventListener("change", function(){
		const formData = new FormData(searchForm);
		
		if (loader) loader.style.display = "flex";

		fetch(ajaxurl, {
				method: "POST",
				body: new URLSearchParams({
					action: "WWACAjax_refreshSearchFormOptions",
					form_id: formId,
					form: JSON.stringify(Object.fromEntries(formData)),
				}),
			})
			.then((res) => res.json())
			.then((response) => {
				if (loader) loader.style.display = "none";

				if(response.success && response.data && response.data.options_html){
					for(let taxName in response.data.options_html){
						const select = searchForm.querySelector(`[name="${taxName}"]`);
						
						if(select){
							const selectedValue = formData.get(taxName);

							select.innerHTML = response.data.options_html[taxName];
							setSelectValue(select, selectedValue || "");
						}else{
							console.warn(`Nie znaleziono <select name="${taxName}">`);
						}
					}
				}
			})
			.catch((error) => {
				console.error("Błąd w zapytaniu AJAX:", error);
				if (loader) loader.style.display = "none";
			});

		// Ustawienie wartości range
		const rangeMinInput = searchForm.querySelector('[name="cena_min"]');
		const rangeMaxInput = searchForm.querySelector('[name="cena_max"]');
		const areaMinInput = searchForm.querySelector('[name="powierzchnia_min"]');
		const areaMaxInput = searchForm.querySelector('[name="powierzchnia_max"]');

		setRangeValue(rangeMinInput, formData.get("cena_min"));
		setRangeValue(rangeMaxInput, formData.get("cena_max"));
		setRangeValue(areaMinInput, formData.get("powierzchnia_min"));
		setRangeValue(areaMaxInput, formData.get("powierzchnia_max"));
	});
});