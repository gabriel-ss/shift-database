<?php
$messageFiles = array_diff(scandir("../local/messages/"), array('..', '.'));
$messages = '';
foreach ($messageFiles as $messageFile) {
	$message = implode('<br/>', file("../local/messages/$messageFile"));
	$messages .= "<div class='slideshow-content'>$message</div>";
}

?>
<style media="screen">

	#account-details {
		float: left;
		width: 35%;
		padding: 1em;
		border-style: solid;
		border-width: 0 1px 0 0;
		box-sizing: border-box;
	}

	#message-board {
		float: right;
		width: 65%;
		padding: 1em;
		box-sizing: border-box;
	}

	#messages {
		height: 200px
	}
</style>
<div class="container">
	<div class="card light">
		<nav class="header">
			<ul class="tab-group">
				<li class="tab-title" data-tab-target="account">Account</li>
				<li class="tab-title" data-tab-target="shifts">Shift Subscription</li>
				<li class="tab-title" data-tab-target="subscription-list">My Shifts</li>
			</ul>
		</nav>
		<section id="account" class="body tab-content">

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
			<div id="message-board">
				<h2 style="text-align:center; margin: 0;">Messages</h2>
				<div id="messages" class="slideshow">
					<?php echo $messages ?>
				</div>
				<script type="text/javascript">
					if (firstMessage = document.querySelector("#messages>div"))
						firstMessage.classList.add("active");
				</script>
		</section>
		<section id="shifts" class="body tab-content">
			<table class="" id="shift-table">
			</table>
			<div class="slideshow" style="position: relative">
				<div class="slideshow-content">
					<div class="date">This Week</div>
				</div>
			</div>
			<div class="container ">
			</div>
		</section>
		<section id="subscription-list" class="body tab-content">
		</section>
		</div>
	</div>
</div>


<div id="shift-modal" class="modal">
	<div class="header">Shift Details</div>
	<div class="body"></div>
</div>

<script src="js/master.js" charset="utf-8"></script>
