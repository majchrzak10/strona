function addElement() {
	const select = document.getElementById("elementSelect");
	const value = select.value;
	const text = select.options[select.selectedIndex].text;

	// Sprawdzenie, czy opcja została już dodana
	const selectedOption = select.options[select.selectedIndex];
	if (selectedOption.disabled) {
		alert("Ta opcja została już dodana.");
		return;
	}

	// Pobranie aktualnej liczby paneli jako indeksu
	const index = document.querySelectorAll("#elementsContainer .element").length;

	// Tworzenie elementu
	const div = document.createElement("div");
	div.classList.add("element");
	div.setAttribute("data-index", index);

	const titleBar = document.createElement("div");
	titleBar.classList.add("title-bar");
	titleBar.innerHTML = `<strong>${text}</strong> <a onclick="removeElement(this)" class="remove-element">Usuń</a>`;

	const content = document.createElement("div");
	content.classList.add("content");
	content.innerHTML = getElementContent(value, index);
	content.style.display = "flex";

	titleBar.onclick = function(event) {
		if (event.target.tagName !== 'BUTTON') {
			content.style.display = content.style.display === "none" ? "flex" : "none";
		}
	};

	div.appendChild(titleBar);
	div.appendChild(content);
	document.getElementById("elementsContainer").appendChild(div);

	// Wyłączamy wybraną opcję w select
	selectedOption.disabled = true;
	selectedOption.style.backgroundColor = "#d3d3d3";
	selectedOption.style.color = "#a0a0a0";

	// Aktualizacja indeksów pól
	updateIndexes();
}

function removeElement(element) {
	const div = element.closest(".element");
	const value = div.dataset.value;
	
	div.remove();
	updateIndexes();
	
	const select = document.getElementById("elementSelect");
	if(select && value){
		const option = select.querySelector(`option[value="${value}"]`);
		
		if(option){
			option.disabled = false;
			option.style.backgroundColor = "";
			option.style.color = "";
		}
	}
}

function getElementContent(type, index) {
	switch (type) {
		case "kategoria":
			return `
					<div class="panel">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][type]" value="taxonomy">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][key]" value="category">
						<div class="left-side">
							<div class="option-title">Placeholder</div>
							<div class="option-description">Tekst wyświetlany w polu przed wpisaniem danych przez użytkownika.</div>
						</div>
						
						<div class="right-side">
							<input type="text" name="WWAC_SearchInfo[panel][${index}][placeholder]" placeholder="Tekst placeholder'a"/>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Puste elementy</div>
							<div class="option-description">Określ, czy wyświetlać puste elementy taksonomii.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][empty_elements]">
								<option value="1" selected>Nie</option>
								<option value="2">Tak</option>
							</select>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Logika filtra</div>
							<div class="option-description">Określ sposób wybierania postów, gdy wybrane są dwa lub więcej warunków.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][query_logic]">
								<option value="1" selected>W (IN)</option>
								<option value="2">LUB (OR)</option>
								<option value="3">I (AND)</option>
							</select>
						</div>
					</div>`;
		case "typ":
			return `
					<div class="panel">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][type]" value="taxonomy">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][key]" value="type">
						<div class="left-side">
							<div class="option-title">Placeholder</div>
							<div class="option-description">Tekst wyświetlany w polu przed wpisaniem danych przez użytkownika.</div>
						</div>
						
						<div class="right-side">
							<input type="text" name="WWAC_SearchInfo[panel][${index}][placeholder]" placeholder="Tekst placeholder'a"/>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Puste elementy</div>
							<div class="option-description">Określ, czy wyświetlać puste elementy taksonomii.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][empty_elements]">
								<option value="1" selected>Nie</option>
								<option value="2">Tak</option>
							</select>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Logika filtra</div>
							<div class="option-description">Określ sposób wybierania postów, gdy wybrane są dwa lub więcej warunków.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][query_logic]">
								<option value="1" selected>W (IN)</option>
								<option value="2">LUB (OR)</option>
								<option value="3">I (AND)</option>
							</select>
						</div>
					</div>`;
		case "lokalizacja":
			return `
					<div class="panel">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][type]" value="taxonomy">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][key]" value="localization">
						<div class="left-side">
							<div class="option-title">Placeholder</div>
							<div class="option-description">Tekst wyświetlany w polu przed wpisaniem danych przez użytkownika.</div>
						</div>
						
						<div class="right-side">
							<input type="text" name="WWAC_SearchInfo[panel][${index}][placeholder]" placeholder="Tekst placeholder'a"/>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Puste elementy</div>
							<div class="option-description">Określ, czy wyświetlać puste elementy taksonomii.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][empty_elements]">
								<option value="1" selected>Nie</option>
								<option value="2">Tak</option>
							</select>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Logika filtra</div>
							<div class="option-description">Określ sposób wybierania postów, gdy wybrane są dwa lub więcej warunków.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][query_logic]">
								<option value="1" selected>W (IN)</option>
								<option value="2">LUB (OR)</option>
								<option value="3">I (AND)</option>
							</select>
						</div>
					</div>`;
		case "dzielnica":
			return `
					<div class="panel">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][type]" value="taxonomy">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][key]" value="district">
						<div class="left-side">
							<div class="option-title">Placeholder</div>
							<div class="option-description">Tekst wyświetlany w polu przed wpisaniem danych przez użytkownika.</div>
						</div>
						
						<div class="right-side">
							<input type="text" name="WWAC_SearchInfo[panel][${index}][placeholder]" placeholder="Tekst placeholder'a"/>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Puste elementy</div>
							<div class="option-description">Określ, czy wyświetlać puste elementy taksonomii.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][empty_elements]">
								<option value="1" selected>Nie</option>
								<option value="2">Tak</option>
							</select>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Logika filtra</div>
							<div class="option-description">Określ sposób wybierania postów, gdy wybrane są dwa lub więcej warunków.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][query_logic]">
								<option value="1" selected>W (IN)</option>
								<option value="2">LUB (OR)</option>
								<option value="3">I (AND)</option>
							</select>
						</div>
					</div>`;
		case "agent":
			return `
					<div class="panel">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][type]" value="taxonomy">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][key]" value="agent">
						<div class="left-side">
							<div class="option-title">Placeholder</div>
							<div class="option-description">Tekst wyświetlany w polu przed wpisaniem danych przez użytkownika.</div>
						</div>
						
						<div class="right-side">
							<input type="text" name="WWAC_SearchInfo[panel][${index}][placeholder]" placeholder="Tekst placeholder'a"/>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Puste elementy</div>
							<div class="option-description">Określ, czy wyświetlać puste elementy taksonomii.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][empty_elements]">
								<option value="1" selected>Nie</option>
								<option value="2">Tak</option>
							</select>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Logika filtra</div>
							<div class="option-description">Określ sposób wybierania postów, gdy wybrane są dwa lub więcej warunków.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][query_logic]">
								<option value="1" selected>W (IN)</option>
								<option value="2">LUB (OR)</option>
								<option value="3">I (AND)</option>
							</select>
						</div>
					</div>`;
		case "cena":
			return `
					<div class="panel">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][type]" value="meta">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][key]" value="price">
						<div class="left-side">
							<div class="option-title">Minimalna wartość</div>
							<div class="option-description">Minimalna wartość ceny do wybrania.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][min_val]">
								<option value="1" selected>0 (minimalna wartość)</option>
								<option value="2">Najmniejsza wartość ze wszystich ofert</option>
							</select>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Dokładność</div>
							<div class="option-description">Określ liczbę miejsc po przecinku przy filtrowaniu.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][precision]">
								<option value="1" selected>100 zł</option>
								<!--<option value="2">100.9 zł</option>
								<option value="3">100.99 zł</option>-->
							</select>
						</div>
					</div>`;
		case "metraz":
			return `
					<div class="panel">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][type]" value="meta">
						<input type="hidden" name="WWAC_SearchInfo[panel][${index}][key]" value="area">
						<div class="left-side">
							<div class="option-title">Minimalna wartość</div>
							<div class="option-description">Minimalna wartość powierzchni do wybrania.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][min_val]">
								<option value="1" selected>0 (minimalna wartość)</option>
								<option value="2">Najmniejsza wartość ze wszystich ofert.</option>
							</select>
						</div>
					</div>
					
					<div class="panel">
						<div class="left-side">
							<div class="option-title">Dokładność</div>
							<div class="option-description">Określ liczbę miejsc po przecinku przy filtrowaniu.</div>
						</div>
						
						<div class="right-side">
							<select name="WWAC_SearchInfo[panel][${index}][precision]">
								<option value="1" selected>100 m²</option>
								<!--<option value="2">100.1 m²</option>
								<option value="3">100.11 m²</option>-->
							</select>
						</div>
					</div>`;
		default:
			return "";
	}
}

document.addEventListener("DOMContentLoaded", function () {
	const select = document.getElementById("elementSelect");
	if (!select) return;

	const usedValues = Array.from(document.querySelectorAll(".element[data-value]"))
		.map(el => el.dataset.value);

	Array.from(select.options).forEach(option => {
		if (usedValues.includes(option.value)) {
			option.disabled = true;
			option.style.backgroundColor = "#d3d3d3";
			option.style.color = "#a0a0a0";
		}
	});
});

jQuery(function() {
	//jQuery("#elementsContainer").sortable();
	jQuery("#elementsContainer").sortable({
		update: function() {
			updateIndexes();
		}
	});
});

function updateIndexes() {
	jQuery("#elementsContainer .element").each(function(index) {
		jQuery(this).attr("data-index", index);
		jQuery(this).find("input, select").each(function() {
			let name = jQuery(this).attr("name");
			if (name) {
				name = name.replace(/\[panel\]\[\d+\]/, `[panel][${index}]`);
				jQuery(this).attr("name", name);
			}
		});
	});
}