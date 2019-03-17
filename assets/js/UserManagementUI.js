import widgets from "./widgets/widgets.js";
import User from "./User.js";

const UserManagementUI = (() => {


	document.querySelector("#user-creation-button")
		.addEventListener("click", async() => {

			const userList = document
				.querySelector("#user-creation-modal textarea")
				.value
				.split("\n")
				.map(line => line.split("\t"));


			await User.create(userList);
			UserManagementUI.updateTable();

		});


	const [modal] = widgets("#user-update-modal");

	modal.inputs = {};
	modal.buttons = {};

	[
		modal.inputs.name,
		modal.inputs.email,
		modal.inputs.accessLevel,
	] = modal.element.querySelectorAll("input,select");

	[modal.buttons.update, , modal.buttons.delete] =
		modal.element.querySelectorAll(".footer button");


	const UserManagementUI = {

		tableElement: document.querySelector("#user-list"),

		modal,

		generateTableContent(users) {

			return users.map(user => {

				const [id, email, name, accessLevel] = user;

				return `<tr class="user" data-user-id=${id}>
					<td>${email}</td>
					<td>${name}</td>
					<td>${accessLevel}</td>
				</tr>`;

			}).join("");

		},


		updateModal(id, email, name, accessLevel) {

			const {inputs, buttons} = this.modal;
			const user = new User(id);

			inputs.email.setAttribute("placeholder", email);
			inputs.name.setAttribute("placeholder", name);
			inputs.accessLevel.value = accessLevel;

			this.modal.show();


			buttons.update.onclick = async() => {

				// FIXME: Change access level bug
				const userData = {};

				inputs.email.value && (userData.email = inputs.email.value);
				inputs.name.value && (userData.name = inputs.name.value);
				inputs.accessLevel.value !== accessLevel &&
					(userData.accessLevel = inputs.accessLevel.value);

				await user.update(userData);
				UserManagementUI.updateTable();

			};

			buttons.delete.onclick = async() => {

				await user.delete();
				UserManagementUI.updateTable();

			};


		},


		async updateTable() {

			const users = await User.fetchAll();

			users.sort((u1, u2) => (u1[2] > u2[2] ? 1 : -1));
			this.tableElement.innerHTML = this.generateTableContent(users);

			document.querySelectorAll(".user")
				.forEach(tableRow => {

					const cells = [...tableRow.querySelectorAll("td")];

					tableRow.addEventListener("click", () => {

						this.updateModal(
							tableRow.dataset.userId,
							...cells.map(cell => cell.innerText)
						);

					});


				});

		},

	};


	return UserManagementUI;

})();


export default UserManagementUI;
