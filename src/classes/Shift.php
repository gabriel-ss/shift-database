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


	/**
	 * Creates a new entry in the database representing a user subscription.
	 *
	 * @param int $userId  The ID of the user subscribing in the shift.
	 *
	 * @param int $shiftId The ID of the shift in which the user should be
	 * subscribed.
	 */
	public function addShiftEntry($userId, $shiftId) {
		$query = $this->connection->prepare("INSERT INTO shift_entries (user_id, shift_id )
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


	/**
	 * Formats a modal in HTML containing info about the shift.
	 *
	 * @param  int $shiftId The ID of the shift.
	 */
	public function makeShiftModal($shiftId) {
		$shiftDetails = $this->getShiftDetails($shiftId);
		?>
			<h1>Shift Details</h1>
			<h2>Date:</h2>
			<?php echo $shiftDetails["date"]->format("d/m/Y"); ?>
			<br>
			<div class="half-width">
				<h2>Start Time:</h2>
				<?php echo $shiftDetails["date"]->format("H:i"); ?>
			</div>
			<div class="half-width">
				<h2>End Time:</h2>
				<?php echo $shiftDetails["date"]->modify("+3 hours")->format("H:i"); ?>
			</div>
			<div class="half-width">
				<h2>Capacity:</h2>
				<?php echo $shiftDetails["user_count"]; ?>
			</div>
			<div class="half-width">
				<h2>Subscriptions:</h2>
				<?php echo $shiftDetails["subscriptions"]; ?>
			</div>
			<button class=" float-right">Subscribe</button>
			<div class="container"></div>
		<?php
	}


}
