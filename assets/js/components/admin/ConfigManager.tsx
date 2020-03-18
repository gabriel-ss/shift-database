import {Component, h, JSX} from "preact";

const {
	DEFAULT_SHIFT_CAPACITY,
	SUBSCRIPTION_TIME_LIMIT,
	UNSUBSCRIPTION_TIME_LIMIT,
} = window.config;

class ConfigManager extends Component {

	public state = {
		DEFAULT_SHIFT_CAPACITY,
		SUBSCRIPTION_TIME_LIMIT,
		UNSUBSCRIPTION_TIME_LIMIT,
	};


	public render(): JSX.Element {

		return (
			<div class="container">
				<label className="field label">
					Default shift capacity:
					<input
						className="input"
						type="number"
						name="DEFAULT_SHIFT_CAPACITY"
						onInput={this.onInput}
						value={this.state.DEFAULT_SHIFT_CAPACITY}
					/>
				</label>
				<label className="field label">
					Subscription time limit:
					<input
						className="input"
						type="number"
						name="SUBSCRIPTION_TIME_LIMIT"
						onInput={this.onInput}
						value={this.state.SUBSCRIPTION_TIME_LIMIT}
					/>
				</label>
				<label className="field label">
					Unsubscription time limit:
					<input
						className="input"
						type="number"
						name="UNSUBSCRIPTION_TIME_LIMIT"
						onInput={this.onInput}
						value={this.state.UNSUBSCRIPTION_TIME_LIMIT}
					/>
				</label>
				<button
					className="button" onClick={this.updateConfig}
				>Update Config</button>
			</div>
		);

	}


	private onInput = (event: JSX.TargetedEvent<HTMLInputElement>): void => {

		this.setState({[event.currentTarget.name]: event.currentTarget.value});

	}

	private updateConfig = (): void => {

		fetch("request-processor.php?intention=set_config", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(this.state),
		});

	}


}


export default ConfigManager;
