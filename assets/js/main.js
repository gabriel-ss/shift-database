// import Tabs from "./tabs.js";
// import Modal from "./modal.js";
// import Slideshow from "./slideshow.js";
import Framework from "./framework/framework.js";
import ShiftTable from "./ShiftTable.js";
import UserManagementUI from "./UserManagementUI.js";

if (document.querySelector("#shift-table")) {

	const shiftTable = new ShiftTable();

	shiftTable.updateTable();

}

UserManagementUI.updateTable();
