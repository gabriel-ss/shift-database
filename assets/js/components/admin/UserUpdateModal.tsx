import {Component, h, JSX} from "preact";
import Modal from "../shared/Modal";
import User, {NewUserData} from "../../User";


interface UserUpdateModalProps {
	isActive: boolean;
	onUserUpdate: () => void;
	onHide: JSX.GenericEventHandler<any>;
	user: User;
}


interface UserUpdateModalState {
	email?: string;
	name?: string;
	accessLevel?: string;
}


class UserUpdateModal
	extends Component<UserUpdateModalProps, UserUpdateModalState> {

	public render(): JSX.Element | undefined {

		if (!this.props.user) return;

		return (
			<Modal isActive={this.props.isActive} onHide={this.props.onHide}>
				<div className="modal-card">
					<div class="modal-card-head">
						<p class="modal-card-title">User Info</p>
						<button class="delete" onClick={this.props.onHide}></button>
					</div>
					<div class="modal-card-body">
						<label className="field label">
							Name:
							<input class="input is-fullwidth" type="text"	value={this.state.name}
								onInput={
									e => this.setState({name: e.currentTarget.value})}
								placeholder={this.props.user.name}
							/>
						</label>
						<label className="field label">
							Email:
							<input
								class="input is-fullwidth" type="email"	value={this.state.email}
								onInput={
									e => this.setState({email: e.currentTarget.value})}
								placeholder={this.props.user.email} />
						</label>
						<label className="field label">
							Access Level
							<div className="select is-fullwidth">
								<select
									name="access-level" value={this.state.accessLevel}
									onChange={e => this
										.setState({accessLevel: e.currentTarget.value})}
								>
									<option value="user">User</option>
									<option value="admin">Administrator</option>
								</select>
							</div>
						</label>

					</div>
					<div class="modal-card-foot">
						<button class="button is-primary" onClick={this.updateUserInfo}>Update user info</button>
						<button class="button" onClick={this.props.onHide}>Cancel</button>
						<button class="button is-danger" onClick={this.deleteUser}>Delete user</button>
					</div>
				</div>
			</Modal>
		);

	}


	private updateUserInfo = (): void => {

		const {name, email, accessLevel} = this.state;
		const {user, onUserUpdate} = this.props;
		const userData: NewUserData = {};

		if (email !== user.email) userData.email = email;
		if (name !== user.name) userData.name = name;
		if (accessLevel !== user.accessLevel) userData.accessLevel = accessLevel;

		user.update(userData).then(onUserUpdate);

	}


	private deleteUser = (event: Event): void => {

		this.props.user.delete()
			.then(() => {

				this.props.onUserUpdate();
				this.props.onHide(event);

			});

	}


}


export default UserUpdateModal;
