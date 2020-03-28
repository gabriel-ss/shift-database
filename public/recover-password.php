<?php

require '../partials/header.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


if (isset($_POST["recovery_email"])) $isRegistered =
	(User::searchByEmail($userDataAccessor, $_POST["recovery_email"]) !== null);


if (isset($isRegistered) && $isRegistered) {

	// Generate an one-time access token
	$_SESSION['access_token'] = crypt(rand(), '$1$' . date('U'));
	$_SESSION['recovery_email'] = $_POST["recovery_email"];


	$recoveryLink =
		"http://{$_SERVER['HTTP_HOST']}/index.php?access_token={$_SESSION['access_token']}";


	$mail = new PHPMailer();

	$mail->CharSet = MAILER_CHAR_SET;
	$mail->isSMTP();
	$mail->Host = MAILER_HOST;
	$mail->SMTPAuth = MAILER_SMTP_AUTH;
	$mail->Username = MAILER_USERNAME;
	$mail->Password = MAILER_PASSWORD;
	$mail->SMTPSecure = MAILER_SMTP_SECURE;
	$mail->Port = MAILER_PORT;
	$mail->From = MAILER_FROM;
	$mail->FromName = MAILER_FROM_NAME;
	$mail->addAddress($_POST["recovery_email"]);
	$mail->isHTML(true);

	$mail->Subject = 'ShiftDB Password Reset';

	$mail->Body = <<<HTML
Click on this link to change your password:<br />
<a href='$recoveryLink'>$recoveryLink</a><br />
The link must be accessed from the same browser
from where the recovery process was started
HTML;

	$mail->AltBody = <<<EOS
Click on this link to change your password:
$recoveryLink
The link must be accessed from the same browser
from where the recovery process was started
EOS;

	$mailWasSent = $mail->send();

}
?>

<div class="container section">
	<div class="columns is-centered">
		<div class="card column is-three-fifths">
			<div class="card-content">
				<p class="title">Change Password</p>
				<?php if (!isset($isRegistered)): ?>
					<form id="password-recover-form" action="<?php $_SERVER["PHP_SELF"] ?>" method="post">
						<label class="label">Enter your e-mail
							<input class="input is-fullwidth" type="email" name="recovery_email" required>
						</label>
						<input class="button is-link" type="submit" name="submit" value="Confirm">
					</form>
				<?php else: ?>
					<?php if ($isRegistered): ?>
						<div class="notification is-success">
							An email has been sent to you containing instructions on how to
							reset your password.
						</div>
					<?php else: ?>
						<div class="notification is-danger">The provided e-mail is not regitered.</div>
					<?php endif; ?>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
</div>
