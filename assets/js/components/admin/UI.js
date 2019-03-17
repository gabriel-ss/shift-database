import UserManager from "./UserManager/UserManager.js";
import ShiftManager from "./ShiftManager/ShiftManager.js";
import {getWeekNumber} from "../../utils.js";


export default (() => {

	let shiftManager;
	let userManager;

	if (document.querySelector("#user-update-modal")) {

		shiftManager = new ShiftManager("#shifts", {week: getWeekNumber()});
		userManager = new UserManager("#users", {});

		shiftManager.update();
		userManager.update();

	}

	return {
		shiftManager,
		userManager,
	};

})();
