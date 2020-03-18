import {Component, h, JSX} from "preact";
import User from "../../User";
import UserUpdateModal from "./UserUpdateModal";
import UserCreationModal from "./UserCreationModal";


class UserManager extends Component {

	public state = {
		userList: [] as User[],
		isShowingCreationModal: false,
		isShowingUpdateModal: false,
		selectedUser: 0,
	}

	public constructor(props: {}) {

		super(props);

		this.fetchUserList();

	}


	public render(): JSX.Element {

		return (
			<div class="container">
				<button
					className="button"
					onClick={() => this.setState({isShowingCreationModal: true})}
				>Add users</button>
				<table className="table is-fullwidth">
					<thead>
						<tr>
							<th>E-mail</th>
							<th>Name</th>
							<th>Access Level</th>
						</tr>
					</thead>
					<tbody id="user-list">
						{this.state.userList.map((user, index) =>
							<UserEntry user={user} onClick={() =>	this.setState({
								isShowingUpdateModal: true,
								selectedUser: index,
							})} />)}
					</tbody>
				</table>
				<UserCreationModal
					isActive={this.state.isShowingCreationModal}
					onUserUpdate={this.fetchUserList}
					onHide={() => this.setState({isShowingCreationModal: false})}
				/>
				<UserUpdateModal
					isActive={this.state.isShowingUpdateModal}
					onUserUpdate={this.fetchUserList}
					onHide={() => this.setState({isShowingUpdateModal: false})}
					user={this.state.userList[this.state.selectedUser]}
				/>
			</div>
		);

	}


	private fetchUserList = (): void => {

		User.fetchAll().then(userList => this.setState({userList}));

	}

}


const UserEntry = (
	{user, onClick}:
	{user: User; onClick: () => void},
): JSX.Element =>
	<tr onClick={onClick}>
		<td>{user.email}</td>
		<td>{user.name}</td>
		<td>{user.accessLevel}</td>
	</tr>;


export default UserManager;
