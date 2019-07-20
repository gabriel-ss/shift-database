<?php

use UserDataInterface as UD;

/**
 *
 */
class Admin extends User
{
	// TODO: Treat input of these methods


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


	public function deleteUser(string $id): int {

		return $this->dataInterface->delete([UD::ID => $id]);

	}


}
