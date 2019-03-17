import Component from "../Component.js";
import ShiftModal from "./ShiftModal.js";
import Shift from "../../Shift.js";


class Scheduler extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			week: state.week,
			schedule: state.schedule,
		};

		this.state.week && this.fetchWeek();

		ShiftModal
			.insertIntoParent(this, "modal", {}, "#shift-modal")
			.addEventListener("shiftupdate", event => {

				this.fetchWeek();
				this.dispatchEvent(event);

			});

	}


	render() {

		return `
		<div class="container"">
			<div style="display: flex">
				<input id="week-selector" type="week" value="${this.state.week || ""}" oninput="${this.getRef()}.onWeekChange(this)">
			</div>
			<table>
				<thead>
					<th></th>
					<th>Monday</th>
					<th>Tuesday</th>
					<th>Wednesday</th>
					<th>Thursday</th>
					<th>Friday</th>
				</thead>
				<tbody id="viewer">
					${this.renderTableBody()}
				</tbody>
			</table>
		</div>
			`;

	}


	onWeekChange(element) {

		this.state.week = element.value;
		this.fetchWeek();

	}


	renderRow(time) {

		let row = `<tr><th>${time}</th>`;
		const date = this.state.schedule[time];

		// Iterates over the days of the week.
		for (let i = 1; i < 6; i++) {

			// If date[i] does not exist the cellContent will be set to
			// "--". If it does exist but is equals to 0 cellContent will
			// be set to "full".
			const cellContent =
				(date[i] ? date[i].remainingSpace : "--") || "full";
			const shiftId = date[i] ? date[i].shift_id : "null";

			row += `
				<td class='shift-cell'>	${cellContent === "--"
					? ""
					: `<button onclick="${this.getRef()}.childComponents.modal.setShift(${shiftId})">
						Show Details
					</button>`}
					<p>${cellContent}</p>
				</td>`;

		}

		row += "</tr>";

		return row;

	}


	renderTableBody() {

		let tableBody = "";

		for (const time in this.state.schedule)
			tableBody += this.renderRow(time);

		return tableBody;

	}


	fetchWeek() {

		Shift.fetchWeek(`${this.state.week}`).then(schedule => {

			this.state.schedule = schedule;
			const tableBody = document.querySelector("#viewer");

			tableBody.innerHTML = this.renderTableBody();

		});


	}


}


export default Scheduler;
