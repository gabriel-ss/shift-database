<?php require 'setup.php';

$shift = new Shift($connection);
$table = new ShiftTable($connection);
switch ($_REQUEST["intention"]) {

	case "get_table":
		echo json_encode($table->makeTable());
		break;

	case 'get_shift_details':
		echo json_encode($shift->getShiftDetails($_GET["shift_id"]));
		break;

	case 'subscribe':
		$shift->hasUser($_SESSION["user_id"], $_POST["shift_id"])?
		$shift->removeShiftEntry($_SESSION["user_id"], $_POST["shift_id"]):
		$shift->addShiftEntry($_SESSION["user_id"], $_POST["shift_id"]);
		break;

	case 'check_user_subscription':
		echo json_encode(
			$shift->hasUser(
				$_GET["user_id"] ?: $_SESSION["user_id"],
				$_GET["shift_id"]
			)
		);
		break;

	default:
		echo json_encode($table->makeTable(new DateTime()));
		break;
}

?>
