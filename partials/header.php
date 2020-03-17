<?php
require "setup.php";

if (isset($_REQUEST["logout"])) {
	$user->logout();
	$user = null;
}

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
	window.config = JSON.parse(
		'<?php echo str_replace("\n", '\n', file_get_contents("../config/system-config.json")); ?>'
	);
</script>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="/assets/master.css">
		<title>Shift Scheduler</title>
	</head>
	<body>
		<nav class="navbar is-primary">
			<div class="container">
				<div class="navbar-brand">
					<a href="index.php" class="navbar-item title">Database</a>
				</div>
				<?php if ($user): ?>
					<div class="navbar-item navbar-end has-dropdown is-hoverable">
						<a class="navbar-link">
							Welcome	<?php echo
							strstr($user->getName(), " ", true) ?: $user->getName();
							?>
						</a>

						<div class="navbar-dropdown">
							<a href="email-update.php" class="navbar-item">
								Change E-mail
							</a>
							<a href="password-update.php" class="navbar-item">
								Change Password
							</a>
      					<hr class="dropdown-divider">
							<a href="index.php?logout" class="navbar-item">
								Logout
							</a>
						</div>
					</div>
				<?php endif; ?>

			</div>
		</nav>
