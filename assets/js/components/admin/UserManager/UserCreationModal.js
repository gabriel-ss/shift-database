import Component from "../../Component.js";
import User from "../../../User.js";
import widgets from "../../../widgets/widgets.js";


class UserUpdateModal extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			user: state.user,
			email: state.email,
			name: state.name,
			accessLevel: state.accessLevel,
		};

		this.update();

	}


	render() {

		return `
		<div class="header">Add users</div>
		<div class="body">
			<label>
				<strong>User list:</strong>
				<textarea class="full-width"></textarea>
			</label>
			<p>
				Enter the email, initial password and name of each user to be created
				respectively in a single line separated by the character selected
				below. More than one line can be used at once to create multiple
				users.
			</p>
			<strong>Separator:</strong>
			<div style="display: flex">
				<label><input name="separator" checked type="radio" id="\t" />Tabulations</label>
				<label><input name="separator" type="radio" id="," />Commas</label>
			</div>
		</div>
		<div class="footer">
			<button onclick="${this.getRef()}.addUsers()">Add users</button>
		</div>
			`;

	}

	hide() {

		widgets(this.mountSelector)[0].hide();

	}


	show() {

		widgets(this.mountSelector)[0].show();

	}


	runAfterUpdate() {

		widgets(this.mountSelector)[0].addCloseButton();

	}


	addUsers() {

		const separator = document
			.querySelector('input[name="separator"]:checked').id;

		const userList = document
			.querySelector("#user-creation-modal textarea")
			.value
			.split("\n")
			.map(line => {

				const [email, password, name] = line.split(separator);

				return {email, password, name};

			});


		User.create(userList).then(() => {

			this.dispatchEvent({type: "usercreation"});

		});

	}


}


export default UserUpdateModal;
