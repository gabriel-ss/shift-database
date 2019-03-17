import Component from "../Component.js";
import ShiftModal from "./ShiftModal.js";
import Shift from "../../Shift.js";


class SubscriptionList extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			list: state.list,
		};

		this.fetchSubscriptions();

		ShiftModal
			.insertIntoParent(this, "modal", {}, "#shift-modal")
			.addEventListener("shiftupdate", event => {

				this.fetchSubscriptions();
				this.dispatchEvent(event);

			});

	}


	render() {

		return `
		<div class="container">
			<table><tr><th>Date</th><th>Time</th><th></th></tr>
				${this.renderRows()}
			</table>
		</div>
			`;

	}

	renderRows() {

		if (!this.state.list || !this.state.list.length)
			return "<tr><td>--</td><td>--</td></tr></table>";


		return this.state.list.reduce((acc, entry) =>
			`${acc}
			<tr>
			<td>${entry.date.toLocaleDateString()}</td>
			<td>${entry.date.toTimeString().substring(0, 5)}</td>
				<td>
					<button onclick="${this.getRef()}.childComponents.modal.setShift(${entry.shiftId})">
						Show Details
					</button>
				</td>
			</tr>`, "");

	}

	fetchSubscriptions() {

		Shift.fetchSubscriptions().then(data => {

			this.state.list = data.map(entry => ({
				shiftId: entry.shift_id,
				date: new Date(entry.date),
			}));

			this.update();

		});

	}


	showCreationModal() {

		this.childComponents.creationModal.show();

	}


	showUpdateModal() {

		this.childComponents.updateModal.show();

	}


}


export default SubscriptionList;
