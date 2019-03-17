import Component from "../../../Component.js";


class ShiftEntry extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			userId: state.userId,
			name: state.name,
			email: state.email,
			shift: state.shift,
		};

	}


	render() {

		return `
		<tr>
			<td>
				${this.state.name}
			</td>
			<td>
				${this.state.email}
			</td>
			<td onclick="${this.getRef()}.unsubscribeUser()">
				<button>Unsubscribe User</button>
			</td>
		</tr>`;

	}


	unsubscribeUser() {

		this.state.shift
			.deleteEntry(this.state.userId)
			.then(() => this.dispatchEvent({type: "shiftupdate"}));

	}

}


export default ShiftEntry;
