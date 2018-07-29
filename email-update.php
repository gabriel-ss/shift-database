<?php
require 'includes/header.php';

if (isset($_POST["email"]))
	try {
		$user->modifyEmail($_POST["email"]);
	} catch (Exception $e) {
		unset($_POST["email"]);
	}
?>


<?php if (isset($_POST["email"])): ?>
	<div class="container">
		<div class="alert success">
			Email succefully changed. <a href="index.php">Click here to return to home</a>.
		</div>
	</div>
<?php else: ?>
	<div class="container">
		<form id="email-change-form" action="<?php $_SERVER["PHP_SELF"] ?>" method="post">
			<label>Enter your new e-mail
				<input class="full-width" type="email" name="email" required>
			</label>
			<label>Confirm your new e-mail
				<input class="full-width" type="email" name="emailValidation" >
			</label>
			<div class="alert danger hidden">The e-mails don't match</div>
			<input type="submit" name="submit" value="Confirm">
		</form>
	</div>
<?php endif; ?>


<script>
function $(selector) {
	return document.querySelector(selector);
}

let passwordForm = $("#email-change-form");
let submitButton = $("input[type=submit]")


passwordForm.addEventListener("submit", (event) => {
	if ($("input[name=email]").value != $("input[name=emailValidation]").value) {
		event.preventDefault();
		$("form div").style = "visibility: visible";
	}
});
</script>
