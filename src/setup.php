<?php
require '../local/config.php';


function autoloader($class) {
	$class = str_replace("\\", DIRECTORY_SEPARATOR, $class);
	include_once '../local/classes/' . $class . '.php';
}


spl_autoload_register("autoloader");

session_start();


$connection =
	new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $dbuser, $password);
$userDataAccessor = new UserDataAccessor($connection);

$user = isset($_SESSION["user_id"]) ?
	User::restoreSession($userDataAccessor, $_SESSION["user_id"]) : null;
