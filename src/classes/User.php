<?php

/**
 * Handles user sessions in SQL databases
 */
class User
{
	/**
	 * Stores the connection with the database.
	 *
	 * @var PDO
	 */
	private $connection;

	/**
	 * Associative array that stores the name of the tables in user database.
	 *
	 * @var array
	 */
	private $dbTables = [
		"userTable" => "users",
		"accessTable" => "access_levels"
	];

	/**
	 * Associative array that stores the column names of the table that holds
	 * user information.
	 *
	 * @var array
	 */
	private $userTable = [
		"id" => "user_id",
		"email" => "email",
		"name" => "name",
		"password" => "password",
		"accessLevel" => "access_level"
	];

	/**
	 * Associative array that stores the column names of the table that holds
	 * information about the access levels.
	 *
	 * @var array
	 */
	private $accessTable = [
		"id" => "level_id",
		"level" => "level"
	];

	/**
	 * A number that identifies the user in the database.
	 *
	 * @var int
	 */
	private $id;

	/**
	 * The name of the user. Set by the method retrieveData.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The name of the email. Set by the method retrieveData.
	 *
	 * @var string
	 */
	private $email;

	/**
	 * A string that identifies the user's access level. Set by the method
	 * retrieveData.
	 *
	 * @var string
	 */
	private $accessLevel;

	/**
 	 * Receives a PDO connection as the first argument. The constructor can also
	 * take an user id as an optional parameter. In this case the class will
	 * properly handle the user id and update the passed variable making
	 * possible to use PHP sessions to store the user's id. It's also possible
	 * to define the names of the tables and their columns passing they in
	 * associative arrays
	 *
	 * @param PDO $connection A PDO object connected to the users database
	 *
	 * @param int $userId Optional. If a variable is passed here it will be
	 * modified as needed, such as during login.
	 *
	 * @param array $dbTables An optional parameter that can be used to set the
	 * name of tables on the database. Defaults are:
	 * "userTable" => "users",
	 * "accessTable" => "access_levels"
	 *
	 * @param array $userTable An optional parameter that can be used to set the
	 * column names in the table that stores user data. Defaults are:
	 * | Key           | Default Value  |
	 * |---------------|----------------|
	 * | "id"          | "user_id"      |
	 * | "email"       | "email"        |
	 * | "name"        | "name"         |
	 * | "password"    | "password"     |
	 * | "accessLevel" | "access_level" |
	 *
	 * @param array $accessTable An optional parameter that can be used to set
	 * the column names in the table that stores access level data. If null is
	 * passed access levels will not be handled by the class. Defaults are:
	 * | Key     | Default Value |
	 * |---------|---------------|
	 * | "id"    | "level_id",   |
	 * | "level" | "level"       |
	 */
	public function __construct($connection, &$userId = null, $dbTables = [], $userTable = [], $accessTable = [])
	{
		$this->connection = $connection;
		$this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$this->id = &$userId;

		foreach ($dbTables as $column => $columnName) {
			if (isset($this->dbTables[$column]))
				$this->dbTables[$column] = $columnName;
		}

		foreach ($userTable as $column => $columnName) {
			if (isset($this->userTable[$column]))
				$this->userTable[$column] = $columnName;
		}

		if ($accessTable === null) {
			unset($this->accessTable);
			unset($this->userTable["accessLevel"]);
		} else {
			foreach ($accessTable as $column => $columnName) {
				if (isset($this->accessTable[$column]))
				$this->accessTable[$column] = $columnName;
			}
		}
	}

	/**
	 * Fills the properties of the object with the data in the user
	 * database. To avoid unnecessary connections to the database they are only
	 * populated when a get method is invoked
	 */
	private function retrieveData()
	{
		$query = $this->connection->prepare( (isset($this->accessTable) ?

			"SELECT {$this->userTable["email"]}, {$this->userTable["name"]},
			{$this->accessTable["level"]} FROM {$this->dbTables['userTable']}
			INNER JOIN {$this->dbTables["accessTable"]} ON
			{$this->dbTables["accessTable"]}.{$this->accessTable["id"]} =
			{$this->dbTables["userTable"]}.{$this->userTable["accessLevel"]}
			WHERE {$this->userTable["id"]}=?"
			:
			"SELECT {$this->userTable["email"]}, {$this->userTable["name"]},
			FROM {$this->dbTables['userTable']} WHERE {$this->userTable["id"]}=?"
		));
		$query->execute([$this->id]);
		$result = $query->fetch();

		$this->email = $result[$this->userTable["email"]];
		$this->name = $result[$this->userTable["name"]];
		$this->accessLevel = $result[$this->accessTable["level"]];
	}

	/**
	 * Takes an email, a password and a name as arguments and tries to create a
	 * new user in the database. Throws an exception in case an invalid email is
	 * provided or if a user already exists with that email in the database
	 *
	 * @param string $email Must be a valid email. Otherwise the function throws
	 * an error
	 *
	 * @param string $password Plain user's password
	 *
	 * @param string $name User's name
	 */
	public function register($email, $password, $name)
	{
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
			throw new Exception("Invalid Email");

		$query = $this->connection->prepare(
			"SELECT {$this->userTable["id"]} FROM {$this->dbTables['userTable']}
			WHERE {$this->userTable["email"]}=?"
		);

		$query->execute([$email]);

		if ($query->rowCount()) {
			throw new Exception("The email already exists in database");
		}

		$password = password_hash($password, PASSWORD_DEFAULT);

		$query = $this->connection->prepare(
			"INSERT INTO {$this->dbTables['userTable']}
			({$this->userTable["email"]}, {$this->userTable["name"]},
			{$this->userTable["password"]}) VALUES (?, ?, ?)"
		);

		$query->execute([$email, $name, $password]);
	}

	/**
	 * Identifies a user by checking the given email and then verify the
	 * password. Throws an error if the email does not exists in the database or
	 * the password is incorrect
	 *
	 * @param string $email User's Email
	 *
	 * @param string $password Plain user's password
	 */
	public function login($email, $password)
	{
		$query = $this->connection->prepare( (isset($this->accessTable) ?

			"SELECT {$this->userTable["id"]}, {$this->userTable["name"]},
			{$this->userTable["password"]}, {$this->accessTable["level"]}
			FROM {$this->dbTables['userTable']} INNER JOIN
			{$this->dbTables["accessTable"]} ON
			{$this->dbTables["accessTable"]}.{$this->accessTable["id"]} =
			{$this->dbTables["userTable"]}.{$this->userTable["accessLevel"]}
			WHERE {$this->userTable["email"]}=?"
			:
			"SELECT {$this->userTable["id"]}, {$this->userTable["name"]},
			{$this->userTable["password"]} FROM {$this->dbTables['userTable']}
			WHERE {$this->userTable["email"]}=?"
		));

		$query->execute([$email]);

		if (!$query->rowCount())
			throw new Exception("User not found in the database");

		$userData = $query->fetch();

		if (!password_verify($password, $userData["password"]))
			throw new Exception("Incorrect password");


		$this->id = $userData["user_id"];
		$this->name = $userData[$this->userTable["name"]];
		$this->accessLevel = $userData[$this->accessTable["level"]];
		$this->email = $email;
	}

	/**
	 * Returns true if user is logged or false if it's not
	 *
	 * @return bool
	 */
	public function isLogged()
	{
		return $this->id ? true : false;
	}

	/**
	 * Returns user's full name
	 *
	 * @return string
	 */
	public function getName()
	{
		if (!isset($this->name))
			$this->retrieveData();
		return $this->name;
	}

	/**
	 * Returns user's email
	 *
	 * @return string
	 */
	public function getEmail()
	{
		if (!isset($this->email))
			$this->retrieveData();
		return $this->email;
	}

	/**
	 * Returns a string that represents users access level if multiple levels
	 * are being used. Otherwise returns false
	 *
	 * @return string
	 */
	public function getAccessLevel()
	{
		if (!isset($this->accessTable))
			return false;
		if (!isset($this->accessLevel))
			$this->retrieveData();
		return $this->accessLevel;
	}

	/**
 	 * Modifies the user's name in the database and updates the object's property
	 *
	 * @param string $name User's new name
 	 */
	public function modifyName($name)
	{
		$query = $this->connection->prepare(
			"UPDATE {$this->dbTables['userTable']} SET
			{$this->userTable["name"]}=? WHERE {$this->userTable["id"]}=?"
		);

		$query->execute([$name, $this->id]);
		$this->name = $name;
	}

	/**
 	 * Modifies the user's email in the database and updates the object's property
	 *
	 * @param string $email User's new email
 	 */
	public function modifyEmail($email)
	{
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
			throw new Exception("Invalid Email");

		$query = $this->connection->prepare(
			"UPDATE {$this->dbTables['userTable']} SET
			{$this->userTable["email"]}=? WHERE {$this->userTable["id"]}=?"
		);

		$query->execute([$email, $this->id]);
		$this->email = $email;
	}

	/**
 	 * Modifies the user's password in the database
	 *
	 * @param string $email User's new plain password
 	 */
	public function modifyPassword($password)
	{
		$password = password_hash($password, PASSWORD_DEFAULT);

		$query = $this->connection->prepare(
			"UPDATE {$this->dbTables['userTable']} SET
			{$this->userTable["password"]}=? WHERE {$this->userTable["id"]}=?"
		);

		$query->execute([$password, $this->id]);
	}

	/**
 	 * Modifies the user's access level in the database and updates the object's
	 * property
	 *
	 * @param string $email User's new email
 	 */
	public function modifyAccessLevel($accessLevel)
	{
		$query = $this->connection->prepare(
			"SELECT {$this->accessTable["id"]} FROM
			{$this->dbTables['accessTable']} WHERE {$this->accessTable["level"]}=?"
		);

		$query->execute([$accessLevel]);

		if (!$query->rowCount()) {
			throw new Exception("Invalid access level");
		}

		$accessId = $query->fetch()[$this->accessTable["id"]];

		$query = $this->connection->prepare(
			"UPDATE {$this->dbTables['userTable']} SET
			{$this->userTable["accessLevel"]}=? WHERE {$this->userTable["id"]}=?"
		);

		$query->execute([$accessId, $this->id]);
		$this->accessLevel = $accessLevel;
	}

	/**
	 * Cleans object's properties and destroies current session
	 */
	public function logout()
	{
		$this->id = null;
		$this->name = null;
		$this->email = null;
		$this->accessLevel = null;
		session_destroy();
	}

	/* Admin Utilities
	__________________________________________________ */


	public function sudo($id)
	{
		return new User($this->connection, $id, $this->dbTables, $this->userTable, $this->accessTable);
	}

	/**
	 * Fetch data about the users from the database and returns an associative
	 * array containing id, email, name and access level from each user.
	 *
	 * @return array Array containing data about each user. The keys of the array
	 * are the name of the corresponding column in the database.
	 */
	public function getUserList()
	{
		$query = $this->connection->prepare(
			"SELECT {$this->userTable["id"]}, {$this->userTable["email"]},
			{$this->userTable["name"]}, {$this->accessTable["level"]}
			FROM	{$this->dbTables["userTable"]} LEFT JOIN
			{$this->dbTables["accessTable"]} ON
			{$this->dbTables["accessTable"]}.{$this->accessTable["id"]} =
			{$this->dbTables["userTable"]}.{$this->userTable["accessLevel"]}
			ORDER BY {$this->userTable["name"]};"
		);
		$query->execute();
		return $query->fetchAll();
	}


}
