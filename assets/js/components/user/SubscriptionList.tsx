import {Component, h, JSX} from "preact";
import {UserShiftModal} from "../shared/ShiftModal";
import Shift from "../../Shift";


interface State {
	list: {
		shiftID: string;
		date: Date;
		sector: string;
	}[];
	isShowingModal: boolean;
	currentSelectedShiftID: string;
}

// TODO: Update after subscriptions
class SubscriptionList extends Component<{}, State> {

	public constructor(props: {}) {

		super(props);
		this.fetchSubscriptions();

	}


	public render(): JSX.Element {

		return (
			<div class="container">
				<table className="table is-fullwidth">
					<tr><th>Date</th><th>Time</th><th>Sector</th></tr>
					{this.renderRows()}
				</table>
				<UserShiftModal
					isActive={this.state.isShowingModal}
					onHide={() => this.setState({isShowingModal: false})}
					onShiftUpdate={this.fetchSubscriptions}
					shiftID={this.state.currentSelectedShiftID}
				/>
			</div>
		);

	}


	private renderRows(): JSX.Element[] {

		if (!this.state.list || !this.state.list.length)
			return [<tr><td>--</td><td>--</td><td>--</td></tr>];

		return this.state.list.reduce((acc: any, entry: any) => [
			...acc,
			<tr onClick={() => this.setState({
				isShowingModal: true,
				currentSelectedShiftID: entry.shiftID,
			})}>
				<td>{entry.date.toLocaleDateString()}</td>
				<td>{entry.date.toTimeString().substring(0, 5)}</td>
				<td>{entry.sector}</td>
			</tr>,
		], []);

	}


	private fetchSubscriptions = (): void => {

		Shift.fetchSubscriptions().then(list => this.setState({list}));

	}

}


export default SubscriptionList;
