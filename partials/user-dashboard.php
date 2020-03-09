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
<style media="screen">

	#account-details {
		width: 85%;
		margin: auto;
		border-width: 0 1px 0 0;
		box-sizing: border-box;
	}

	#message-board {
		margin: auto;
		width: 85%;
		box-sizing: border-box;
	}

	#messages {
		height: 35vh;
	}

	#scheduler ul {
		padding: 0 .75em;
		margin: 0;
	}
	#scheduler li {
		list-style: none;
		border-bottom: solid 1px lightgray;
	}
	#scheduler li:last-child {border-bottom: none;}
	#scheduler button {margin: .5em 0;}
	#scheduler th, #scheduler td {text-align: center}


</style>
<div class="container section">
	<div class="card light">
		<nav class="header">
			<ul class="tab-group">
				<li class="tab-title" data-tab-target="account">Account</li>
				<li class="tab-title" data-tab-target="shifts">Shift Subscription</li>
				<li class="tab-title" data-tab-target="subscription-list">My Shifts</li>
			</ul>
		</nav>
		<section id="account" class="body tab-content">

			<div id="message-board">
				<h2>Messages</h2>
				<div id="messages" class="slideshow">
					<?php echo $messages ?>
				</div>
			</div>
			<script type="text/javascript">
				if (firstMessage = document.querySelector("#messages>div"))
					firstMessage.classList.add("active");
			</script>
			<div id="account-details">
				<h1>User data</h1>
				<p class="lead">
					Logged as
					<?php echo $user->getName() ?>.
				</p>
				<small>
					<?php echo $user->getEmail(); ?>
				</small>
				<p>
					You can change <a href="email-update.php">your e-mail</a> or
					<a href="password-update.php">your password</a> here if you wish.
				</p>
			</div>

		</section>
		<section id="shifts" class="body tab-content"></section>
		<section id="subscription-list" class="body tab-content"></section>
		</div>
	</div>
</div>


<div id="shift-modal" class="modal">
	<div class="header">Shift Details</div>
	<div class="body"></div>
</div>

<script src="assets/master.js" charset="utf-8"></script>
