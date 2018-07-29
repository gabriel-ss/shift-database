<?php
require 'includes/header.php';

if ($user->isLogged()):
    include 'includes/dashboard.php';
else: ?>
		<div class="container">
			<h1>Database Index</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			<?php if ($failedToLogin): ?>
				<div class="alert danger">
					Invalid email or password
				</div>
			<?php endif; ?>
		</div>
	</body>
</html>
<?php endif; ?>
