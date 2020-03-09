<?php

use UserDataInterface as UD;

/**
 * The admin extension of the base user class. Allows the unrestricted
 * manipulation of the user database.
 */
class Admin extends User
{


	/**
	 * Returns an array of associative arrays with keys "id", "email", "name" and
	 * "accessLevel" containing information about each user registered in the
	 * database.
	 *
	 * @return array       Array of arrays with data about all the users
	 * registered .
	 */
	public function getUserList(): array {

		$result = $this->dataInterface->find([], [
			UD::ID,
			UD::EMAIL,
			UD::NAME,
			UD::ACCESS_LEVEL
		]);

		$userCount = count($result);
		for ($i = 0; $i < $userCount; $i++) {
			$result[$i] = [
				 "id" => $result[$i][0],
				 "email" => $result[$i][1],
				 "name" => $result[$i][2],
				 "accessLevel" => $result[$i][3]
			];
		}

		return $result;

	}


	/**
	 * Receives an array of arrays, each containing "name", "email" and plain
	 * "password" of an user to be inserted into the system. If there is an user
	 * with an email that already exists in the database, that user will not be
	 * inserted. Returns the number of inserted users.
	 *
	 * @param  array         $users An array of associative arrays containing the
	 * data from each user.
	 * @return int                  The number of inserted users.
	 */
	public function batchRegister(array $users): int {

		$userCount = count($users);
		for ($i = 0; $i < $userCount; $i++) {
			$users[$i] = [
				$users[$i]["email"],
				password_hash($users[$i]["password"], PASSWORD_DEFAULT),
				$users[$i]["name"]
			];
		}

		return $this->dataInterface->insertMany(
			[UD::EMAIL, UD::PASSWORD, UD::NAME], $users);

	}


	/**
	 * Updates the data about the user specified by $id. If null is passed to any
	 * other parameter that information about the user will remain unchanged.
	 *
	 * @param  string    $id          The id that identifies the user to be
	 * updated with new data.
	 * @param  string    $email       The new email of the user.
	 * @param  string    $name        The new name of the user.
	 * @param  string    $password    The new plain password of the user.
	 * @param  string    $accessLevel The new access level of the user.
	 * @return int                    Zero if the operation fails, one otherwise.
	 */
	public function updateUser(
		string $id,
		?string $email = null,
		?string $name = null,
		?string $password = null,
		?string $accessLevel = null
	): int {

		if ($password)
			$password = password_hash($password, PASSWORD_DEFAULT);

		$values = array_filter([
			UD::EMAIL => $email,
			UD::NAME => $name,
			UD::PASSWORD => $password,
			UD::ACCESS_LEVEL => $accessLevel
		]);

		return $this->dataInterface->update([UD::ID => $id], $values);
	}


	/**
	 * Deletes the user specified by the $id from the database.
	 *
	 * @param  string     $id Id of the user to be deleted
	 * @return int            Zero if the operation fails, one otherwise.
	 */
	public function deleteUser(string $id): int {

		return $this->dataInterface->delete([UD::ID => $id]);

	}


}
