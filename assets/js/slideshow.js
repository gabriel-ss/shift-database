/**
 * Slideshow module
 * @module Slideshow
 */


/**
 * Associated to one HTML element with the class "slideshow". Has methods to
 * manipulate the content of the slideshow and how it is displayed.
 *
 * @typedef {Object} Slideshow
 * @property {HTMLElement} element The HTML element associated with the object
 * @property {HTMLElement} slides The collection of HTML elements to be
 * displayed in the slideshow
 * @property {string} currentSlide The number of currently displayed slide
 * @property {function} next() Displays the next slide of the slideshow
 * @property {function} previous() Displays the previous slide of the slideshow
 * @property {function} setContent(content)
 * @property {function} appendContent(content)
 */


/**
 * Takes an HTML element of a slideshow and return an object to manipualte it
 * @param  {HTMLElement} slideshow the HTML element to be managed by a slideshow
 * object
 * @return {Slideshow}
 */
const slideshow = (slideshow) => {

	let sl = {
		// REVIEW: It may be a good idea to remove this member
		element: slideshow,
		slides: slideshow.querySelectorAll('.slideshow-content'),
		currentSlide: 0,
		next: () => {
			sl.slides[sl.currentSlide++].style = "display: none;"
			sl.currentSlide %= sl.slides.length;
			sl.slides[sl.currentSlide].style = "display: block;"
		},
		previous: () => {
			sl.slides[sl.currentSlide].style = "display: none;"
			sl.currentSlide = sl.currentSlide || sl.slides.length;
			sl.slides[--sl.currentSlide].style = "display: block;"
		},
		// REVIEW: Maybe add event listeners as well
		appendArrows: () => {
			let arrow = document.createElement("div");
			slideshow.appendChild(arrow)
				.classList.add("prev");
			slideshow.appendChild(arrow.cloneNode(false))
				.classList.replace("prev", "next");
		},
		setContent: (content) => {

		},
		appendContent: (content) => {

		}
	}

	sl.appendArrows();
	slideshow.querySelector(".next").addEventListener('click', sl.next);
	slideshow.querySelector(".prev").addEventListener('click', sl.previous);

	return sl;

};


/**
 * An Array containing an object representing each slideshow in the page
 * @type {Slideshow[]} slides
 */
const Slideshow = Array
	.from(document.getElementsByClassName("slideshow"), slideshow);

export default Slideshow;
