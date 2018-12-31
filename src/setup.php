<?php
require '../local/config.php';

function autoloader($class)
{
    include_once '../local/classes/' . $class . '.php';
}

spl_autoload_register("autoloader");

session_start();


$connection = new PDO("mysql:host=$host;dbname=$dbname", $dbuser, $password);
$userDataAccessor = new UserDataAccessor($connection);
$user = User::restoreSession($userDataAccessor, $_SESSION["user_id"]);
