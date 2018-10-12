import Component from "./component.js";


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

		this._overlay.addEventListener("click", event => {

			if (event.target === this._overlay) this.hide();

		});

	};


	Modal.selector = ".modal";


	Modal.prototype = {

		hide() {

			this._overlay.classList.remove("active");
			this._isVisible = false;

		},


		show() {

			this._overlay.classList.add("active");
			this._isVisible = true;

		},

	};

	return Modal;

})();

export default Modal;
