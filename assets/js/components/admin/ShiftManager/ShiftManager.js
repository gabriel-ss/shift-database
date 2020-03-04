import Component from "../../Component.js";
import ShiftScheduler from "./ShiftScheduler.js";
import ShiftViewer from "./ShiftViewer.js";

const {DEFAULT_SHIFT_CAPACITY, DEFAULT_SCHEDULE} = window.config;

class ShiftManager extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			week: state.week,
			isCreating: false,
		};

		ShiftViewer.insertIntoParent(this, "viewer", {week: this.state.week});


		ShiftScheduler
			.insertIntoParent(this, "scheduler", {
				week: this.state.week,
				schedule: [...DEFAULT_SCHEDULE],
				defaultCapacity: DEFAULT_SHIFT_CAPACITY,
				sectorList: [],
			})
			.addEventListener("shiftcreation", () =>
				this.childComponents.viewer.updateWeek());

	}


	render() {

		return `
		<div class="container">
			<div style="display: flex">
				<input id="week-selector" type="week" value="${this.state.week || ""}" oninput="${this.getRef()}.onWeekChange(this)">
				<button class="tab-title" onclick="${this.getRef()}.update({isCreating: true})">Scheduler</button>
				<button class="tab-title" onclick="${this.getRef()}.update({isCreating: false})">Shift Viewer</button>
			</div>
			${this.state.isCreating
		? this.childComponents.scheduler
		: this.childComponents.viewer}
		</div>
			`;

	}


	onWeekChange(element) {

		const data = {week: element.value};

		this.broadcast(data);
		this.childComponents.viewer.updateWeek();

	}


}


export default ShiftManager;
