<?php

require 'includes/header.php';

$table = new ShiftTable($connection);

?>
	<body>
		<div class="container">
			<?php echo $table->getAsHTMLList($_SESSION["user_id"]); ?>
		</div>
	</body>
</html>
