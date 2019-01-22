const User = (() => {

	const User = function(userId) {

		this.userId = userId;

	};

	User.getLevelName = levelCode =>
		({"user": "User",
			"admin": "Administrator"}[levelCode]);

	User.getLevelCode = levelName =>
		({"User": "user",
			"Administrator": "admin"}[levelName]);

	User.fetchAll = function() {

		return fetch("request-processor.php?intention=get_user_list", {
			method: "GET",
			credentials: "same-origin",
		}).then(list => list.json());

	};

	User.create = function(users) {

		return fetch("request-processor.php?intention=register_users", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(users),
		});

	};


	User.prototype = {

		update(fields) {

			const {name, email, password, accessLevel} = fields;

			return fetch("request-processor.php?intention=update_user", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					id: this.userId,
					values: {
						name,
						email,
						password,
						accessLevel,
					},
				}),
			});

		},


		delete() {

			return fetch(
				`request-processor.php?intention=delete_user&user_id=${this.userId}`,
			);

		},

	};


	return User;

})();

export default User;
