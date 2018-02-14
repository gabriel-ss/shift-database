<?php

/**
 * Handles user sessions in SQL databases
 */
class User
{
	/**
	 * Stores the connection with the database
	 * @var PDO
	 */
    private $db;

    private $user_id;

    /**
     * Receives a PDO connection as the first argument. The constructor can also
     * take an user id as an optional parameter. In this case the class will
	  * properly handle the user id and update the passed variable making
     * possible to use PHP sessions to store the user's id.
	  *
	  * @param PDO $connection A PDO object connected to the users database
	  * @param int $user_id Optional. If a variable is passed here it will be
	  * modified as needed, such as during login.
     */
    public function __construct($connection, &$user_id = null)
    {
        $this->db = $connection;
        $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->user_id = &$user_id;
    }

    public function register($email, $password, $name)
    {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $query = $this->db->prepare("INSERT INTO users (email, name, password) VALUES (?, ?, ?)");
        $query->execute([$email, $name, $passwordHash]);
    }

    public function login($email, $password)
    {
        $query = $this->db->prepare("SELECT user_id, password FROM users WHERE email=?");
        $query->execute([$email]);

        if (!$query->rowCount()) {
            return false;
        }

        $userData = $query->fetch();

        if (password_verify($password, $userData["password"])) {
            $this->user_id = $userData["user_id"];
            return true;
        }
        return false;
    }

    public function isLogged()
    {
        return $this->user_id ? true : false;
    }

    public function getFullName()
    {
        $query = $this->db->prepare("SELECT name FROM users WHERE user_id=?");
        $query->execute([$this->user_id]);
        return $query->fetch()["name"];
    }

    public function getFirstName()
    {
        $fullName = $this->getFullName();
        $firstName = strstr($this->getFullName(), " ", true);
        return $firstName ? $firstName : $fullName;
    }

    public function logout()
    {
        $this->user_id = null;
        session_destroy();
    }
}
