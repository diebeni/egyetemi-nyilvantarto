<?php



class Professor extends DbConnect
{

    public function login($neptun, $pswd)
    {
        $clearneptun = mysqli_real_escape_string($this->connect(), $neptun);
        $sql = "SELECT * FROM professor WHERE neptun_code = '" . $clearneptun . "'";
        $result = $this->connect()->query($sql);
        $row = mysqli_fetch_assoc($result);
        if ($row) {

            if (password_verify($pswd, $row['password'])) {
                session_start();
                $_SESSION["neptun"] = $clearneptun;
                $_SESSION['last_activity'] = time();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
