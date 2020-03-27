import {h, JSX, FunctionalComponent} from "preact";
import Modal from "../shared/Modal";
import {observer} from "mobx-preact";
import {RootStore} from "../../stores/RootStore";
import {
	AdminShiftModalStore,
	UserShiftModalStore,
	ShiftModalStore,
} from "../../stores/ShiftModalStore";


const AdminShiftModal: FunctionalComponent<{store:
RootStore<AdminShiftModalStore>;}> =
	observer(props =>
		<ShiftModal
			store={props.store}
			button={({store}) => <DeleteShiftButton store={store} />}
			subscribersList={({store}) => <SubscribersList store={store} />}
		/>);


const UserShiftModal: FunctionalComponent<{store:
RootStore<UserShiftModalStore>;}> =
	observer(props =>
		<ShiftModal
			store={props.store}
			button={({store}) => <SubscribeButton store={store}/>}
		/>);


const ShiftModal = observer(<T extends ShiftModalStore>(props: Readonly<{
	store: RootStore<T>;
	button: (props: {store: T}) => JSX.Element;
	subscribersList?: (props: {store: AdminShiftModalStore}) => JSX.Element;
}>): JSX.Element => {

	const {shiftStore: store} = props.store;

	if (store.isFetching) {

		return <Modal isActive={store.isShowingShiftModal}
			onHide={store.hideShiftData}><div>Spinner</div></Modal>;

	}

	return (
		<Modal
			isActive={store.isShowingShiftModal}
			onHide={store.hideShiftData}
		>
			<div className="modal-card">
				<div class="modal-card-head">
					<p class="modal-card-title">Shift at {store.sector}</p>
					<button class="delete" onClick={store.hideShiftData}></button>
				</div>
				<div class="modal-card-body">
					<div className="columns">
						<div className="column">
							<strong>Date:</strong>
							<p>{store.date?.toLocaleDateString()}</p>
							<strong>Start Time:</strong>
							<p>{store.date?.toTimeString().substring(0, 5)}</p>
						</div>
						<div className="column">
							<strong>Capacity:</strong>
							<p>{store.capacity}</p>
							<strong>Subscriptions:</strong>
							<p>{store.subscriptions}</p>
						</div>
					</div>
					{props.subscribersList?.(
						{store} as unknown as {store: AdminShiftModalStore})}
				</div>
				<div class="modal-card-foot">
					{props.button({store})}
				</div>
			</div>
		</Modal>
	);

});


const SubscribeButton: FunctionalComponent<{store: UserShiftModalStore}> =
	observer(({store}) => {

		if (store.isFetching) return <button className="button is-loading" />;

		if (store.isSubscribed) {

			return (
				<button
					className="button"
					onClick={store.unsubscribe}
					disabled={!store.canUnsubscribe}
				>
				Unsubscribe
				</button>
			);

		}

		return (
			<button
				className="button"
				onClick={store.subscribe}
				disabled={!store.canSubscribe}
			>
			Subscribe
			</button>
		);

	});


const DeleteShiftButton: FunctionalComponent<{store: AdminShiftModalStore}> =
	observer(({store}) =>
		<button
			class="button is-danger"
			onClick={store.deleteShift}
		>Delete Shift</button>);


const SubscribersList: FunctionalComponent<{store: AdminShiftModalStore}> =
({store}) =>
	<div>
		<strong>Subscribed Users:</strong>
		<table className="table is-fullwidth">
			{
				!store.subscribersList.length
					? <tr><td>--</td></tr>
					: store.subscribersList.map(entry =>
						<tr>
							<td>{entry.name}</td><td>{entry.email}</td>
							<td>
								<button className="button" onClick={() =>
									store.unsubscribeUser(entry.userID)
								}>Unsubscribe User</button>
							</td>
						</tr>)
			}
		</table>
	</div>;


export {AdminShiftModal, UserShiftModal};
