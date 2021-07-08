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
    if ($_POST['functionId'] == 'modifycourse') {
        updateCourseDetails($_POST['coursedetails']);
    }
    if ($_POST['functionId'] == 'deletecourse') {
        deleteCourse($_POST['courseid']);
    }
    if ($_POST['functionId'] == 'loadstudentmycourse') {
        loadStudentMyCourse();
    }
    if ($_POST['functionId'] == 'loadavailablecourses') {
        loadAvailableCourses();
    }
    if ($_POST['functionId'] == 'showcourseinfo') {
        showCourseInfo($_POST['courseid']);
    }
    if ($_POST['functionId'] == 'registerstudent') {
        registerStudent($_POST['courseid']);
    }
    if ($_POST['functionId'] == 'deletecourseattend') {
        deleteCourseattend($_POST['courseid']);
    }
    if ($_POST['functionId'] == 'showmyprogress') {
        showMyProgress($_POST['courseid']);
    }
}

function registerCourse($newcourse)
{
    $course = new Course();
    echo json_encode($course->insertCourseData($newcourse));
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

function updateCourseDetails($coursedetails)
{
    $course = new Course();
    echo json_encode($course->updateCourseDetailsData($coursedetails));
}

function deleteCourse($courseid)
{
    $course = new Course();
    echo json_encode($course->deleteCourseData($courseid));
}

function loadStudentMyCourse()
{
    $course = new Course();
    echo json_encode($course->loadStudentMyCourseData());
}

function loadAvailableCourses()
{
    $course = new Course();
    echo json_encode($course->loadAvailableCoursesData());
}

function showCourseInfo($courseid)
{
    $course = new Course();
    echo json_encode($course->showCourseInfoData($courseid));
}

function registerStudent($courseid)
{
    $course = new Course();
    echo json_encode($course->registerStudentData($courseid));
}

function deleteCourseattend($courseid)
{
    $course = new Course();
    echo json_encode($course->deleteCourseAttendData($courseid));
}

function showMyProgress($courseid)
{
    $course = new Course();
    echo json_encode($course->showMyProgressData($courseid));
}
