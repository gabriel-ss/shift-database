import {observable, action} from "mobx";
import Shift, {UserSubscription, Schedule} from "../Shift";
import {getWeekNumber} from "../utils";
import {UserShiftModalStore, ShiftModalStore, AdminShiftModalStore} from "./ShiftModalStore";
import User from "../User";


abstract class RootStore<T extends ShiftModalStore> {

	public abstract shiftStore: T;

	@observable
	public currentSelectedWeek: string = getWeekNumber();

	@observable
	public currentSelectedWeekSchedule: Schedule = {};

	@observable
	public isShowingShiftModal = false;

	@action
	public setCurrentWeek = (week: string): void => {

		this.currentSelectedWeek = week;
		this.fetchCurrentWeekSchedule();

	}

	@action
	public fetchCurrentWeekSchedule = (): void => {

		Shift.fetchWeek(this.currentSelectedWeek)
			.then(schedule => (this.currentSelectedWeekSchedule = schedule));

	}

	@action
	public abstract refreshData: () => void;

}


class UserRootStore extends RootStore<UserShiftModalStore> {

	public constructor() {

		super();
		this.refreshData();

	}

	public shiftStore: UserShiftModalStore = new UserShiftModalStore(this);

	@observable
	public subscriptionList: UserSubscription[] = [];

	@action
	public fetchSubscriptions = (): void => {

		Shift.fetchSubscriptions().then(list => (this.subscriptionList = list));

	}

	@action
	public refreshData = (): void => {

		this.fetchSubscriptions();
		this.fetchCurrentWeekSchedule();

	}

}


class AdminRootStore extends RootStore<AdminShiftModalStore> {

	public constructor() {

		super();
		this.refreshData();

	}

	public shiftStore: AdminShiftModalStore = new AdminShiftModalStore(this);

	@observable
	public isCreatingShifts = false;

	@observable
	public isShowingUserCreationModal = false;

	@observable
	public isShowingUserUpdateModal = false;

	@observable
	public userList = [] as User[];

	@observable
	public selectedUser = 0;

	@action
	public setIsCreatingShifts = (value: boolean): void => {

		this.isCreatingShifts = value;

	}

	@action
	public refreshData = (): void => {

		this.fetchCurrentWeekSchedule();

	}

}


export {RootStore, UserRootStore, AdminRootStore};
