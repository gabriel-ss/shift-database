<?php
require "setup.php";

if (!$user) {
	$failedToLogin = false;
	if (isset($_POST["email"]) && $_POST["email"] !== "") {

		$user = User::login(
			$userDataAccessor,
			$_SESSION["user_id"],
			$_POST["email"],
			$_POST["password"]
		);
		$failedToLogin = !$user;

	} elseif ($_SERVER["PHP_SELF"] != "/index.php") {
		header("location:/index.php");
	}
}

?>
<!DOCTYPE html>
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
					</form>
				<?php endif; ?>

			</div>
		</header>
