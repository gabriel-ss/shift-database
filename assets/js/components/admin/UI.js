import UserManager from "./UserManager/UserManager.js";
import ShiftManager from "./ShiftManager/ShiftManager.js";
import ConfigManager from "./ConfigManager/ConfigManager.js";
import {getWeekNumber} from "../../utils.js";


export default (() => {

	let shiftManager;
	let userManager;
	let configManager;

	if (document.querySelector("#user-update-modal")) {

		shiftManager = new ShiftManager("#shifts", {week: getWeekNumber()});
		userManager = new UserManager("#users", {});
		configManager = new ConfigManager("#sysconfig", window.config);

		shiftManager.update();
		userManager.update();
		configManager.update();

	}

	return {
		shiftManager,
		userManager,
		configManager,
	};

})();
