<?php

/**
 * Represents tables of shift entries. Data is queried from the SQL database
 * and can be represented in multiple formats
 */
class ShiftTable
{
	/**
	 * Stores the connection with the database.
	 *
	 * @var PDO
	 */
	private $connection;

	/**
	 * Creates a representation of a table containing shift entries
	 *
	 * @param PDO $connection A PDO object connected to the shifts database
	 */
	function __construct($connection)
	{
		$this->connection = $connection;
		$this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	}

	/**
	 * Receives a DateTime object representing a day and returns another
	 * DateTime object representing the sunday of that week. If no argument
	 * is provided last sunday is returned.
	 *
	 * @param  DateTime $dayReference The day that will serve as reference
	 * for calculations.
	 *
	 * @return DateTime
	 */
	private function getWeekStart($dayReference=null)
	{
		$weekStart = $dayReference ?: new DateTime();

		$weekStart->modify("-{$weekStart->format("w")} day");

		return $weekStart;
	}

	/**
	 * Queries the database for shift entries in the week of provided day and
	 * returns an bidimensional array. The first dimension have named indexes
	 * representing the shift time in the format "hh:mm" and the second
	 * have numbered indexes from 0 to 6 representing the day of the week.
	 *
	 * @param DateTime $dayReference A DateTime object representing one day of
	 * the week to be queried. If no argument is passed the method will query
	 * info of the current week.
	 *
	 * @return array
	 */
	public function makeTable($dayReference=null)
	{
		$dayReference = $this->getWeekStart($dayReference);
		$query = $this->connection->prepare("SELECT shifts.shift_id, date, user_count,
			count(user_id) AS subscriptions FROM shifts LEFT JOIN shift_entries
			ON shifts.shift_id=shift_entries.shift_id	WHERE
			date > ? AND date < ? GROUP BY shift_id ORDER BY date"
		);

		// Makes a query that returns shift entries in the period of one week
		$query->execute([
			$dayReference->format("Y-m-d"),
			$dayReference->modify("+1 week")->format("Y-m-d")
		]);

		$result = $query->fetchAll();

		foreach ($result as $value) {
			$dt = new DateTime($value['date']);
			$date = $dt->format("w");
			$time = $dt->format("H:i");

			$schedule[$time][$date]["shift_id"] = $value['shift_id'];
			$schedule[$time][$date]["remainingSpace"] = $value['user_count'] - $value['subscriptions'];
		}

		return $schedule;
	}

	/**
	 * Calls the method makeTable and format the result of the query into an
	 * HTML table.
	 *
	 * @param DateTime $dayReference A DateTime object representing one day of
	 * the week to be queried. If no argument is passed the method will query
	 * info of the current week.
	 *
	 * @return string
	 */
	public function getAsHTMLTable($dayReference=null)
	{
		$schedule = $this->makeTable($dayReference);

		$table =
				"<tr>
					<th></th>
					<th>Monday</th>
					<th>Tuesday</th>
					<th>Wednesday</th>
					<th>Thursday</th>
					<th>Friday</th>
				</tr>";

		foreach ($schedule as $time => $date) {
			$table .= "<tr><th>$time</th>";
			for ($i=1; $i <6 ; $i++) {
				// If $date[$i] does not exist $remainingSpace will be set to "--".
				// If it does exist but is equals to 0 $remainingSpace will be set
				// to "full".
				$remainingSpace = (($date[$i]["remainingSpace"] ?? "--") ?: "full");
				// If $date[$i] exists the id of the td element will be set to
				// "shift:shiftID". If it does not "shift:null" will be assigned
				$htmlId = $date[$i]["shift_id"] ?? "null";
				$table.= "<td id='shift:$htmlId'>$remainingSpace</td>";
			}
			$table.= "</tr>";
		}

		return $table;
	}

	/**
	 * Searches for all shift entries of a certain user in the database and
	 * returns an array of DateTime objects corresponding to each shift date.
	 *
	 * @param  integer $userId The numeric identifier of the user.
	 * @return array
	 */
	public function makeList($userId)
	{
		$query = $this->connection->prepare("SELECT shifts.shift_id, date FROM
			shift_entries INNER JOIN shifts ON shifts.shift_id = shift_entries.shift_id
			WHERE user_id = ?"
		);

		$query->execute([$userId]);
		$listSize = $query->rowCount();
		$data = $query->fetchAll();

		for ($i=0; $i < $listSize; $i++) {
			$list[$i]['date'] = new DateTime($data[$i]["date"]);
			$list[$i]['shift_id'] = $data[$i]["shift_id"];
		}
		return $list;
	}

	/**
	 * Calls the method makeList and format the result of the query into an
	 * HTML table.
	 * @param  integer $userId The numeric identifier of the user.
	 * @return string
	 */
	public function getAsHTMLList($userId)
	{
		$list = $this->makeList($userId);

		$table = "<table><tr><th>Date</th><th>Time</th></tr>";

		$listSize = count($list);
		for ($i=0; $i < $listSize; $i++) {
			$table .= "<tr id='shift:{$list[$i]['shift_id']}'>
				<td>{$list[$i]['date']->format("d/m/Y")}</td>
				<td>{$list[$i]['date']->format("H:i")}</td>
				</tr>";
		}

		$table .= "</table>";

		return $table;
	}
}

 ?>
