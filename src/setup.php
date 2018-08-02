<?php
require '../local/config.php';

function autoloader($class)
{
    include_once '../local/classes/' . $class . '.php';
}

spl_autoload_register("autoloader");

session_start();


$connection = new PDO("mysql:host=$host;dbname=$dbname", $dbuser, $password);
$connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$user = new User($connection, $_SESSION["user_id"]);
