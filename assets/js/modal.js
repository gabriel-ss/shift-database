import Component from './component.js';


/**
 * Modal module
 * @module modal
 */
const Modal = (() => {

	const Modal = function(element) {

		Component.call(this, "modal", element);

		this._isVisible = false;
		this._overlay = document.createElement("div");


		this._overlay.classList.add("overlay");
		element.parentNode.replaceChild(this._overlay, element);
		this._overlay.appendChild(element);

		this._overlay.addEventListener("click", (event) => {
			if (event.target == this._overlay)
				this.hide();
		});

	}


	Modal.selector = ".modal";


	Modal.prototype = {

		/**
		 * Display the modal and the overlay
		 */
		show: function() {

			this._overlay.style = "display: block";
			document.body.style = "overflow: hidden";
			this._isVisible = true;
		},


		/**
		 * Hide the modal and the overlay
		 */
		hide: function() {
			
			this._overlay.style = "display: none";
			document.body.style = "overflow: auto";
			this._isVisible = false;
		},

	}

	return Modal;

})()

export default Modal;
