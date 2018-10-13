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
				<li class="tab-title" data-tab-target="shifts">Shift Subscription</li>
				<li class="tab-title" data-tab-target="list">My Shifts</li>
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
					<div class="slideshow-content active">
						<p>&quot;O Deep Thought Computer,&quot; he said, &quot;the task we have designed you to perform is this. We want you to tell us ...&quot; he paused, &quot;... the Answer!&quot;</p>
						<p>&quot;The answer?&quot; said Deep Thought. &quot;The answer to what?&quot;</p>
						<p>&quot;Life!&quot; urged Fook.</p>
						<p>&quot;The Universe!&quot; said Lunkwill.</p>
						<p>&quot;Everything!&quot; they said in chorus. </p>
					</div>
					<div class="slideshow-content">
						<p>&quot;Tricky,&quot; he said finally.</p>
						<p>&quot;But can you do it?&quot;</p>
						<p>Again, a significant pause.</p>
						<p>&quot;Yes,&quot; said Deep Thought, &quot;I can do it.&quot;</p>
						<p>&quot;There is an answer?&quot; said Fook with breathless excitement.&quot;</p>
						<p>&quot;A simple answer?&quot; added Lunkwill.</p>
						<p>&quot;Yes,&quot; said Deep Thought. &quot;Life, the Universe, and Everything. There is an answer. But,&quot; he added, &quot;I'll have to think about it.&quot;</p>
					</div>
					<div class="slideshow-content">
						<p>There was a moment's expectant pause whilst panels slowly came to life on the front of the console. Lights flashed on and off experimentally and settled down into a businesslike pattern. A soft low hum came from the communication channel.</p>
						<p>&quot;Good morning,&quot; said Deep Thought at last.</p>
						<p>&quot;Er ... Good morning, O Deep Thought,&quot; said Loonquawl nervously, &quot;do you have ... er, that is ...&quot;</p>
						<p>&quot;An answer for you?&quot; interrupted Deep Thought majestically. &quot;Yes. I have.&quot;</p>
						<p>The two men shivered with expectancy. Their waiting had not been in vain.</p>
						<p>&quot;There really is one?&quot; breathed Phouchg.</p>
						<p>&quot;There really is one,&quot; confirmed Deep Thought.</p>
						<p>&quot;To Everything? To the great Question of Life, the Universe and Everything?&quot;</p>
						<p>&quot;Yes.&quot;</p>
						<p>Both of the men had been trained for this moment, their lives had been a preparation for it, they had been selected at birth as those who would witness the answer, but even so they found themselves gasping and squirming like excited children.</p>
						<p>&quot;And you're ready to give it to us?&quot; urged Loonquawl. &quot;I am.&quot;</p>
						<p>&quot;Now?&quot;</p>
						<p>&quot;Now,&quot; said Deep Thought.</p>
					</div>
					<div class="slideshow-content">
						<p>They both licked their dry lips.</p>
						<p>&quot;Though I don't think,&quot; added Deep Thought, &quot;that you're going to like it.&quot;</p>
						<p>&quot;Doesn't matter!&quot; said Phouchg. &quot;We must know it! Now!&quot;</p>
						<p>&quot;Now?&quot; inquired Deep Thought.</p>
						<p>&quot;Yes! Now ...&quot;</p>
						<p>&quot;Alright,&quot; said the computer and settled into silence again. The two men fidgeted. The tension was unbearable.</p>
						<p>&quot;You're really not going to like it,&quot; observed Deep Thought.</p>
						<p>&quot;Tell us!&quot;</p>
						<p>&quot;Alright,&quot; said Deep Thought. &quot;The Answer to the Great Question ...&quot;</p>
						<p>&quot;Yes ...!&quot;</p>
						<p>&quot;Of Life, the Universe and Everything ...&quot; said Deep Thought.</p>
						<p>&quot;Yes ...!&quot;</p>
						<p>&quot;Is ...&quot; said Deep Thought, and paused.</p>
						<p>&quot;Yes ...!&quot;</p>
						<p>&quot;Is ...&quot;</p>
						<p>&quot;Yes ...!!!...?&quot;</p>
						<p>&quot;Forty-two,&quot; said Deep Thought, with infinite majesty and calm.</p>
					</div>
				</div>
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
		<section id="list" class="body tab-content">
			<div class="container">
				<?php // TODO: Update dynamically ?>
				<?php	$table = new ShiftTable($connection); ?>
					<?php echo $table->getAsHTMLList($_SESSION['user_id']); ?>
			</div>
		</section>
		</div>
	</div>
</div>


<div id="shift-modal" class="modal">
	<div class="header">Shift Details</div>
	<div class="body"></div>
</div>

<script src="js/main.js" charset="utf-8"></script>
