import Widget from "./widget.js";


/**
 * Modal module
 * @module modal
 */
const Modal = (() => {

	const Modal = function(element) {

		Widget.call(this, "modal", element);

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
			const modal = this._overlay.querySelector(".modal");

			closeButton.classList.add("close");
			closeButton.addEventListener("click", () => this.hide());
			modal.insertBefore(closeButton, modal.firstChild);

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
