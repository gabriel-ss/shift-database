<?php

use UserDataInterface as UD;

/**
 *
 */
class Admin extends User
{
	// TODO: Treat input of these methods


	public function getUserList(): array {

		return $this->dataInterface->find([], [
			UD::ID,
			UD::EMAIL,
			UD::NAME,
			UD::ACCESS_LEVEL
		]);

	}


	public function batchRegister(array $users): int {

		$userCount = count($users);
		for ($i = 0; $i < $userCount; $i++) {
			$users[$i][1] = password_hash($users[$i][1], PASSWORD_DEFAULT);
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
	): void {

		if ($password)
			$password = password_hash($password, PASSWORD_DEFAULT);

		$values = array_filter([
			UD::EMAIL => $email,
			UD::NAME => $name,
			UD::PASSWORD => $password,
			UD::ACCESS_LEVEL => $accessLevel
		]);

		$this->dataInterface->update([UD::ID => $id], $values);
	}


	public function deleteUser(string $id): void {

		$this->dataInterface->delete([UD::ID => $id]);

	}


}
