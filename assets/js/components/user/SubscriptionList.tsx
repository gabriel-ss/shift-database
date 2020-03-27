import {h, JSX, FunctionalComponent} from "preact";
import {UserSubscription} from "../../Shift";
import {observer} from "mobx-preact";
import {UserRootStore} from "../../stores/RootStore";


const SubscriptionList: FunctionalComponent<{store: UserRootStore}> =
	observer(props =>
		<div class="container">
			<table className="table is-fullwidth">
				<thead>
					<tr><th>Date</th><th>Time</th><th>Sector</th></tr>
				</thead>
				<List {...props} />
			</table>
		</div>);


const List: FunctionalComponent<{store: UserRootStore}> = observer(props => {

	if (!props.store.subscriptionList || !props.store.subscriptionList.length)
		return <tbody><tr><td>--</td><td>--</td><td>--</td></tr></tbody>;

	return <tbody>{
		props.store.subscriptionList.reduce(
			(acc: JSX.Element[], entry: UserSubscription) => [
				...acc,
				<tr onClick={
					() => props.store.shiftStore.displayShiftData(entry.shiftID)}>
					<td>{entry.date.toLocaleDateString()}</td>
					<td>{entry.date.toTimeString().substring(0, 5)}</td>
					<td>{entry.sector}</td>
				</tr>,
			], [] as JSX.Element[],
		)
	}</tbody>;

});


export default SubscriptionList;
