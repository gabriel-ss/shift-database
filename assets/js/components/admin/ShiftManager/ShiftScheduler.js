import Component from "../../Component.js";
import Shift from "../../../Shift.js";


class ShiftScheduler extends Component {

	constructor(mountSelector, state) {

		super(mountSelector);

		this.state = {
			week: state.week,
			schedule: state.schedule,
			defaultCapacity: state.defaultCapacity,
		};

	}


	render() {

		return `
				<table>
					<thead>
						<th></th>
						<th>Monday</th>
						<th>Tuesday</th>
						<th>Wednesday</th>
						<th>Thursday</th>
						<th>Friday</th>
						<th></th>
					</thead>
					<tbody id="schedule">
						${this.renderSchedule()}
					</tbody>
					<tfoot>
						<tr id="add-schedule-row">
							<th><input type="time"/></th>
							<td colspan="5">
								<button class="full-width" onclick="${this.getRef()}.addRow()">
									Add New Row
								</button>
							</td>
							<td>
								<button class="primary" onclick="${this.getRef()}.createSchedule()">
									Create shifts
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
		`;

	}


	addRow() {

		const {value: time} =
			document.querySelector("#add-schedule-row input");

		if (!time) return;

		this.state.schedule.push(time);
		this.state.schedule.sort();
		document.querySelector("#schedule").innerHTML = this.renderSchedule();

	}


	removeRow(rowIndex) {

		this.state.schedule.splice(rowIndex, 1);
		document.querySelector("#schedule").innerHTML = this.renderSchedule();

	}


	renderSchedule() {

		return this.state.schedule.reduce((acc, time, rowIndex) =>
			`${acc}<tr><th>${time}</th>
			${`<td><input type="number" min="0" value="${this.state.defaultCapacity}"/></td>`.repeat(5)}
			<td><button class="danger" onclick="${this.getRef()}.removeRow(${rowIndex})">Delete Row</button></td></tr>`, "");


	}


	createSchedule() {

		if (!this.state.week) return;

		const schedule = [...document.querySelector("#schedule").children];
		const shiftList = schedule.flatMap(tableRow => {

			const [{innerText: time}, ...cells] = tableRow.children;
			const shiftCapacity = cells.map(cell => cell.firstChild.value);

			return shiftCapacity.map((shiftCapacity, day) =>
				[`${this.state.week}-${day + 1}`, time, shiftCapacity]);

		});

		Shift.create(shiftList).then(() =>
			this.dispatchEvent({type: "shiftcreation"}));

	}


}


export default ShiftScheduler;
