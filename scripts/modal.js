/**
 * Modal module
 * @module modal
 */
const Modal = (function() {

	// Selects the existing modal on the page and the overlay containing it.
	let _modal = document.getElementsByClassName('modal')[0];

	let _overlay = _modal.parentElement;

	let instance = {
		/**
		 * Return the HTML element represented by the modal
		 * @return {Element} [description]
		 */
		getElement: () => _modal,

		/**
		 * Display the modal and the overlay
		 */
		open: () => {
			_overlay.style = "display: block";
			document.body.style = "overflow: hidden";
		},

		/**
		 * Display the modal and the overlay
		 */
		close: () => {
			_overlay.style = "display: none";
			document.body.style = "overflow: auto";
		}
	}

	//Closes the modal when clicking outside it
	document.querySelector(".overlay").addEventListener("click", (event) => {
		if (event.target == document.querySelector(".overlay"))
			instance.close();
	});


	return instance

})()

export default Modal;
