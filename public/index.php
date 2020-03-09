<?php
require '../partials/header.php';

if ($user):
	switch ($user->getAccessLevel()) {
		case 'user':
			include '../partials/user-dashboard.php';
			break;

		case 'admin':
			include '../partials/admin-dashboard.php';
			break;

		default:
			// code...
			break;
	}
else:
	include '../partials/guest-dashboard.php';
endif; ?>
</body>
</html>
