import framework from "./framework/framework.js";

/**
 * Represents a shift in the database.
 * @param       {int} shiftId The ID corresponding to the shift in the database
 * @constructor
 */
export default function Shift(shiftId) {

	/**
	 * The ID corresponding to the shift in the database
	 * @type {int}
	 */
	this.id = shiftId;

	/**
	 * Makes an asynchronous call to the server and displays the info retrieved
	 * about the shift in an existing modal in the page. The modal also contains
	 * a button to allow the user subscribe/unsubscribe. A callback can be
	 * passed to be called if the user clicks the button.
	 * @param  {Function} callback A callback that will be called if the user
	 * clicks the button.
	 */
	this.displayModal = callback => {

		const [shiftModal] = framework("#shift-modal");

		/*
		 * Calls the getInfo method to retrieve data about the shift and the
		 * checkUserSubscription to determine the content of the button.
		 */
		const request = Promise.all(
			[this.getInfo(), this.checkUserSubscription()]
		);

		request.then(shiftDetails => {

			const [modalData] = shiftDetails;
			// Parse the date received form server into a date object.

			modalData.date = new Date(shiftDetails[0].date.date);
			// If the user is not subscribed to the shift yet the content of the
			// button is set to "Subscribe". Otherwise the button will show
			// "unsubscribe".
			modalData.buttonContent =
				shiftDetails[1] ? "Unsubscribe" : "Subscribe";

			// Sets the content of the modal.
			shiftModal.element.querySelector(".body").innerHTML =
				`
				<div class="half-width">
					<strong>Date:</strong>
					<p>${modalData.date.toLocaleDateString()}</p>
				</div>
				<div class="half-width">
					<strong>Start Time:</strong>
					<p>${modalData.date.toTimeString().substring(0, 5)}</p>
				</div>
				<div class="half-width">
					<strong>Capacity:</strong>
					${modalData.user_count}
				</div>
				<div class="half-width">
					<strong>Subscriptions:</strong>
					${modalData.subscriptions}
				</div>
				<button id="subscribe-button" class="float-right">${modalData.buttonContent}</button>
			`;

			// Adds a listener to the button to subscribe and call the callback
			// on click.
			shiftModal.element.querySelector("#subscribe-button")
				.addEventListener("click", () => {

					this.subscribe();
					callback();
					shiftModal.hide();

				});

			// Unhides the overlay and the modal.
			shiftModal.show();

		});

	};

	/**
	 * Makes an asynchronous call to the server and returns a promise which
	 * resolves an object containing the info about the shift.
	 * @return {Promise} A promise that resolves the response from server
	 */
	this.getInfo = () =>
		new Promise((resolve, reject) => {

			const xhr = new XMLHttpRequest();

			xhr.open(
				"GET",
				`request-processor.php?intention=get_shift_details&shift_id=${this.id}`,
				true
			);
			xhr.responseType = "json";
			xhr.onload = function() {

				if (this.status === 200) resolve(xhr.response);

			};
			xhr.send();

		});

	/**
	 * Makes an asynchronous call to the server and returns a promise which
	 * resolves a boolean indicating whether a particular user is subscribed in
	 * the shift.
	 * @param  {[type]} userId The ID of the user to be verified. If no value is
	 * passed the query will be made for the current logged user.
	 * @return {Promise} A promise that resolves the response from server
	 */
	this.checkUserSubscription = userId =>
		new Promise((resolve, reject) => {

			const xhr = new XMLHttpRequest();

			xhr.open(
				"GET",
				`request-processor.php?intention=check_user_subscription&shift_id=${this.id}&user_id=${userId || ""}`,
				true
			);

			xhr.responseType = "json";
			xhr.onload = function() {

				if (this.status === 200) resolve(xhr.response);

			};
			xhr.send();

		});

	/**
	 * Makes an asynchronous call to the server to subscribe the current logged
	 * user.
	 */
	this.subscribe = () => {

		const xhr = new XMLHttpRequest();

		xhr.open("POST", "request-processor.php", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(`intention=subscribe&shift_id=${this.id}`);

	};

}
