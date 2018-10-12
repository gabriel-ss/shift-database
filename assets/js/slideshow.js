import Component from "./component.js";


/**
 * Slideshow module
 * @module Slideshow
 */


/**
 * Associated to one HTML element with the class "slideshow". Has methods to
 * manipulate the content of the slideshow and how it is displayed.
 *
 * @typedef {Object} Slideshow
 * @property {function} next() Displays the next slide of the slideshow
 * @property {function} previous() Displays the previous slide of the slideshow
 * @property {function} setContent(content)
 */


const Slideshow = (() => {

	/**
	 * Takes an HTML element of a slideshow and return an object to manipualte it
	 * @constructor
	 *
	 * @param  {HTMLElement} element the HTML element to be managed by a
	 * slideshow object
	 */
	const Slideshow = function(element) {

		Component.call(this, "slideshow", element);

		this._currentSlide = 0;
		this._slides = element.querySelectorAll(".slideshow-content");


		this.appendArrows();

	};


	Slideshow.selector = ".slideshow";


	Slideshow.prototype = {

		appendArrows() {

			let arrow = document.createElement("div");

			this.element
				.appendChild(arrow).classList.add("prev");
			arrow.addEventListener("click", () => this.previous());

			arrow = arrow.cloneNode(false);
			this.element
				.appendChild(arrow).classList.replace("prev", "next");
			arrow.addEventListener("click", () => this.next());

		},


		next() {

			this._slides[this._currentSlide++].style = "display: none;";
			this._currentSlide %= this._slides.length;
			this._slides[this._currentSlide].style = "display: block;";

		},


		previous() {

			this._slides[this._currentSlide].style = "display: none;";
			this._currentSlide = this._currentSlide || this._slides.length;
			this._slides[--this._currentSlide].style = "display: block;";

		},

	};

	return Slideshow;

})();

export default Slideshow;
