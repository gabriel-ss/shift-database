// import Tabs from "./tabs.js";
// import Modal from "./modal.js";
// import Slideshow from "./slideshow.js";
import ShiftTable from "./ShiftTable.js";
import UserManagementUI from "./UserManagementUI.js";
import widgets from "./widgets/widgets.js";

if (document.querySelector("#shift-table")) {

	const shiftTable = new ShiftTable();

	shiftTable.updateTable();

}

UserManagementUI.updateTable();
