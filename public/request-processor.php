<?php
require '../local/setup.php';

$shift = new Shift($connection);
$table = new ShiftTable($connection);
switch ($_REQUEST["intention"]) {

	case "get_table":
		$date = new DateTime($_GET["week"]);
		echo json_encode($table->makeTable($date) ?: []);
		break;


	case "get_user_subscriptions":
		echo json_encode($table->makeList($_SESSION["user_id"]));
		break;


	case 'get_shift_info':
		$userId = ($user->getAccessLevel() !== "admin") ? $_SESSION["user_id"] : $_REQUEST["user_id"];
		echo json_encode($shift->getShiftInfo($_GET["shift_id"], $userId));
		break;


	/**
	 * Creates multiple shifts at once. The input must be an array of arrays
	 * in which the first element is a string containing the date in the ISO year
	 * with ISO week and day format (yyyy"-W"ww"-"d), the second is the time in
	 * the format hh:mm and third is the shift capacity.
	 *
	 * Only avaliable to admins.
	 */
	case 'create_shifts':
		if ($user->getAccessLevel() !== "admin") break;

		$shifts = json_decode(file_get_contents('php://input'), true);

		$shift->createShift(
			array_map(function($shift) {
				return [
					date("Y-m-d H:i:s", strtotime("{$shift[0]} {$shift[1]}")),
					$shift[2]
				];
			}, array_filter($shifts, function($shift) {
				// Filter shifts with capacity less than one.
				return $shift[2] > 0;
			})));
		break;


	case 'delete_shift':
		if ($user->getAccessLevel() !== "")// TODO: Check level
			$shift->deleteShift($_GET["shift_id"]);
		break;


	case 'get_shift_details':
		echo json_encode($shift->getShiftDetails($_GET["shift_id"]));
		break;


	case 'subscribe':

		// TODO: Check for room
		$shift->hasUser($_SESSION["user_id"], $_REQUEST["shift_id"]) ?
		$shift->removeShiftEntry($_SESSION["user_id"], $_REQUEST["shift_id"]) :
		$shift->addShiftEntry($_SESSION["user_id"], $_REQUEST["shift_id"]);
		break;


	case 'unsubscribe':
		if (isset($_GET["user_id"])) {
			if ($user->getAccessLevel() !== "")// TODO: Check level
				$shift->removeShiftEntry($_GET["user_id"], $_GET["shift_id"]);
		} else
			$shift->removeShiftEntry($_SESSION["user_id"], $_POST["shift_id"]);

		break;


	case 'check_user_subscription':
		echo json_encode(
			$shift->hasUser(
				$_GET["user_id"] ?: $_SESSION["user_id"],
				$_GET["shift_id"]
			)
		);
		break;


	case 'get_user_list':
		echo json_encode($user->getUserList());
		break;


	case 'register_users':
		$users = json_decode(file_get_contents('php://input'), true);
		echo $user->batchRegister($users);
		break;


	case 'update_user':
		["id" => $id, "values" => $values] =
			json_decode(file_get_contents('php://input'), true);

		$values = array_replace([
			"email" => null,
			"name" => null,
			"password" => null,
			"accessLevel" => null
		], $values);


		$user->updateUser($id, ...array_values($values));
		break;


	case 'delete_user':
		$users = json_decode(file_get_contents('php://input'), true);
		$user->deleteUser($_GET["user_id"]);
		break;


	default:
		echo json_encode($table->makeTable(new DateTime()));
		break;
}
