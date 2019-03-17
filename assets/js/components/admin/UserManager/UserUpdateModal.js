import Component from "../../Component.js";
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

	}


	render() {

		return `
		<div class="header">User Info</div>
		<div class="body">
			<label>
				<strong>Name:</strong>
				<input class="full-width" type="text" placeholder="${this.state.name}">
			</label>
			<label>
				<strong>Email:</strong>
				<input class="full-width" type="email" placeholder="${this.state.email}">
			</label>
			<label>
				<strong>Access Level</strong>
				<select name="access-level" value="${this.state.accessLevel}">
					<option value="user">User</option>
					<option value="admin">Administrator</option>
				</select>
			</label>

		</div>
		<div class="footer">
			<button class="primary" onclick="${this.getRef()}.updateUserInfo()">Update user info</button>
			<button onclick="${this.getRef()}.hide()">Cancel</button>
			<button class="danger" onclick="${this.getRef()}.deleteUser()">Delete user</button>
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


	updateUserInfo() {

		const [name, email, accessLevel] =
			document.querySelectorAll(`${this.mountSelector} input,select`);

		const userData = {};

		email.value && (userData.email = email.value);
		name.value && (userData.name = name.value);

		if (accessLevel.value !== this.state.accessLevel)
			userData.accessLevel = accessLevel.value;

		this.state.user.update(userData)
			.then(() => {

				this.update(userData);
				this.dispatchEvent({type: "userupdate"});

			});

	}


	deleteUser() {

		this.state.user.delete()
			.then(() => {

				this.update();
				this.dispatchEvent({type: "userupdate"});
				this.hide();

			});

	}


}


export default UserUpdateModal;
