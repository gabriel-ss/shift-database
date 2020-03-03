import ShiftModal from "./ShiftModal/ShiftModal.js";
import Component from "../../Component.js";
import Shift from "../../../Shift.js";


class ShiftViewer extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			week: state.week,
			schedule: state.schedule,
		};
		this.state.week && this.updateWeek();
		ShiftModal
			.insertIntoParent(this, "modal", {}, "#shift-management-modal")
			.addEventListener("shiftupdate", () => this.updateWeek());

	}


	render() {

		return `
		<table id="viewer">
			<thead>
				${this.renderTableHead()}
			</thead>
			<tbody>
				${this.renderTableBody()}
			</tbody>
		</table>
		`;

	}


	onWeekChange(element) {

		this.state.week = element.value;
		this.childComponents.scheduler.state.week = element.value;

	}


	renderRow(time) {

		let row = `<tr><th>${time}</th>`;
		const date = this.state.schedule[time];

		// Iterates over the days of the week.
		for (let i = 1; i < 6; i++) {

			row += "<td class='shift-cell'>";

			if (date[i]) {

				row += "<ul>";

				Object.entries(date[i])
					.sort(([firstSector], [secondSector]) =>
						(firstSector > secondSector ? 1 : -1))
					.forEach(([sector, {shift_id: shiftId, remainingSpace}]) => {

						row += `
							<li>
								<button onclick="${this.getRef()}.childComponents.modal.setShift(${shiftId})">
									${sector}
								</button>
								<span>${remainingSpace || "full"}</span>
							</li>
							`;

					});

				row += "</ul>";

			} else row += "<p>--</p>";


			row += "</td>";

		}

		row += "</tr>";

		return row;

	}


	getFormatedDate(day) {

		const [year, week] = this.state.week.split("-W");
		const date = new Date(year, 0, ((week - 1) * 7) + 1);
		const dayOfWeek = date.getDay();

		date.setDate(date.getDate() - dayOfWeek + day + (dayOfWeek <= 4 ? 1 : 8));
		const pad = value => value.toString().padStart(2, "0");

		return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;

	}


	renderTableHead() {

		return `<th></th>${["Mon", "Tue", "Wed", "Thu", "Fri"]
			.reduce((acc, dayOfWeek, index) =>
				`${acc}<th>${dayOfWeek} - ${this.getFormatedDate(index)}</th>`
			, "")}`;

	}


	renderTableBody() {

		let tableBody = "";

		// Iterates over each time...
		for (const time in this.state.schedule)
			tableBody += this.renderRow(time);

		return tableBody;

	}


	updateWeek() {

		Shift.fetchWeek(`${this.state.week}`).then(schedule => {

			this.state.schedule = schedule;
			const viewer = document.querySelector("#viewer");

			if (!viewer) return;
			const [tableHead, tableBody] = viewer.children;

			tableHead.innerHTML = this.renderTableHead();
			tableBody.innerHTML = this.renderTableBody();

		});


	}

}


export default ShiftViewer;
