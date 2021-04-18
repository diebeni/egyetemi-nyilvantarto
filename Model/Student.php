<?php


require_once '../Database/DbConnect.php';

class Student extends DbConnect
{


    public function login($neptun, $pswd)
    {
        $clearneptun = mysqli_real_escape_string($this->connect(), $neptun);
        $sql = "SELECT * FROM student WHERE neptun_code = '" . $clearneptun . "'";
        $result = $this->connect()->query($sql);
        $row = mysqli_fetch_assoc($result);
        if ($row) {

            if (password_verify($pswd, $row['password'])) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
