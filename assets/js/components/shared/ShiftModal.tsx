import {Component, h, JSX} from "preact";
import Shift from "../../Shift";
import Modal from "../shared/Modal";

const {SUBSCRIPTION_TIME_LIMIT, UNSUBSCRIPTION_TIME_LIMIT} = window.config;

interface ShiftModalProps {
	isActive: boolean;
	onHide: JSX.GenericEventHandler<any>;
	onShiftUpdate: () => void;
	shiftID?: string;
}

interface ShiftModalState {
	isSubscribed: boolean;
	shift: Shift;
	date: Date;
	capacity: number;
	subscriptions: number;
	subscriptionList?: {name: string; email: string; userID: string}[];
	sector: string;
	isFetching: boolean;
	hasFetched: boolean;
}


const AdminShiftModal = (props: ShiftModalProps): JSX.Element =>
	<ShiftModal
		{...props}
		button={(buttonBrops: DeleteButtonProps & SubscribeButtonProps) =>
			<DeleteShiftButton {...buttonBrops}/>
		}
	/>;


const UserShiftModal = (props: ShiftModalProps): JSX.Element =>
	<ShiftModal
		{...props}
		button={(buttonBrops: DeleteButtonProps & SubscribeButtonProps) =>
			<SubscribeButton {...buttonBrops}/>
		}
	/>;


class ShiftModal extends
	Component<ShiftModalProps & {
		button: (props: DeleteButtonProps & SubscribeButtonProps) => JSX.Element;
	}, ShiftModalState> {

	public render(): JSX.Element {

		const {shiftID, onHide, isActive, ...props} = this.props;
		const onShiftUpdate = (): void => {

			this.setState({isFetching: false, hasFetched: false});
			this.props.onShiftUpdate();

		};

		if (!this.state.date || this.state.shift?.id !== shiftID)
			return <Modal {...{onHide, isActive}}><div>Spinner</div></Modal>;

		return (
			<Modal isActive={isActive} onHide={onHide}>
				<div className="modal-card">
					<div class="modal-card-head">
						<p class="modal-card-title">Shift at {this.state.sector}</p>
						<button class="delete" onClick={onHide}></button>
					</div>
					<div class="modal-card-body">
						<div className="columns">
							<div className="column">
								<strong>Date:</strong>
								<p>{this.state.date?.toLocaleDateString()}</p>
								<strong>Start Time:</strong>
								<p>{this.state.date?.toTimeString().substring(0, 5)}</p>
							</div>
							<div className="column">
								<strong>Capacity:</strong>
								<p>{this.state.capacity}</p>
								<strong>Subscriptions:</strong>
								<p>{this.state.subscriptions}</p>
							</div>
						</div>
						{
							this.state.subscriptionList &&
							<div>
								<strong>Subscribed Users:</strong>
								<table className="table is-fullwidth">
									{
										!this.state.subscriptionList.length
											? <tr><td>--</td></tr>
											: this.state.subscriptionList.map(entry =>
												<ShiftEntry {...entry}
													shift={this.state.shift}
													onShiftUpdate={onShiftUpdate}
												/>)
									}
								</table>
							</div>
						}
					</div>
					<div class="modal-card-foot">
						{this.props.button({onShiftUpdate, ...this.state, onHide})}
					</div>
				</div>
			</Modal>
		);

	}


	public componentDidUpdate(): void {

		if (this.state.isFetching ||
			this.state.shift?.id === this.props.shiftID &&
			this.state.hasFetched) return;

		const shift = new Shift(this.props.shiftID!);

		this.setState({isFetching: true}, () => shift.fetchData().then(data =>
			this.setState({isFetching: false, hasFetched: true, ...data})));

	}

}


interface SubscribeButtonProps {
	shift: Shift;
	date: Date;
	capacity: number;
	subscriptions: number;
	isSubscribed: boolean;
	isFetching: boolean;
	onShiftUpdate: () => void;
}


const SubscribeButton = ({
	shift,
	date,
	capacity,
	subscriptions,
	isSubscribed,
	isFetching,
	onShiftUpdate,
}:	SubscribeButtonProps): JSX.Element => {

	// Time until shift start in minutes
	const timeUntilShift =
		(date?.valueOf() - new Date().valueOf()) / 60000;
	const hasRoom = subscriptions! < capacity!;

	if (isFetching) return <button className="button is-loading" />;

	if (isSubscribed) {

		return (
			<button
				className="button"
				onClick={() => shift!.deleteEntry().then(onShiftUpdate)}
				disabled={timeUntilShift < UNSUBSCRIPTION_TIME_LIMIT}
			>
				Unsubscribe
			</button>
		);

	}

	return (
		<button
			className="button"
			onClick={() => shift!.addEntry().then(onShiftUpdate)}
			disabled={!hasRoom || timeUntilShift < SUBSCRIPTION_TIME_LIMIT}
		>
			Subscribe
		</button>
	);

};


interface DeleteButtonProps {
	shift: Shift;
	onShiftUpdate: () => void;
	onHide: (event: JSX.TargetedEvent) => void;
}


const DeleteShiftButton =
	({shift, onShiftUpdate, onHide}: DeleteButtonProps): JSX.Element =>
		<button class="button is-danger" onClick={e =>
			shift.delete().then(() => {

				onShiftUpdate();
				onHide(e);

			})
		}>Delete Shift</button>;


const ShiftEntry = ({name, email, userID, shift, onShiftUpdate}: {
	name: string;
	email: string;
	userID: string;
	shift: Shift;
	onShiftUpdate: () => void;
}): JSX.Element =>
	<tr>
		<td>
			{name}
		</td>
		<td>
			{email}
		</td>
		<td>
			<button className="button" onClick={() =>
				shift
					.deleteEntry(userID)
					.then(onShiftUpdate)
			}>Unsubscribe User</button>
		</td>
	</tr>;


export {AdminShiftModal, UserShiftModal};
