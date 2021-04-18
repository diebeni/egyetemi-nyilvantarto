<?php

// adatbázishoz kapcsolódó osztály

class DbConnect
{

    private $servername;

    private $username;

    private $password;

    private $dbname;

    protected function connect()
    {
        $this->servername = "localhost";
        $this->username = "root";
        $this->password = "";
        $this->dbname = "university";


        $conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        if ($conn->connect_errno) {
            echo "Failed to connect to MySQL: " . $conn->connect_error;
            exit();
        }
        return $conn;
    }
}
