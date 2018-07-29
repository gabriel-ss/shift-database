<?php
require "setup.php";

if (!$user->isLogged()) {
	$failedToLogin = false;
	if (isset($_POST["email"])) {
		try {
			$user->login($_POST["email"], $_POST["password"]);
		} catch (Exception $e) {
			$failedToLogin = true;
		}
	} elseif ($_SERVER["PHP_SELF"] != "/index.php") {
		header("location:/index.php");
	}
}

$name = $user->getName();
//Gets the first name of the user
$name = strstr($user->getName(), " ", true) ?: $name;

?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="/css/master.css">
		<?php // TODO: Change the page title dynamically ?>
		<title>Login</title>
	</head>
	<body>
		<header class="primary">
			<div class="container">
				<a href="index.php" class="header-brand">Database</a>
				<?php if ($user->isLogged()): ?>
					<div class="header-sidetext">
						Welcome <?php echo $name; ?>
					</div>
				<?php else: ?>
					<form class="header-form" action="<?php $_SERVER["PHP_SELF"] ?>" method="POST">
						<input class="form-control"type="email" name="email" placeholder="e-mail">
						<input type="password" name="password" placeholder="password">
						<input type="submit" value="Login">
					</form>
				<?php endif; ?>

			</div>
		</header>
