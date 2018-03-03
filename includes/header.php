<?php
require "setup.php";

if (!$user->isLogged()) {
	if (isset($_POST["email"])) {
		try {
			$user->login($_POST["email"], $_POST["password"]);
		} catch (\Exception $e) {

		}

		// TODO: Catch exception
	} elseif ($_SERVER["PHP_SELF"] != "/index.php") {
		header("location:/index.php");
	}
}

$name = $user->getName();
$name = strstr($name, " ", true) ?: $name;

?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="/css/master.css">
		<title>Login</title>
	</head>
	<body>
		<header>
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
