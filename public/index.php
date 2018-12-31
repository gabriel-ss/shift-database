<?php
require '../local/header.php';

if ($user):
	include '../local/user-dashboard.php';
else:
	include '../local/guest-dashboard.php';
endif; ?>
</body>
</html>
