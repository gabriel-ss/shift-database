<?php

require '../local/header.php';

$table = new ShiftTable($connection);

?>
	<body>
		<div class="container">
			<table id="shift-table">
			</table>
			<div class="overlay">
				<div class="modal">
					<div class="container"></div>
				</div>
			</div>
		</div>
	</body>
	<script src="scripts/Shift.js" charset="utf-8"></script>
	<script src="scripts/ShiftTable.js" charset="utf-8"></script>
	<script src="scripts/master.js" charset="utf-8"></script>
</html>
