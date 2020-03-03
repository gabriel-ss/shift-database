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

	#schedule input{
		width: 100%;
		background: none;
		border: none;
	}

	#schedule-creation {
		display: flex;
		justify-content: center;
	}

	tbody th{
		cursor: pointer;
	}

	section {
		height: 65vh;
		overflow: auto;
	}

	#messages {
		height: 35vh;
	}

	#viewer ul {
		padding: 0 .75em;
		margin: 0;
	}
	#viewer li {
		list-style: none;
		border-bottom: solid 1px lightgray;
	}
	#viewer li:last-child {border-bottom: none;}
	#viewer button {margin: .5em 0;}
	#viewer th, #viewer td {text-align: center}

</style>
<div class="container">
	<div class="card light">
		<nav class="header">
			<ul class="tab-group">
				<li class="tab-title" data-tab-target="account">Account</li>
				<li class="tab-title" data-tab-target="shifts">Shift Management</li>
				<li class="tab-title" data-tab-target="users">User Management</li>
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
		<section id="users" class="body tab-content"></section>
		</div>
	</div>
</div>


<div id="user-creation-modal" class="modal"></div>

<div id="user-update-modal" class="modal"></div>

<div id="shift-management-modal" class="modal"></div>

<script src="js/master.js" charset="utf-8"></script>
