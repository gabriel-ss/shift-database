import Component from "../../Component.js";
import User from "../../../User.js";
import UserUpdateModal from "./UserUpdateModal.js";
import UserCreationModal from "./UserCreationModal.js";
import UserEntry from "./UserEntry.js";


class UserManager extends Component {

	constructor(mountSelector, state, options) {

		super(mountSelector, options);

		this.state = {
			listPage: state.listPage,
		};

		UserUpdateModal
			.insertIntoParent(this, "updateModal", {}, "#user-update-modal")
			.addEventListener("userupdate", () => this.fetchUserList());

		UserCreationModal
			.insertIntoParent(this, "creationModal", {}, "#user-creation-modal")
			.addEventListener("usercreation", () => this.fetchUserList());

		this.fetchUserList();

	}


	render() {

		return `
		<div class="container">
			<button onclick="${this.getRef()}.showCreationModal()">Add users</button>
			<table>
				<thead>
					<th>E-mail</th>
					<th>Name</th>
					<th>Access Level</th>
				</thead>
				<tbody id="user-list">
					${this.childComponents.reduce((acc, child) =>
						acc + child.render(), "")}
				</tbody>
			</table>
		</div>
			`;

	}


	fetchUserList() {

		User.fetchAll().then(users => {

			users.sort((user1, user2) => (user1.name > user2.name ? 1 : -1));

			users.forEach((user, index) => {

				const userData = {
					user: new User(user.id),
					email: user.email,
					name: user.name,
					accessLevel: user.accessLevel,
				};

				UserEntry.insertIntoParent(this, index, userData)
					.addEventListener("userselect", () => {

						this.childComponents.updateModal.update(userData).show();

					});

			});

			this.update();

		});

	}


	showCreationModal() {

		this.childComponents.creationModal.show();

	}


	showUpdateModal() {

		this.childComponents.updateModal.show();

	}


}


export default UserManager;
