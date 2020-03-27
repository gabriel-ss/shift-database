type Schedule = Record<string, Record<number, Record<string, {
	shift_id: string;
	remainingSpace: number;
}>>>
interface UserSubscription{shiftID: string; date: Date; sector: string}


class Shift {

	public constructor(public readonly id: string) {}


	public static async fetchSectorList(): Promise<string[]> {

		const response = await fetch("request-processor.php?intention=get_sector_list", {
			method: "GET",
			credentials: "same-origin",
		});

		if (!response.ok) throw new Error("Failed to fetch sector list");

		return response.json();

	}


	public static async fetchWeek(week: string): Promise<Schedule> {

		const response = await fetch(`request-processor.php?intention=get_table&week=${week}`, {
			method: "GET",
			credentials: "same-origin",
		});

		if (!response.ok) throw new Error("Failed to fetch schedule of the week");

		return response.json();

	}


	public static async fetchSubscriptions(userID?: number):
	Promise<UserSubscription[]> {

		const response = await fetch(`request-processor.php?intention=get_user_subscriptions&userId=${userID}`, {
			method: "GET",
			credentials: "same-origin",
		});

		if (!response.ok) throw new Error("Failed to fetch user subscriptions");

		const list = await response.json();

		/* eslint-disable @typescript-eslint/camelcase */
		return list.map((
			{shift_id, date, sector_name}:
			{shift_id: string; date: string; sector_name: string},
		) =>
			({shiftID: shift_id, date: new Date(date), sector: sector_name}));
		/* eslint-enable @typescript-eslint/camelcase */

	}


	public static async create(shifts: {
		weekAndDay: string;
		time: string;
		shiftCapacity: number;
		sector: string;
	}[]): Promise<void> {

		const response = await fetch("request-processor.php?intention=create_shifts", {
			method: "POST",
			credentials: "same-origin",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(shifts),
		});


		if (!response.ok) throw new Error("Failed to create shifts");

	}


	public async fetchData(userID?: number):
	Promise<{
		shift: Shift;
		date: Date;
		capacity: number;
		subscribersList?: {name: string; email: string; userID: string}[];
		subscriptions: number;
		isSubscribed: boolean;
		sector: string;
	}> {

		const response = await fetch(`request-processor.php?intention=get_shift_info&shift_id=${this.id}${userID ? `&user_id=${userID}` : ""}`, {
			method: "GET",
			credentials: "same-origin",
		});

		if (!response.ok) throw new Error("Failed to shift data");

		const data = await response.json();

		return {
			shift: new Shift(this.id),
			date: new Date(data.date),
			capacity: Number(data.user_count),
			subscribersList: data.user_list && data.user_list.map(
				({name, email, userId}: Record<string, string>) =>
					({name, email, userID: userId}),
			),
			subscriptions: Number(data.subscriptions ?? data.user_list.length),
			isSubscribed: data.is_subscribed,
			sector: data.sector_name,
		};

	}


	public async addEntry(userID?: string): Promise<void> {

		const response = await fetch(`request-processor.php?intention=subscribe&shift_id=${this.id}${userID ? `&user_id=${userID}` : ""}`, {
			method: "GET",
			credentials: "same-origin",
		});

		if (!response.ok) throw new Error("Failed to subscribe");

	}


	public async deleteEntry(userID?: string): Promise<void> {

		const response = await fetch(`request-processor.php?intention=unsubscribe&shift_id=${this.id}${userID ? `&user_id=${userID}` : ""}`, {
			method: "GET",
			credentials: "same-origin",
		});

		if (!response.ok) throw new Error("Failed to unsubscribe");

	}


	public async delete(): Promise<void> {

		const response = await fetch(`request-processor.php?intention=delete_shift&shift_id=${this.id}`, {
			method: "GET",
			credentials: "same-origin",
		});

		if (!response.ok) throw new Error("Failed to delete shift");

	}

}

export default Shift;
export {Schedule, UserSubscription};
