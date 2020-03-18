interface NewUserData
{name?: string; email?: string; password?: string; accessLevel?: string}

type UserCreationList = {email: string; name: string; password: string}[]


class User {

	private constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly email: string,
		public readonly accessLevel: string,
	) {}


	public async update(userData: NewUserData): Promise<User> {

		const {name, email, password, accessLevel} = userData;

		const response = await fetch("request-processor.php?intention=update_user", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				id: this.id,
				values: {name, email, password, accessLevel},
			}),
		});

		if (!response.ok) throw new Error("Failed to update user data");

		return new User(
			this.id,
			name ?? this.name,
			email ?? this.email,
			accessLevel ?? this.accessLevel,
		);

	}


	public async delete(): Promise<void> {

		const response = await fetch(
			`request-processor.php?intention=delete_user&user_id=${this.id}`,
		);

		if (!response.ok) throw new Error("Failed to update user data");

	}


	public static getLevelName = (levelCode: string) =>
		({"user": "User",
			"admin": "Administrator"}[levelCode]);

	public static getLevelCode = (levelName: string) =>
		({"User": "user",
			"Administrator": "admin"}[levelName]);


	public static async fetchAll(): Promise<User[]> {

		const response = await fetch("request-processor.php?intention=get_user_list", {
			method: "GET",
			credentials: "same-origin",
		});

		const userList: UserData[] = await response.json();

		return userList
			.sort(({name: user1}, {name: user2}) => (user1 > user2 ? 1 : -1))
			.map(({id, name, email, accessLevel}) =>
				new User(id, name, email, accessLevel));

	}


	public static async create(users: UserCreationList): Promise<void> {

		const response = await fetch("request-processor.php?intention=register_users", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(users),
		});

		if (!response.ok) throw new Error("Failed to create users");

	}


}


export default User;
export {NewUserData, UserCreationList};
