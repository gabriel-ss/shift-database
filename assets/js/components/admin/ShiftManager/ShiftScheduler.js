import Component from "../../Component.js";
import Shift from "../../../Shift.js";


class ShiftScheduler extends Component {

	constructor(mountSelector, state) {

		super(mountSelector);

		this.state = {
			week: state.week,
			schedule: state.schedule,
			defaultCapacity: state.defaultCapacity,
			sectorList: state.sectorList,
		};

		Shift.fetchSectorList()
			.then(sectorList => (this.state.sectorList = sectorList));

	}


	render() {

		return `
				<table>
					<thead>
						<th></th>
						<th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th>
					</thead>
					<tbody id="schedule">
						${this.renderSchedule()}
					</tbody>
					<tfoot>
						<tr id="add-schedule-row">
							<th><input type="time"/></th>
							<td colspan="6">
								<button class="full-width" onclick="${this.getRef()}.addRow()">
									Add New Row
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
				<div>
					<select id="sector-selector" class="full-width">
						${this.renderSectorList()}
					</select>
					<button class="full-width primary" onclick="${this.getRef()}.createSchedule()">
						Create Shifts
					</button>
				</div>
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


	renderSectorList() {

		return this.state.sectorList.reduce((acc, sector) =>
			`${acc}<option value="${sector}">${sector}</option>`, "");

	}


	createSchedule() {

		if (!this.state.week) return;

		const schedule = [...document.querySelector("#schedule").children];
		const sector = document.querySelector("#sector-selector").value;
		const shiftList = schedule.flatMap(tableRow => {

			const [{innerText: time}, ...cells] = tableRow.children;
			const shiftCapacity = cells
				.filter(cell => cell.firstChild.tagName === "INPUT")
				.map(cell => cell.firstChild.value);

			return shiftCapacity.map((shiftCapacity, day) => ({
				weekAndDay: `${this.state.week}-${day + 1}`,
				time,
				shiftCapacity,
				sector,
			}));

		});

		Shift.create(shiftList).then(() =>
			this.dispatchEvent({type: "shiftcreation"}));

	}


}


export default ShiftScheduler;
