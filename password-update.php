<?php
require 'includes/header.php';

if (isset($_POST["password"])):
	$user->modifyPassword($_POST["password"]);
?>
<div class="container">
	<div class="alert success">
		Password succefully changed. <a href="index.php">Click here to return to home</a>.
	</div>
</div>

<?php else: ?>
<div class="container">
	<form id="password-change-form" action="<?php $_SERVER["PHP_SELF"] ?>" method="post">
		<label>Enter your new password
			<input class="full-width" type="password" name="password" required>
		</label>
		<label>Confirm your new password
			<input class="full-width" type="password" name="passwordValidation" >
		</label>
		<div class="alert danger hidden">The passwords don't match</div>
		<input type="submit" name="submit" value="Confirm">
	</form>
</div>
<?php endif; ?>

<script>
function $(selector) {
	return document.querySelector(selector);
}

let passwordForm = $("#password-change-form");
let submitButton = $("input[type=submit]")


passwordForm.addEventListener("submit", (event) => {
	if ($("input[name=password]").value != $("input[name=passwordValidation]").value) {
		event.preventDefault();
		$("form div").style = "visibility: visible";
	}
});
</script>
