<?php

use UserDataInterface as UD;

/**
 * The base class to represent users. Instances of it must be obtained by
 * calling the static methods login and restoreSession, both of which
 * instantiate the correct child class of User to the corresponding access
 * level.
 *
 * The user ID is always passed by reference, making possible to implement
 * persistence by passing a variable that will be carried through page reloads.
 */
class User
{

	protected $dataInterface;

	/**
	 * The numerical identifier that univocally represents the user stored as a
	 * string in a variable received by reference.
	 *
	 * @var string
	 */
	private $id;

	/**
	 * The name of the user.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The name of the email.
	 *
	 * @var string
	 */
	private $email;

	/**
	 * A string that identifies the user's access level.
	 *
	 * @var string
	 */
	private $accessLevel;


	/**
	 * The base constructor of users. Should be used only inside of the static
	 * methods login and restoreSession.
	 *
	 * @param UserDataInterface $dataInterface An object to intermediate the
	 * access to user data
	 *
	 * @param string            $userId        A variable passed by reference to
	 * forward the reference received by the factory method.
	 *
	 * @param string            $name          User's name
	 *
	 * @param string            $email         User's email
	 *
	 * @param string            $accessLevel   User's access level
	 */
	protected function __construct(
		UserDataInterface $dataInterface,
		string &$userId,
		string $name,
		string $email,
		string $accessLevel
	) {

		$this->dataInterface = $dataInterface;
		$this->id = &$userId;
		$this->name = $name;
		$this->email = $email;
		$this->accessLevel = $accessLevel;

	}


	/**
	 * Method to restore the session of an user that is already logged in.
	 * Returns the same object that would be returned by calling the login method
	 * with the email and the password of the user whose id was passed by
	 * reference. If the id doesn't match any user, returns null.
	 *
	 * @param  UserDataInterface $dataInterface A variable passed by reference to
	 * forward the reference received by the factory method.
	 *
	 * @param  ?string           $userId        A variable passed by reference
	 * containing the user ID.
	 *
	 * @return User                             An instance of a child of User
	 */
	public static function restoreSession(
		UserDataInterface $dataInterface,
		?string &$userId
	): ?User {
		if (!$userId) return null;

		$userData = $dataInterface->findOne(
			[UD::ID => $userId]
		);

		[
			UD::EMAIL => $email,
			UD::NAME => $name,
			UD::ACCESS_LEVEL => $accessLevel,
		] = $userData;

		if ($accessLevel == "user")
			return new User($dataInterface, $userId, $name, $email, $accessLevel);

		if ($accessLevel == "admin")
			return new Admin($dataInterface, $userId, $name, $email, $accessLevel);

	}


	/**
	 * Identifies a user by checking the given email and then verify the
	 * password. Returns null if the email does not exists in the database or if
	 * the password is incorrect. If the login is successful returns an object
	 * that is an instance of a class that extends User class chosen according to
	 * the user's access level.
	 *
	 * The variable passed by reference here to store the user ID can be used to
	 * call the static method restoreSession to recreate the object returned from
	 * a call of this method.
	 *
	 * @param  UserDataInterface $dataInterface An object to intermediate the
	 * access to user data
	 *
	 * @param  ?string           $userId        A variable passed by reference to
	 * store the user ID. Can be used in conjunction with the static method
	 * restoreSession to implement persistence.
	 *
	 * @param  string            $email         User's email
	 *
	 * @param  string            $password      Plain user's password
	 *
	 * @return User                             An instance of a child of User
	 */
	public static function login(
		UserDataInterface $dataInterface,
		?string &$userId,
		string $email,
		string $password
	): ?User {

		$userData = $dataInterface->findOne(
			[UD::EMAIL => $email]
		);

		if (!$userData) return null;

		[
			UD::ID => $id,
			UD::EMAIL => $email,
			UD::NAME => $name,
			UD::PASSWORD => $passwordHash,
			UD::ACCESS_LEVEL => $accessLevel,
		] = $userData;

		if (!password_verify($password, $passwordHash)) return null;

		$userId = $id;

		if ($accessLevel == "user")
			return new User($dataInterface, $userId, $name, $email, $accessLevel);

		if ($accessLevel == "admin")
			return new Admin($dataInterface, $userId, $name, $email, $accessLevel);

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
	public static function register(
		UserDataInterface $dataInterface,
		string $email,
		string $password,
		string $name
	): void {

		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
			throw new Exception("Invalid Email");

		// COMBAK: Maybe throwing an exception isn't ideal
		if ($dataInterface->findOne([UD::EMAIL => $email]))
			throw new Exception("The email already exists in database");


		$dataInterface->insert([
			UD::EMAIL => $email,
			UD::NAME => $name,
			UD::PASSWORD => password_hash($password, PASSWORD_DEFAULT),
		]);

	}


	/**
	 * Returns user's full name
	 *
	 * @return string
	 */
	public function getName(): string {
		return $this->name;
	}


	/**
	 * Returns user's email
	 *
	 * @return string
	 */
	public function getEmail(): string {
		return $this->email;
	}


	/**
	 * Returns a string that represents user's access level.
	 *
	 * @return string
	 */
	public function getAccessLevel(): string {
		return $this->accessLevel;
	}


	/**
	 * Modifies the user's name in the database and updates the object's property
	 *
	 * @param string $name User's new name
	 */
	public function modifyName(string $name): void {
		$this->dataInterface->update(
			[UD::ID => $this->id],
			[UD::NAME => $name]
		);

		$this->name = $name;
	}


	/**
	 * Modifies the user's email in the database and updates the object's
	 * property
	 *
	 * @param string $email User's new email
	 */
	public function modifyEmail(string $email): void {
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
			throw new Exception("Invalid Email");


		$this->dataInterface->update(
			[UD::ID => $this->id],
			[UD::EMAIL => $email]
		);

		$this->email = $email;
	}


	/**
	 * Modifies the user's password in the database
	 *
	 * @param string $email User's new plain password
	 */
	public function modifyPassword(string $password): void {
		$this->dataInterface->update(
			[UD::ID => $this->id],
			[UD::PASSWORD => password_hash($password, PASSWORD_DEFAULT)]
		);
	}


	/**
	 * Modifies the user's access level in the database and updates the object's
	 * property
	 *
	 * @param string $email User's new email
	 */
	public function modifyAccessLevel(string $accessLevel): void {

		// TODO: Validate access level

		$this->dataInterface->update(
			[UD::ID => $this->id],
			[UD::ACCESS_LEVEL => $accessLevel]
		);

		$this->accessLevel = $accessLevel;
	}


	/**
	 * Cleans object's properties and destroys current session
	 */
	public function logout(): void {
		$this->id = null;
		$this->name = null;
		$this->email = null;
		$this->accessLevel = null;
		session_destroy();
	}


}
