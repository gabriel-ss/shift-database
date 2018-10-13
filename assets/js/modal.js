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

		this._overlay.addEventListener("click",
			event => event.target === this._overlay && this.hide());


		document
			.querySelectorAll(`[data-toggles='${element.id}']`)
			.forEach(trigger =>
				trigger.addEventListener("click", () => this.toggle()));

		this.addCloseButton();

	};


	Modal.selector = ".modal";


	Modal.prototype = {

		addCloseButton() {

			const closeButton = document.createElement("button");

			closeButton.classList.add("close");
			closeButton.addEventListener("click", () => this.hide());
			this._overlay.querySelector(".modal").appendChild(closeButton);

		},

		hide() {

			this._overlay.classList.remove("active");
			this._isVisible = false;

		},


		show() {

			this._overlay.classList.add("active");
			this._isVisible = true;

		},

		toggle() {

			this._isVisible = this._overlay.classList.toggle("active");

		},

	};

	return Modal;

})();

export default Modal;
