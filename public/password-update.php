<?php
require '../partials/header.php';

if (isset($_POST["password"])):
	$user->modifyPassword($_POST["password"]);
?>

<div class="container section">
	<div class="notification is-success">
		Password succefully changed. <a href="index.php">Click here to return to home</a>.
	</div>
</div>

<?php else: ?>
<div class="container section">
	<div class="columns is-centered">
		<div class="card column is-three-fifths">
			<div class="card-content">
				<p class="title">Change Password</p>
				<form id="password-change-form" action="<?php $_SERVER["PHP_SELF"] ?>" method="post">
					<label class="label">Enter your new password
						<input class="input is-fullwidth" type="password" name="password" required>
					</label>
					<label class="label">Confirm your new password
						<input class="input is-fullwidth" type="password" name="passwordValidation" >
					</label>
					<div style="margin-top: 1em" class="field">
						<p class="tag is-invisible is-danger is-light">The passwords don't match</p>
					</div>
					<input type="submit" class="button is-link" name="submit" value="Confirm">
				</form>
			</div>
		</div>
	</div>
</div>
<?php endif; ?>

<script>
const passwordForm = document.querySelector("#password-change-form");
const dangerTag = document.querySelector(".tag.is-danger");
const passwordInput = document.querySelector("input[name=password]");
const passwordValidation = document.querySelector("input[name=passwordValidation]");


passwordForm.addEventListener("submit", (event) => {
	if (passwordInput.value !== passwordValidation.value) {
		event.preventDefault();
		dangerTag.classList.remove("is-invisible");
	}
});
</script>
