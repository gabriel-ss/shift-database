<?php

/**
 * Implements the UserDataInterface by connecting to a SQL database through a
 * PDO connection.
 */
class UserDataAccessor implements UserDataInterface
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
	private const DB_TABLES = [
		"userTable" => "users",
		"accessTable" => "access_levels",
	];

	/**
	 * Array that stores the column names of the table that holds user
	 * information.
	 *
	 * @var array
	 */
	private const USER_COLUMNS = [
		"user_id", "email", "name", "password", "access_level"
	];

	/**
	 * Array that stores the column names of the table that holds information
	 * about the access levels.
	 *
	 * @var array
	 */
	private const ACCESS_COLUMNS = [
		"id" => "level_id",
		"level" => "level",
	];

	/**
	 * A query string to link the user access level id and the corresponding
	 * access level name.
	 *
	 * @var string
	 */
	private const LEVEL_ID_QUERY = '(SELECT ' . self::ACCESS_COLUMNS['id'] .
	' FROM ' . self::DB_TABLES['accessTable'] .
	' WHERE ' . self::ACCESS_COLUMNS['level'] . '=?)';


	/**
	 * @param PDO $connection A PDO connection with the database
	 */
	public function __construct(PDO $connection) {

		$this->connection = $connection;

	}


	/**
	 * Returns a string formated to be used in SQL queries where is expected
	 * a statement in the form of *column1=?, column2=?...*.
	 *
	 * @param  array  $filters An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry.
	 *
	 * @return string          A formated string.
	 */
	private static function interpolateColumns(array $filters): string {

		$columns = array_map(function($columnAlias) {
			return self::USER_COLUMNS[$columnAlias] . '=' .
			($columnAlias != self::ACCESS_LEVEL ? '?' : self::LEVEL_ID_QUERY);
		}, array_keys($filters));

		return implode(", ", $columns);
	}


	/**
	 * Returns a query string ready to be passed to the SQL driver to retrieve
	 * data about the users that match the filters.
	 *
	 * @param  array  $filters An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be matched.
	 *
	 * @param  array  $fields  An ordered array where each value is one of the
	 * constants defined in the UserDataInterface to represent a field of the
	 * user entry. Define which fields will be returned and in which order.
	 *
	 * @return string
	 */
	private static function queryUserData(array $filters, array $fields): string {

		$mask = array_map(function($column) {
			return $column == self::ACCESS_LEVEL ?
				self::ACCESS_COLUMNS['level'] :
				self::USER_COLUMNS[$column];
		}, $fields);

		return
			'SELECT ' .
				implode(', ', $mask) . ' ' .
			'FROM ' . self::DB_TABLES['userTable'] . ' ' .
			'INNER JOIN ' . self::DB_TABLES['accessTable'] . ' ON ' .
				self::DB_TABLES['userTable'] . '.' .
				self::USER_COLUMNS[self::ACCESS_LEVEL] . ' = ' .
				self::DB_TABLES['accessTable'] . '.' .
				self::ACCESS_COLUMNS['id'] . ' ' .
			($filters ? ('WHERE ' . self::interpolateColumns($filters)) : "");

	}


	/**
	 * Searches for elements that match the filters passed as arguments and
	 * returns an array of arrays containing the data from the user. The fields
	 * in the return and their order are defined by the $fields array. If no
	 * $fields argument is passed, the user data can be retrieved by using the
	 * constants defined in UserDataInterface directly in the return of the
	 * method. If no element matches the filters an empty array is returned.
	 *
	 * @param  array $filters An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be matched.
	 *
	 * @param  array  $fields  An ordered array where each value is one of the
	 * constants defined in the UserDataInterface to represent a field of the
	 * user entry. Define which fields will be returned and in which order.
	 *
	 * @return array
	 */
	public function find(array $filters,  array $fields = [
		self::ID,
		self::EMAIL,
		self::NAME,
		self::PASSWORD,
		self::ACCESS_LEVEL
	]): array {

		$query =
			$this->connection->prepare(self::queryUserData($filters, $fields));
		$query->execute(array_values($filters));


		return $query->fetchAll(PDO::FETCH_NUM) ?: [];
	}


	/**
	 * Searches for the first element that match the filters passed as arguments
	 * and returns an array containing the user's data. The fields in the
	 * returned array and their order are defined by the $fields array. If no
	 * $fields argument is passed, the user data can be retrieved by using the
	 * constants defined in UserDataInterface directly in the return of the
	 * method. In case of no matches an empty array is returned.
	 *
	 * @param  array $filters An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be matched.
	 *
	 * @param  array  $fields  An ordered array where each value is one of the
	 * constants defined in the UserDataInterface to represent a field of the
	 * user entry. Define which fields will be returned and in which order.
	 *
	 * @return array
	 */
	public function findOne(array $filters, array $fields = [
		self::ID,
		self::EMAIL,
		self::NAME,
		self::PASSWORD,
		self::ACCESS_LEVEL
	]): array {

		$query =
			$this->connection->prepare(self::queryUserData($filters, $fields));
		$query->execute(array_values($filters));


		return $query->fetch(PDO::FETCH_NUM) ?: [];
	}


	/**
	 * @param  array $values An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be written.
	 *
	 * @return int            Number of entries affected
	 */
	public function insert(array $values): int {

		$columns = array_map(function($columnAlias) {
			return self::USER_COLUMNS[$columnAlias];
		}, array_keys($values));


		$queryString =	'INSERT INTO ' . self::DB_TABLES['userTable'] .
			' (' . implode(', ', $columns) . ')';


		$placeholders = array_fill(0, count($values), '?');
		$placeholders[array_search(self::ACCESS_LEVEL, array_keys($values))] =
			self::LEVEL_ID_QUERY;

		$queryString .= ' VALUES (' .	implode(', ', $placeholders) . ')';

		$query = $this->connection->prepare($queryString);
		$query->execute(array_values($values));


		return $query->rowCount();

	}


	/**
	 * @param  array $filters An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be matched.
	 *
	 * @param  array $values An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be written.
	 *
	 * @return int            Number of entries affected
	 */
	public function update(array $filters, array $values): int {

		$queryString =
			"UPDATE " . self::DB_TABLES['userTable'] .
			" SET " . self::interpolateColumns($values) .
			" WHERE " . self::interpolateColumns($filters);


		$query = $this->connection->prepare($queryString);
		$query->execute(
			array_merge(array_values($values), array_values($filters)));


		return $query->rowCount();

	}


	/**
	 * @param  array $filters An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be matched.
	 *
	 * @return int            Number of entries affected
	 */
	public function delete(array $filters): int {

		$queryString =
			'DELETE FROM ' . self::DB_TABLES['userTable'] .
			' WHERE ' . self::interpolateColumns($filters);


		$query = $this->connection->prepare($queryString);
		$query->execute(array_values($filters));


		return $query->rowCount();

	}


}
