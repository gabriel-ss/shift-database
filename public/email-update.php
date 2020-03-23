<?php
require '../partials/header.php';

if (isset($_POST["email"]))
	try {
		$user->modifyEmail($_POST["email"]);
	} catch (Exception $e) {
		unset($_POST["email"]);
	}
?>

<?php if (isset($_POST["email"])): ?>
	<div class="container section">
		<div class="notification is-success">
			E-mail succefully changed. <a href="index.php">Click here to return to home</a>.
		</div>
	</div>
<?php else: ?>
	<div class="container section">
		<div class="columns is-centered">
			<div class="card column is-three-fifths">
				<div class="card-content">
				<p class="title">Change E-mail</p>
				<form id="email-change-form" action="<?php $_SERVER["PHP_SELF"] ?>" method="post">
					<label class="label">Enter your new e-mail
						<input class="input is-fullwidth" type="email" name="email" required>
					</label>
					<label class="label">Confirm your new e-mail
						<input class="input is-fullwidth" type="email" name="emailValidation" >
					</label>
					<div class="field">
						<p class="tag is-invisible is-danger is-light">The e-mails don't match</p>
					</div>
					<input type="submit" class="button is-link" name="submit" value="Confirm">
				</form>
			</div>
		</div>
	</div>
</div>
<?php endif; ?>

<script>
const emailForm = document.querySelector("#email-change-form");
const dangerTag = document.querySelector(".tag.is-danger");
const emailInput = document.querySelector("input[name=email]");
const emailValidation = document.querySelector("input[name=emailValidation]");


emailForm.addEventListener("submit", (event) => {
	if (emailInput.value !== emailValidation.value) {
		event.preventDefault();
		dangerTag.classList.remove("is-invisible");
	}
});
</script>
