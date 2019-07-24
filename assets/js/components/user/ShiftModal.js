import Component from "../Component.js";
import Shift from "../../Shift.js";
import widgets from "../../widgets/widgets.js";

const {SUBSCRIPTION_TIME_LIMIT, UNSUBSCRIPTION_TIME_LIMIT} = window.config;

class ShiftModal extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			shift: state.shift,
			date: state.date,
			capacity: state.capacity,
			subscriptions: state.subscriptions,
			isSubscribed: state.isSubscribed,
		};

	}

	render() {

		return `
		<div class="header">Shift Management</div>
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
		</div>
		<div class="footer">
			${this.renderSubscriptionButton()}
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


	renderSubscriptionButton() {

		const now = new Date();
		const {date, subscriptions, capacity} = this.state;

		if (this.state.isSubscribed) {

			const canUnsubscribe =
				(date - now) / 60000 >= UNSUBSCRIPTION_TIME_LIMIT;

			return `<button onclick="${this.getRef()}.unsubscribe()"${
				canUnsubscribe ? "" : " disabled"}>Unsubscribe</button>`;

		}

		const canSubscribe =
			(subscriptions < capacity) &&
			(((date - now) / 60000) >= SUBSCRIPTION_TIME_LIMIT);

		return `<button onclick="${this.getRef()}.subscribe()"${
			canSubscribe ? "" : " disabled"}> Subscribe</button>`;

	}


	subscribe() {

		this.state.shift.addEntry().then(() => {

			this.state.subscriptions++;
			this.update({isSubscribed: true});
			this.dispatchEvent({type: "shiftupdate"});

		});

	}

	unsubscribe() {

		this.state.shift.deleteEntry().then(() => {

			this.state.subscriptions--;
			this.update({isSubscribed: false});
			this.dispatchEvent({type: "shiftupdate"});

		});

	}


	setShift(shiftId) {

		const shift = new Shift(shiftId);

		shift.fetchData().then(data => {

			this.update({
				shift,
				date: new Date(data.date),
				capacity: data.user_count,
				subscriptions: data.subscriptions,
				isSubscribed: data.is_subscribed,
			});

			this.show();

		});

		return this;

	}

}


export default ShiftModal;
