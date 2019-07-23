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
			<table id="scheduler">
				<thead>
					${this.renderTableHead()}
				</thead>
				<tbody>
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


	getFormatedDate(day) {

		const [year, week] = this.state.week.split("-W");
		const date = new Date(year, 0, ((week - 1) * 7) + 1);
		const dayOfWeek = date.getDay();

		date.setDate(date.getDate() - dayOfWeek + day + (dayOfWeek <= 4 ? 1 : 8));
		const pad = value => value.toString().padStart(2, "0");

		return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;

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


	renderTableHead() {

		return `<th></th>${["Mon", "Tue", "Wed", "Thu", "Fri"]
			.reduce((acc, dayOfWeek, index) =>
				`${acc}<th>${dayOfWeek} - ${this.getFormatedDate(index)}</th>`
			, "")}`;

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
			const [tableHead, tableBody] =
				document.querySelector("#scheduler").children;

			tableHead.innerHTML = this.renderTableHead();
			tableBody.innerHTML = this.renderTableBody();

		});


	}


}


export default Scheduler;
