<?php
require '../local/header.php';

if ($user):
	switch ($user->getAccessLevel()) {
		case 'user':
			include '../local/user-dashboard.php';
			break;

		case 'admin':
			include '../local/admin-dashboard.php';
			break;

		default:
			// code...
			break;
	}
else:
	include '../local/guest-dashboard.php';
endif; ?>
</body>
</html>
