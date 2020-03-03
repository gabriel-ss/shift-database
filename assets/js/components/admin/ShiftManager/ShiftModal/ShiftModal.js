import Component from "../../../Component.js";
import ShiftEntry from "./ShiftEntry.js";
import Shift from "../../../../Shift.js";
import widgets from "../../../../widgets/widgets.js";


class ShiftModal extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			shift: state.shift,
			date: state.date,
			capacity: state.capacity,
			subscriptions: state.subscriptions,
			sector: state.sector,
		};

	}

	render() {

		return `
		<div class="header">Shift at ${this.state.sector}</div>
		<div id="admin-modal-body" class="body">
			<div class="half-width">
				<strong>Date:</strong>
				<p>${this.state.date.toLocaleDateString()}</p>
			</div>
			<div class="half-width">
				<strong>Start Time:</strong>
				<p>${this.state.date.toTimeString().substring(0, 5)}</p>
			</div>
			<div class="half-width">
				<strong>Capacity:</strong>
				${this.state.capacity}
			</div>
			<div class="half-width">
				<strong>Subscriptions:</strong>
				${this.state.subscriptions}
			</div>
			<div style="margin-top: 8em">
				<strong>Subscribed Users</strong>
				<table>
					${this.childComponents.reduce((acc, child) =>
		acc + child.render(), "")}
				</table>
			</div>
		</div>
		<div class="footer">
			<button class="danger" onclick="${this.getRef()}.deleteShift()">Delete Shift</button>
		</div>
		`;

	}


	show() {

		this.update();
		widgets(this.mountSelector)[0].show();

	}


	hide() {

		widgets(this.mountSelector)[0].hide();

	}


	runAfterUpdate() {

		widgets(this.mountSelector)[0].addCloseButton();

	}


	setShift(shiftId) {

		const shift = new Shift(shiftId);

		this.childComponents = [];

		shift.fetchData().then(data => {

			data.user_list.forEach((entry, index) => {

				ShiftEntry
					.insertIntoParent(this, index, entry)
					.addEventListener("shiftupdate", event => {

						this.dispatchEvent(event);
						this.setShift(shiftId);

					});

			});

			this.broadcast({shift});

			this.update({
				date: new Date(data.date),
				capacity: data.user_count,
				subscriptions: data.user_list.length,
				sector: data.sector_name,
			});

			this.show();

		});

		return this;

	}


	deleteShift() {

		this.state.shift.delete().then(() => {

			this.dispatchEvent({type: "shiftupdate"});
			this.hide();

		});

	}

}


export default ShiftModal;
