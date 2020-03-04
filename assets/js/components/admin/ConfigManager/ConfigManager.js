import Component from "../../Component.js";

class ConfigManager extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			DEFAULT_SHIFT_CAPACITY: state.DEFAULT_SHIFT_CAPACITY || 7,
			SUBSCRIPTION_TIME_LIMIT: state.SUBSCRIPTION_TIME_LIMIT || 120,
			UNSUBSCRIPTION_TIME_LIMIT: state.UNSUBSCRIPTION_TIME_LIMIT || 30,
		};

	}


	render() {

		return `
		<div class="container">
			<label>
				Default shift capacity:
				<input type="number" name="DEFAULT_SHIFT_CAPACITY"
				value="${this.state.DEFAULT_SHIFT_CAPACITY}"/>
			</label>
			<label>
				Subscription time limit:
				<input type="number" name="SUBSCRIPTION_TIME_LIMIT"
				value="${this.state.SUBSCRIPTION_TIME_LIMIT}"/>
			</label>
			<label>
				Unsubscription time limit:
				<input type="number" name="UNSUBSCRIPTION_TIME_LIMIT"
				value="${this.state.UNSUBSCRIPTION_TIME_LIMIT}"/>
			</label>
			<button onclick="${this.getRef()}.updateConfig()">Update Config</button>
		</div>
			`;

	}

	updateConfig() {

		const parent = document.querySelector(this.mountSelector);

		[...parent.querySelectorAll("input")]
			.forEach(input => (this.state[input.name] = input.value));

		fetch("request-processor.php?intention=set_config", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(this.state),
		});

	}


}


export default ConfigManager;
