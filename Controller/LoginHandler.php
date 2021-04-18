<?php

require_once '../Model/Student.php';
require_once '../Model/Professor.php';

if (isset($_POST['functionId']) && isset($_POST['neptun']) && isset($_POST['pswd'])) {
    if ($_POST['functionId'] == 'studentlogin') {
        checkStudentLogin($_POST['neptun'], $_POST['pswd']);
    }
    if ($_POST['functionId'] == 'professorlogin') {
        checkProfessorLogin($_POST['neptun'], $_POST['pswd']);
    }
}

function checkStudentLogin($neptun, $pswd)
{
    $student = new Student();
    $student->login($neptun, $pswd);
}

function checkProfessorLogin($neptun, $pswd)
{
    $professor = new Professor();
    echo json_encode($professor->login($neptun, $pswd));
}
