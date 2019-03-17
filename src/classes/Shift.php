<?php
/**
 *
 */
class Shift
{

	/**
	 * Stores the connection with the database.
	 *
	 * @var PDO
	 */
	private $connection;


	/**
	 * Creates a representation of a shift.
	 *
	 * @param PDO $connection A PDO object connected to the shifts database.
	 */
	public function __construct($connection) {
		$this->connection = $connection;
		$this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	}


	public function createShift($shiftList) {

		$placeholders = str_repeat("(?, ?), ", count($shiftList) - 1) . '(?, ?)';

		$query = $this->connection->prepare("INSERT IGNORE INTO shifts (date, user_count)
			VALUES $placeholders");
		$query->execute(array_merge(...$shiftList));

		var_dump($query);
	}


	public function deleteShift($shiftId) {

		$query = $this->connection->prepare("DELETE FROM shifts where
			shift_id = ?");
		$query->execute([$shiftId]);

	}


	/**
	 * Creates a new entry in the database representing a user subscription.
	 *
	 * @param int $userId  The ID of the user subscribing in the shift.
	 *
	 * @param int $shiftId The ID of the shift in which the user should be
	 * subscribed.
	 */
	public function addShiftEntry($userId, $shiftId) {
		$query = $this->connection->prepare(
			"INSERT INTO
				shift_entries (user_id, shift_id)
			VALUES (?, ?)");
		$query->execute([$userId, $shiftId]);
	}


	/**
	 * Removes an entry in the database representing a user subscription.
	 *
	 * @param int $userId  The ID of the user unsubscribing from the shift.
	 *
	 * @param int $shiftId The shift ID on which the user must unsubscribe.
	 */
	public function removeShiftEntry($userId, $shiftId) {
		$query = $this->connection->prepare("DELETE FROM shift_entries where
			user_id = ? AND shift_id = ?");
		$query->execute([$userId, $shiftId]);
	}


	/**
	 * Queries the database after information about the shift and returns an
	 * associative array with the data.
	 *
	 * @param  int $shiftId The ID of the shift to be queried
	 *
	 * @return Array          An associative array containing the data returned
	 * by the server
	 */
	public function getShiftDetails($shiftId) {
		$query = $this->connection->prepare("SELECT date, user_count, count(user_id) AS subscriptions FROM shifts
			LEFT JOIN shift_entries ON shifts.shift_id = shift_entries.shift_id
			WHERE shifts.shift_id=?");
		$query->execute([$shiftId]);

		$result = $query->fetch();
		$result["date"] = new DateTime($result["date"]);
		return $result;
	}


	/**
	 * Queries the database after information about the shift and returns an
	 * associative array with the data.
	 *
	 * @param  int     $shiftId       The ID of the shift to be queried
	 * @param  boolean $fetchUserList [description]
	 * @return Array                  An associative array containing the data
	 * returned by the server
	 */
	public function getShiftInfo($shiftId, $userId) {

		$fields = $userId ?
			", EXISTS(SELECT * FROM shift_entries WHERE user_id = ? AND shift_id=?) AS is_subscribed
			, count(shift_entries.user_id) AS subscriptions"
			:
			", CONCAT('[',GROUP_CONCAT(JSON_OBJECT('userId', users.user_id, 'name', name, 'email', email)),']') AS user_list";

		$source = $userId ? "" :
			"JOIN users ON users.user_id=shift_entries.user_id";

		$query = $this->connection->prepare(
			"SELECT
				shifts.shift_id, date, user_count
				$fields
			FROM
				shifts
				LEFT JOIN shift_entries	ON shifts.shift_id=shift_entries.shift_id
				$source
			WHERE
				shifts.shift_id=?"
		);


		if ($userId) {
			$query->execute([$userId, $shiftId, $shiftId]);
			$result = $query->fetch();
			$result["is_subscribed"] = (bool)$result["is_subscribed"];
		} else {
			$query->execute([$shiftId]);
			$result = $query->fetch();
			$result["user_list"] = json_decode($result["user_list"]) ?: [];
		}

		return $result;
	}


	/**
	 * Queries the database and returns a boolean indicating whether a
	 * particular user is subscribed in the shift.
	 *
	 * @param  int  $userId  The ID of the user supposedly subscribed in the
	 * shift.
	 *
	 * @param  int  $shiftId The ID of the shift.
	 *
	 * @return boolean          Returns true if user is subscribed or false
	 * otherwise.
	 */
	public function hasUser($userId, $shiftId) {
		$query = $this->connection->prepare("SELECT user_id FROM shift_entries
			WHERE user_id = ? AND shift_id = ?");
			$query->execute([$userId, $shiftId]);
			return ($query->rowCount() ? true : false);
	}


}
