import {observable, action, computed} from "mobx";
import Shift from "../Shift";
import {RootStore, UserRootStore} from "./RootStore";


const {
	MAXIMUM_SUBSCRIPTIONS,
	SUBSCRIPTION_TIME_LIMIT,
	UNSUBSCRIPTION_TIME_LIMIT,
} = window.config;


type SubscribersList = {name: string; email: string; userID: string}[];

class ShiftModalStore {

	public constructor(protected rootStore: RootStore<any>) {}

	@observable
	public shift!: Shift;

	@observable
	public date: Date = new Date();

	@observable
	public capacity = 0;

	@observable
	public subscriptions = 0;

	@observable
	public sector = "";

	@observable
	public isFetching = false;

	@observable
	public hasFetched = false;

	@observable
	public isShowingShiftModal = false;

	@action
	public displayShiftData = (id?: string): void => {

		if (id !== void 0) this.shift = new Shift(id);

		this.isShowingShiftModal = true;
		this.isFetching = true;
		this.shift!.fetchData().then(data =>
			Object.assign(this, {isFetching: false, hasFetched: true, ...data}));

	}

	@action
	public hideShiftData = (): void => void (this.isShowingShiftModal = false);

	@action
	public refreshData = (): void => {

		this.isFetching = true;
		this.rootStore.refreshData();
		this.shift!.fetchData().then(data =>
			Object.assign(this, {isFetching: false, hasFetched: true, ...data}));

	}

}


class UserShiftModalStore extends ShiftModalStore {

	protected rootStore!: UserRootStore;

	@observable
	public isSubscribed = false;

	@action
	public subscribe = (): void => {

		this.shift!.addEntry().then(this.refreshData as () => void);

	}

	@action
	public unsubscribe = (): void => {

		this.shift!.deleteEntry().then(this.refreshData as () => void);

	}

	@computed public get canSubscribe(): boolean {

		const {date, subscriptions, capacity,
			rootStore: {subscriptionList}} = this;

		// Time until shift start in minutes
		const timeUntilShift = (date.valueOf() - new Date().valueOf()) / 60000;
		const hasRoom = subscriptions! < capacity!;

		const hasReachedlimit = subscriptionList
			.filter(({sector}) => sector === this.sector)
			.length >= MAXIMUM_SUBSCRIPTIONS;

		const hasOverlappingShift = subscriptionList
			.some(shift => shift.date.valueOf() === date.valueOf());


		return hasRoom && !hasOverlappingShift && !hasReachedlimit &&
			timeUntilShift > SUBSCRIPTION_TIME_LIMIT;

	}

	@computed public get canUnsubscribe(): boolean {

		// Time until shift start in minutes
		return (this.date.valueOf() - new Date().valueOf()) /
			60000 > UNSUBSCRIPTION_TIME_LIMIT;

	}

}


class AdminShiftModalStore extends ShiftModalStore {

	@observable
	public subscribersList: SubscribersList = [];

	@action
	public deleteShift = (): void => {

		this.shift.delete().then(() => {

			this.refreshData();
			this.hideShiftData();

		});

	}

	@action
	public subscribeUser = (id: string): void => {

		this.shift
			.addEntry(id)
			.then(this.refreshData);

	}

	@action
	public unsubscribeUser = (id: string): void => {

		this.shift
			.deleteEntry(id)
			.then(this.refreshData);

	}

}


export {ShiftModalStore, UserShiftModalStore, AdminShiftModalStore};
