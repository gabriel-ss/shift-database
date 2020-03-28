<?php
require '../config/server-config.php';
require __DIR__ . '/../vendor/autoload.php';

session_start();

$connection =
	new PDO(
		'mysql:host=' . DB_HOST  . ';dbname=' . DB_NAME  . ';charset=utf8',
		DB_USER,
		DB_PASSOWRD,
	);
$userDataAccessor = new UserDataAccessor($connection);

$user = isset($_SESSION["user_id"]) ?
	User::restoreSession($userDataAccessor, $_SESSION["user_id"]) : null;
