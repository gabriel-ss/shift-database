<?php
$messageFiles = array_diff(scandir("../config/messages/"), array('..', '.'));
$messages = '';
foreach ($messageFiles as $messageFile) {
	$message = substr($messageFile, -4) == "html" ?
		file_get_contents($messageFile) :
		implode('<br/>', file("../config/messages/$messageFile"));

	$messages .= "<div class='slideshow-content'>$message</div>";
}

?>

<div id="app"></div>

<script id="master-script" src="assets/master.js" data-user-type="admin" charset="utf-8"></script>
