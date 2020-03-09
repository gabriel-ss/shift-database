<?php

/**
 * A simplified interface to interact with databases more easily.
 *
 * The use of the methods must be exclusively through the use of constants
 * defined here as keys for all parameters that receive arrays. The info from
 * the returned arrays can also be retrieved by using the constants.
 */
interface UserDataInterface
{
	const ID = 0;
	const EMAIL = 1;
	const NAME = 2;
	const PASSWORD = 3;
	const ACCESS_LEVEL = 4;


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
	]): array;


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
	]): array;


	/**
	 * @param  array $values An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be written.
	 *
	 * @return int            Number of entries affected
	 */
	public function insertOne(array $values): int;


	/**
	 * Receives an array of arrays where each one contain the information about
	 * one of the users to be inserted. The relation of value position in the
	 * arrays contained in $values and the field in the database is defined in
	 * the $fields Array.
	 *
	 * @param  array $fields An ordered array where each value is one of the
	 * constants defined in the UserDataInterface to represent a field of the
	 * user entry. Define how the arrays contained in $values will be inserted.
	 *
	 * @param  array $values An ordered array of ordered arrays, each one
	 * containing the information of one of the users to be inserted into the
	 * database.
	 *
	 * @return int           Number of entries affected
	 */
	public function insertMany(array $fields, array $values): int;


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
	public function update(array $filters, array $values): int;


	/**
	 * @param  array $filters An array where each key is one of the constants
	 * defined in the UserDataInterface to represent a field of the user entry
	 * and the value is the value to be matched.
	 *
	 * @return int            Number of entries affected
	 */
	public function delete(array $filters): int;


}
