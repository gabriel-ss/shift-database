import {Component, h, JSX} from "preact";
import Modal from "../shared/Modal";
import User from "../../User";


interface UserCreationModalProps {
	isActive: boolean;
	onUserUpdate: () => void;
	onHide: JSX.MouseEventHandler<any>;
}

class UserCreationModal extends Component<UserCreationModalProps> {

	public state = {
		separator: "\t",
		userList: "",
	}

	public render(): JSX.Element {

		return (
			<Modal isActive={this.props.isActive} onHide={this.props.onHide}>
				<div className="modal-card">
					<div className="modal-card-head">
						<p className="modal-card-title">Add users</p>
						<button class="delete" onClick={this.props.onHide}></button>
					</div>
					<div className="modal-card-body">
						<label className="label field">
							User list:
							<textarea
								className="textarea"
								value={this.state.userList}
								onInput={e =>
									this.setState({userList: e.currentTarget.value})}
							/>
						</label>
						<div className="field">
							<label class="label">Separator: </label>
							<label className="radio"><input
								type="radio" value="\t"
								checked={this.state.separator === "\t"}
								onInput={e =>
									this.setState({separator: e.currentTarget.value})}
							/>Tabulations</label>
							<label className="radio"><input
								type="radio" value=","
								checked={this.state.separator === ","}
								onInput={e =>
									this.setState({separator: e.currentTarget.value})}
							/>Commas</label>
						</div>
						<p>
							Enter the email, initial password and name of each user to
							be created respectively in a single line separated by the
							character selected above. More than one line can be used at
							once to create multiple users.
						</p>
					</div>
					<div className="modal-card-foot">
						<button className="button is-primary" onClick={this.addUsers}>Add users</button>
						<button className="button" onClick={this.props.onHide}>Cancel</button>
					</div>
				</div>
			</Modal>
		);

	}


	private addUsers = (): void => {

		const userList = this.state.userList
			.split("\n")
			.map(line => {

				const [email, password, name] = line.split(this.state.separator);

				return {email, password, name};

			});


		User.create(userList).then(this.props.onUserUpdate);

	}


}


export default UserCreationModal;
