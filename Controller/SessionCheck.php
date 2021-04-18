<?php
session_start();

if (!isset($_SESSION['last_activity']) || $_SESSION['last_activity'] < time() - 1500) {
    $_SESSION = [];
    echo json_encode(false);
} else {
    $_SESSION['last_activity'] = time();
}
