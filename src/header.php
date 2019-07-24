<?php
require "setup.php";

if (!$user) {

	$failedToLogin = false;

	if (
		isset($_SESSION['access_token'], $_REQUEST['access_token']) &&
		$_SESSION['access_token'] === $_REQUEST['access_token']
	) {

		$recoveryEmail = $_SESSION["recovery_email"];
		session_destroy();
		session_start();
		$_SESSION["user_id"] = User::searchByEmail($userDataAccessor, $recoveryEmail);
		User::restoreSession($userDataAccessor, $_SESSION["user_id"]);
		header("location:/password-update.php");

	} elseif (isset($_POST["email"]) && $_POST["email"] !== "") {
		$user = User::login(
			$userDataAccessor,
			$_SESSION["user_id"],
			$_POST["email"],
			$_POST["password"]
		);
		$failedToLogin = !$user;

	} elseif (
		$_SERVER["PHP_SELF"] != "/index.php" &&
		$_SERVER["PHP_SELF"] != "/recover-password.php"
	) {

		header("location:/index.php");

	}
}

?>
<!DOCTYPE html>
<script type="text/javascript">
	window.config = {
		DEFAULT_SHIFT_CAPACITY: <?php echo $defaultShiftCapacity; ?>,
		DEFAULT_SCHEDULE: <?php echo json_encode($defaultSchedule); ?>,
		SUBSCRIPTION_TIME_LIMIT: <?php echo $subscriptionTimeLimit; ?>,
		UNSUBSCRIPTION_TIME_LIMIT: <?php echo $unsubscriptionTimeLimit; ?>,
	}
</script>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="/css/master.css">
		<title>Shift Scheduler</title>
	</head>
	<body>
		<header class="primary">
			<div class="container">
				<a href="index.php" class="header-brand">Database</a>
				<?php if ($user): ?>
					<div class="header-sidetext">
						Welcome	<?php echo
							strstr($user->getName(), " ", true) ?: $user->getName(); ?>
					</div>
				<?php else: ?>
					<form class="header-form" action="<?php echo $_SERVER["PHP_SELF"] ?>" method="POST">
						<input class="form-control"type="email" name="email" placeholder="e-mail">
						<input type="password" name="password" placeholder="password">
						<input type="submit" value="Login">
						<a style="color:white" href="/recover-password.php">Recover password</a>
					</form>
				<?php endif; ?>

			</div>
		</header>
