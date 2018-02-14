<?php
require "setup.php";

if (!$user->isLogged() && isset($_POST["email"])) {
    //TODO: Escape user input properly

    $user->login($_POST["email"], $_POST["password"]);
}

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
			<a href="index.php"> <h1 class="header-text">Database</h1> </a>
			<?php if ($user->isLogged()): ?>
				<div class="greeting">
					<h2>Welcome <?php echo $user->getFirstName(); ?></h2>
				</div>
			<?php else: ?>
			<form class="inline-form" action="<?php $_SERVER["PHP_SELF"] ?>" method="POST">
				<input type="email" name="email" placeholder="e-mail">
				<input type="password" name="password" placeholder="password">
				<input type="submit" value="Login">
			</form>
			<?php if (isset($_POST["email"])): ?>
				<div class="alert">
					Invalid email or password
				</div>
			<?php endif; ?>
			<?php endif; ?>
		</header>
