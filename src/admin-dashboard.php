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

	.shift-cell:not([data-shift-id="null"]):hover {
		background: var(--dark-overlay);
		cursor: pointer;
	}

	section {
		height: 270px;
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
		<section id="shifts" class="body tab-content">
			<div class="container ">
				<h1>Shift list goes here</h1>
			</div>
		</section>
		<section id="users" class="body tab-content">
			<div class="container">
				<button data-toggles="user-creation-modal">Add users</button>
				<table>
					<thead>
						<th>E-mail</th>
						<th>Name</th>
						<th>Access Level</th>
					</thead>
					<tbody id="user-list">
					</tbody>
				</table>
			</div>
		</section>
		</div>
	</div>
</div>


<div id="user-update-modal" class="modal">
	<div class="header">User Info</div>
	<div class="body">
		<label>
			<strong>Name:</strong>
			<input class="full-width" name="name" type="text">
		</label>
		<label>
			<strong>Email:</strong>
			<input class="full-width" name="email" type="email">
		</label>
		<label>
			<strong>Access Level</strong>
			<select name="access-level">
				<option value="user">User</option>
				<option value="admin">Administrator</option>
			</select>
		</label>

	</div>
	<div class="footer">
		<button class="primary">Update info</button>
		<button data-toggles="user-update-modal">Cancel</button>
		<button class="danger">Delete user</button>
	</div>
</div>


<div class="modal" id="user-creation-modal">
	<div class="header">Add users</div>
	<div class="body">
		<label>
			<strong>User list:</strong>
			<textarea class="full-width" name="" id=""></textarea>
		</label>
		<p>
			Enter the email, initial password and name of each user to be created
			in a single line separated by tabulations. More than one line can be
			used at once to create multiple users.
		</p>
	</div>
	<div class="footer">
		<button id="user-creation-button">Add users</button>
	</div>
</div>

<script src="js/master.js" charset="utf-8"></script>
