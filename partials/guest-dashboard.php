<section class="container section">
	<div class="columns is-multiline is-centered">
		<div class="column is-three-fifths">
			<h1 class="title">Database Index</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
