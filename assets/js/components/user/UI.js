import Scheduler from "./Scheduler.js";
import SubscriptionList from "./SubscriptionList.js";
import {getWeekNumber} from "../../utils.js";


export default (() => {

	let scheduler;
	let subscriptionList;

	if (document.querySelector("#subscription-list")) {

		scheduler = new Scheduler("#shifts", {week: getWeekNumber()});
		subscriptionList = new SubscriptionList("#subscription-list", {});

		scheduler.addEventListener("shiftupdate", () =>
			subscriptionList.fetchSubscriptions());

		subscriptionList.addEventListener("shiftupdate", () =>
			scheduler.fetchWeek());

		scheduler.update();
		subscriptionList.update();

	}

	return {
		scheduler,
		subscriptionList,
	};

})();
