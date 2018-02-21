<?php

/**
 * Handles user sessions in SQL databases
 */
class User
{
	/**
 	 * Stores the connection with the database
 	 * @var PDO
 	 */
	private $connection;

	private $dbTables = [
		  "userTable" => "users",
		  "accessTable" => "access_levels"
	  ];

	private $userTable = [
		  "id" => "user_id",
		  "email" => "email",
		  "name" => "name",
		  "password" => "password",
		  "accessLevel" => "access_level"
	  ];

	private $accessTable = [
			"id" => "level_id",
			"level" => "level"
		];

	private $id;

	private $name;

	private $email;

	private $accessLevel;

	/**
	 * Receives a PDO connection as the first argument. The constructor can also
 	 * take an user id as an optional parameter. In this case the class will
 	 * properly handle the user id and update the passed variable making
 	 * possible to use PHP sessions to store the user's id.
 	 *
 	 * @param PDO $connection A PDO object connected to the users database
 	 * @param int $userId Optional. If a variable is passed here it will be
 	 * modified as needed, such as during login.
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

	private function retrieveData()
	{
		$query = $this->connection->prepare( (isset($this->accessTable) ?

			"SELECT {$this->userTable["email"]}, {$this->userTable["name"]}, " .
			"{$this->userTable["password"]}, {$this->accessTable["level"]} ".
			"FROM {$this->dbTables['userTable']} INNER JOIN " .
			"{$this->dbTables["accessTable"]} ON " .
			"{$this->dbTables["accessTable"]}.{$this->accessTable["id"]} = " .
			"{$this->dbTables["userTable"]}.{$this->userTable["accessLevel"]} " .
			"WHERE {$this->userTable["id"]}=?"
			:
			"SELECT {$this->userTable["email"]}, {$this->userTable["name"]}, " .
			"{$this->userTable["password"]} FROM {$this->dbTables['userTable']} " .
			"WHERE {$this->userTable["id"]}=?"
		));
		$query->execute([$this->id]);
		$result = $query->fetch();

		$this->email = $result[$this->userTable["email"]];
		$this->name = $result[$this->userTable["name"]];
		$this->accessLevel = $result[$this->accessTable["level"]];
	}

	public function register($email, $password, $name)
	{
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
			throw new Exception("Invalid Email");
			
		$query = $this->connection->prepare(
			"SELECT {$this->userTable["id"]} FROM {$this->dbTables['userTable']} ".
			"WHERE {$this->userTable["email"]}=?"
		);

		$query->execute([$email]);

		if ($query->rowCount()) {
			throw new Exception("The email already exists in database");
		}

		$password = password_hash($password, PASSWORD_DEFAULT);

		$query = $this->connection->prepare(
			"INSERT INTO {$this->dbTables['userTable']} " .
			"({$this->userTable["email"]}, {$this->userTable["name"]}, " .
			"{$this->userTable["password"]}) VALUES (?, ?, ?)"
		);

		$query->execute([$email, $name, $password]);
	}

	public function login($email, $password)
	{
		$query = $this->connection->prepare(
			"SELECT {$this->userTable["id"]}, {$this->userTable["password"]} " .
			"FROM {$this->dbTables['userTable']} " .
			"WHERE {$this->userTable["email"]}=?"
		);

		$query->execute([$email]);

		if (!$query->rowCount())
			throw new Exception("User not found in the database");

		$userData = $query->fetch();

		if (!password_verify($password, $userData["password"]))
			throw new Exception("Incorrect password");

		$this->id = $userData["user_id"];
	}

	public function isLogged()
	{
		return $this->id ? true : false;
	}

	public function getName()
	{
		if (!isset($this->name))
			$this->retrieveData();
		return $this->name;
	}

	public function getEmail()
	{
		if (!isset($this->email))
			$this->retrieveData();
		return $this->email;
	}

	public function getAccessLevel()
	{
		if (!isset($this->accessTable))
			return false;
		if (!isset($this->accessLevel))
			$this->retrieveData();
		return $this->accessLevel;
	}

	public function modifyName($name)
	{
		$query = $this->connection->prepare(
			"UPDATE {$this->dbTables['userTable']} SET " .
			"{$this->userTable["name"]}=? WHERE {$this->userTable["id"]}=?"
		);

		$query->execute([$name, $this->id]);
	}

	public function modifyEmail($email)
	{
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
			throw new Exception("Invalid Email");

		$query = $this->connection->prepare(
			"UPDATE {$this->dbTables['userTable']} SET " .
			"{$this->userTable["email"]}=? WHERE {$this->userTable["id"]}=?"
		);

		$query->execute([$email, $this->id]);
	}

	public function modifyPassword($password)
	{
		$password = password_hash($password, PASSWORD_DEFAULT);

		$query = $this->connection->prepare(
			"UPDATE {$this->dbTables['userTable']} SET " .
			"{$this->userTable["password"]}=? WHERE {$this->userTable["id"]}=?"
		);

		$query->execute([$password, $this->id]);
	}

	public function modifyAccessLevel($accessLevel)
	{
		$query = $this->connection->prepare(
			"SELECT {$this->accessTable["id"]} FROM ".
			"{$this->dbTables['accessTable']} WHERE {$this->accessTable["level"]}=?"
		);

		$query->execute([$accessLevel]);

		if (!$query->rowCount()) {
			throw new Exception("Invalid access level");
		}

		$accessLevel = $query->fetch()[$this->accessTable["id"]];

		$query = $this->connection->prepare(
			"UPDATE {$this->dbTables['userTable']} SET " .
			"{$this->userTable["accessLevel"]}=? WHERE {$this->userTable["id"]}=?"
		);

		$query->execute([$accessLevel, $this->id]);
	}

	public function logout()
	{
		$this->id = null;
		$this->name = null;
		$this->email = null;
		$this->accessLevel = null;
		session_destroy();
	}
}
