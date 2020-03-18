<section class="container section">
	<div class="columns is-multiline is-centered">
		<div class="column is-three-fifths">
			<div class="section">
				<?php echo file_get_contents('../config/guest-message.html'); ?>
			</div>
		</div>
		<div class="column is-three-fifths-tablet is-two-fifths-desktop">
			<div class="card-header">
				<div class="title card-header-title">Login</div>
			</div>
			<form class="card" action="<?php echo $_SERVER["PHP_SELF"] ?>" method="POST">
				<div class="card-content">
					<input class="input field" type="email" name="email" placeholder="e-mail">
					<input class="input field" type="password" name="password" placeholder="password">
					<input class="button is-primary" type="submit" value="Login">
					<?php if ($failedToLogin): ?>
						<div style="margin-top: 1em" class="field">
							<p class="tag is-danger is-light">
								Invalid email or password
							</p>
						</div>
					<?php endif; ?>
				</div>
				<div class="card-footer">
					<div class="card-footer-item">
						<a href="/recover-password.php">Recover password</a>
					</div>
				</div>
			</form>
		</div>
	</div>
</section>
