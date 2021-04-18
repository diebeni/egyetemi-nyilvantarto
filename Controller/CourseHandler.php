<?php

require_once '../Model/Course.php';


if (isset($_POST['functionId'])) {
    if ($_POST['functionId'] == 'createcourse') {
        registerCourse($_POST['data']);
    }
    if ($_POST['functionId'] == 'loadcourse') {
        loadCourse();
    }
    if ($_POST['functionId'] == 'loadcourseattends') {
        loadCourseAttends($_POST['courseid']);
    }
    if ($_POST['functionId'] == 'loadcoursedetails') {
        loadCourseDetails($_POST['courseid']);
    }
    if ($_POST['functionId'] == 'updatecourseattends') {
        updateCourseAttends($_POST['courseid'], $_POST['updatelist']);
    }
}

function registerCourse($data)
{
    $course = new Course();
    echo json_encode($course->insertCourseData($data));
}

function loadCourse()
{
    $course = new Course();
    echo json_encode($course->loadCourseData());
}

function loadCourseAttends($courseid)
{
    $course = new Course();
    echo json_encode($course->loadCourseAttendsData($courseid));
}

function loadCourseDetails($courseid)
{
    $course = new Course();
    echo json_encode($course->loadCourseDetails($courseid));
}

function updateCourseAttends($courseid, $updatelist)
{
    $course = new Course();
    echo json_encode($course->updateCourseAttendsData($courseid, $updatelist));
}
