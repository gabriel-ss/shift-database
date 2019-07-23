<?php
/**
 * Asynchronous request processor. This page does all the interaction with the
 * database. All the requests made either via GET or POST and have always an
 * "intention" field that defines what interaction the request will have with
 * the backend and how it will be futher treated by this processor.
 */

require '../local/setup.php';

$shift = new Shift($connection);
switch ($_REQUEST["intention"]) {

	/**
	 * Returns a JSON representation of an object where each key is a string with
	 * the shift time and the value is an object in which the keys represent
	 * the day of the week with a number from 0 to 6.
	 */
	case "get_table":
		echo json_encode($shift->queryShiftsByWeek($_GET["week"]));
		break;


	/**
	 * Returns an array of objects representing all shifts where the current user
	 * is subscribed.
	 */
	case "get_user_subscriptions":
		echo json_encode($shift->queryShiftsByUser($_SESSION["user_id"]));
		break;


	/**
	 * Returns an object containing information about the shift specified by the
	 * shift_id parameter. If the request is made by a common user the object
	 * will contain a field with the number of subscriptions and another with a
	 * boolean indicating if the user is one of them. If made by an admin it will
	 * contain an array os subscribed users instead. Admins can also specify an
	 * "user_id" field in the request to receive the response that the
	 * corresponding would get.
	 */
	case 'get_shift_info':
		$userId = ($user->getAccessLevel() !== "admin") ?
			$_SESSION["user_id"] : ($_REQUEST["user_id"] ?? null);
		echo json_encode($shift->getShiftInfo($_GET["shift_id"], $userId));
		break;


	/**
	 * Creates multiple shifts at once. The input must be an array of objects
	 * with keys "weekAndDay", "time" and "shiftCapacity". "weekAndDay" must be a
	 * string containing the date in the ISO year with ISO week and day format
	 * (yyyy"-W"ww"-"d) and "time" must be a string in the format hh:mm.
	 *
	 * Only available to admins.
	 */
	case 'create_shifts':
		if ($user->getAccessLevel() !== "admin") break;

		$shifts = json_decode(file_get_contents('php://input'), true);

		$shift->createShifts(
			array_map(function($shift) {
				return [
					// Convert to an SQL ready date format
					date(
						"Y-m-d H:i:s",
						strtotime("{$shift["weekAndDay"]} {$shift['time']}")
					),
					$shift["shiftCapacity"]
				];
			}, array_filter($shifts, function($shift) {
				// Filter shifts with capacity less than one.
				return $shift["shiftCapacity"] > 0;
			})));
		break;


	/**
	 * Deletes the shift specified by the "shift_id" field from the database.
	 *
	 * Only available to admins.
	 */
	case 'delete_shift':
		if ($user->getAccessLevel() !== "admin") break;

		$shift->deleteShift($_GET["shift_id"]);
		break;


	/**
	 * Subscribe the current user from the shift specified by the "shift_id"
	 * field. Admins can also specify an "user_id" to subscribe the corresponding
	 * user instead.
	 */
	case 'subscribe':
		if (isset($_GET["user_id"])) {
			if ($user->getAccessLevel() === "admin")
				$shift->addShiftEntry($_GET["user_id"], $_GET["shift_id"]);
		} else
			$shift->addShiftEntry($_SESSION["user_id"], $_GET["shift_id"]);
		break;


	/**
	 * Unsubscribe the current user from the shift specified by the "shift_id"
	 * field. Admins can also specify an "user_id" to unsubscribe the
	 * corresponding user instead.
	 */
	case 'unsubscribe':
		if (isset($_GET["user_id"])) {
			if ($user->getAccessLevel() === "admin")
				$shift->removeShiftEntry($_GET["user_id"], $_GET["shift_id"]);
		} else
			$shift->removeShiftEntry($_SESSION["user_id"], $_GET["shift_id"]);
		break;


	/**
	 * Returns an object containing a boolean indicating if the user specified
	 * by the "user_id" is subscribed in the shift corresponding to "shift_id".
	 * If no "user_id" is specified checks the subscription of the current user
	 * instead.
	 */
	case 'check_user_subscription':
		echo json_encode(
			$shift->hasUser(
				$_GET["user_id"] ?: $_SESSION["user_id"],
				$_GET["shift_id"]
			)
		);
		break;


	/**
	 * Returns an array with all the users regitred in the system.
	 *
	 * Only available to admins.
	 */
	case 'get_user_list':
		echo json_encode($user->getUserList());
		break;


	/**
	 * Receives an array of objects containing "name", "email", and "password"
	 * from each user to be inserted in the database.
	 *
	 * Only available to admins.
	 */
	case 'register_users':
		$users = json_decode(file_get_contents('php://input'), true);
		echo $user->batchRegister($users);
		break;


	/**
	 * Receives an object containing an "id" key specifing the user to be updated
	 * and a "values" key with anobject that can contain optionally the keys
	 * "email", "name", "password" and "accessLevel" with the new user data.
	 *
	 * Only available to admins.
	 */
	case 'update_user':
		["id" => $id, "values" => $values] =
			json_decode(file_get_contents('php://input'), true);

		$values = array_replace([
			"email" => null,
			"name" => null,
			"password" => null,
			"accessLevel" => null
		], $values);

		echo $user->updateUser($id, ...array_values($values));
		break;


	/**
	 * Removes the user specified by "user_id".
	 *
	 * Only available to admins.
	 */
	case 'delete_user':
		echo $user->deleteUser($_GET["user_id"]);
		break;


	/**
	 * Responds the same way that the "get_table" intention with information
	 * about the current week.
	 */
	default:
		echo json_encode($shift->queryShiftsByWeek(date("Y-\WW")));
		break;
}
