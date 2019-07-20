import Component from "../../Component.js";


class UserEntry extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			user: state.user,
			email: state.email,
			name: state.name,
			accessLevel: state.accessLevel,
		};

	}


	render() {

		return `<tr onclick="${this.getRef()}.onclick()">
			<td>${this.state.email}</td>
			<td>${this.state.name}</td>
			<td>${this.state.accessLevel}</td>
			`;

	}


	onclick() {

		this.dispatchEvent({type: "userselect"});

	}


	showCreationModal() {

		this.childComponents.creationModal.show();

	}


	showUpdateModal() {

		this.childComponents.updateModal.show();

	}


}


export default UserEntry;
