<?php

require '../local/header.php';

if (isset($_POST["recovery_email"])) {

	$isRegistered =
		(User::searchByEmail($userDataAccessor, $_POST["recovery_email"]) !== null);

	if ($isRegistered) {
		$_SESSION['access_token'] = crypt(rand(), '$1$'.date('U'));
		$_SESSION['recovery_email'] = $_POST["recovery_email"];

		$recoveryLink =
			"http://{$_SERVER['HTTP_HOST']}/index.php?access_token={$_SESSION['access_token']}";
		$subject = 'Password Recover';
		$message =
			'Click on this link to change your password:<br />' .
			"<a href='$recoveryLink'>$recoveryLink</a><br />" .
			'The link must be accessed from the same browser ' .
			'from where the recovery procces was started';
		$headers =
			"From: noreply@shiftscheduler.com'\r\n" .
			"Content-type: text/html;charset=UTF-8\r\n'";
		mail($_POST["recovery_email"], $subject, $message, $headers);

	}

}
?>

<div class="container">
	<h1>Password Recovery</h1>
	<?php if (!isset($isRegistered)): ?>
		<form id="password-recover-form" action="<?php $_SERVER["PHP_SELF"] ?>" method="post">
			<label>Enter your e-mail
				<input class="full-width" type="email" name="recovery_email" required>
			</label>
			<input type="submit" name="submit" value="Confirm">
		</form>
	<?php else: ?>
		<?php if ($isRegistered): ?>
			<div class="alert success">
				An email has been sent to you containing instructions on how to
				reset your password.
			</div>
		<?php else: ?>
			<div class="alert danger">The provided e-mail is not regitered.</div>
		<?php endif; ?>
	<?php endif; ?>
</div>
