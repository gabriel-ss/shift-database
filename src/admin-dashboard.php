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
		height: 200px
	}
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
				<div id="messages">
					<h1>I AM ROOT!</h1>
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
