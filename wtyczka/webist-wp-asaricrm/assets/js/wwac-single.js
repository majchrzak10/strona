var index = 0;
var slideIndex = 1;
var elements = document.querySelectorAll('.webist-asari-dot');

document.getElementById("webist-asari-slides-next").addEventListener('click', function(){webistAsariMoveSlide(1);});
document.getElementById("webist-asari-slides-previous").addEventListener('click', function(){webistAsariMoveSlide(-1);});

for (i = 0; i < elements.length; ++i) {
	index = i + 1;
	elements[i].setAttribute("onclick","webistAsariActivateSlide(" + index + ");");
}

webistAsariDisplaySlide(slideIndex);

function webistAsariMoveSlide(n) {
	webistAsariDisplaySlide(slideIndex += n);
}

function webistAsariActivateSlide(n) {
	webistAsariDisplaySlide(slideIndex = n);
}

function webistAsariDisplaySlide(n) {
	var i;
	var allSlides = document.getElementsByClassName("webist-asari-slide");
	var allDots = document.getElementsByClassName("webist-asari-dot");

	if (n > allSlides.length) {
		slideIndex = 1;
	}

	if (n < 1) {
		slideIndex = allSlides.length;
	}

	for (i = 0; i < allSlides.length; i++) {
		allSlides[i].style.display = "none";
	}

	for (i = 0; i < allDots.length; i++) {
		allDots[i].className = allDots[i].className.replace(" webist-asari-dot-active", "");
	}

	allSlides[slideIndex - 1].style.display = "block";
	allDots[slideIndex - 1].className += " webist-asari-dot-active";
}