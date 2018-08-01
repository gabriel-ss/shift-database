// TODO: Move methods to the prototype

/**
 * Represents tables of shift entries.
 * @param  {String} [tableId="shift-table"] The HTML id of the table element to
 * be represented.
 * @constructor
 */
function ShiftTable(tableId = "shift-table") {

	/**
	 * The Node that represents the shift table
	 * @type {Node}
	 */
	this.table = document.querySelector(`#${tableId}`);

	/**
	 * The HTML collection containing the cells that represents shift entries
	 * @type {HTMLCollection}
	 */
	this.cells = this.table.getElementsByTagName("td");

	/**
	 * Makes an asynchronous call to the server and updates the table element
	 * pointed by the table property.
	 */
	this.updateTable = () => {

		// Calls the getInfo method to retrieve data from server.
		this.getInfo().then((schedule) => {

			// Initializes the variable that will contain the table HTML content
			// with a row displaying the days of the week.
			let table = `<tr><th></th>
						<th>Monday</th>
						<th>Tuesday</th>
						<th>Wednesday</th>
						<th>Thursday</th>
						<th>Friday</th></tr>`;

			let date, cellContent, htmlId;

			// Iterates over each time...
			for (let time in schedule) {
				// ...creating a new row...
				table += `<tr><th>${time}</th>`;
				// ...and getting an array in which the index represents the day of
				// the week for each one.
				date = schedule[time];
				// Then iterate over the days of the week creating the cells in the
				// corresponding time row.
				for (let i=1; i <6 ; i++) {
					// If date[i] does not exist the cellContent will be set to "--".
					// If it does exist but is equals to 0 cellContent will be set
					// to "full".
					cellContent = (date[i] ? date[i]["remainingSpace"] : "--") || "full";
					// If date[i] exists the id of the td element will be set to
					// "shift:shiftID". If it does not "shift:null" will be assigned
					htmlId = date[i] ? date[i]["shift_id"] : "null";
					table += `<td class='shift-cell' data-shift-id='${htmlId}'>${cellContent}</td>`;
				}
				table += "</tr>";
			}

			// Updates the content of the element with the newly created table
			this.table.innerHTML = table;

			// Runs through shift cells in the table...
			for (let i = 0, shiftId; i < this.cells.length; i++) {
				// ...and check their IDs.
				shiftId = this.cells[i].getAttribute("data-shift-id");
				// If the ID is valid (not null) adds a listener...
				if (shiftId !== "null") {
					this.cells[i].addEventListener("click", () => {
						// ...that instantiates a new Shift with the ID read from the
						// cell...
						let shift = new Shift(shiftId);
						// ...and displays a modal about it.
						shift.displayModal(this.updateTable);
					});
				}
			}

		});
	};

	/**
	 * Makes an asynchronous call to the server and returns a promise which
	 * resolves an object containing the info received.
	 * @return {Promise} A promise that resolves the response from server
	 */
	this.getInfo = () => {

		return new Promise((resolve, reject) =>{
		let xhr = new XMLHttpRequest();
		xhr.open("GET", "request-processor.php?intention=get_table", true);
		xhr.responseType = "json";
		xhr.onload = () => {
			if (xhr.status == 200) {
				resolve(xhr.response);
			}
		}
		xhr.send();

	});
	}
}
