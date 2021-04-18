<?php

require_once '../Model/File.php';
if (isset($_POST['functionId'])) {
    if ($_POST['functionId'] == 'loaddocs') {
        loadFiles($_POST['courseid']);
    }
    if ($_POST['functionId'] == 'deletefile') {
        deleteFile($_POST['courseid'], $_POST['filename']);
    }
} else if ($_FILES && 0 < $_FILES['file']['error']) {
    echo 'Error: ' . $_FILES['file']['error'] . '<br>';
} else {
    uploadFile($_FILES['file'], $_POST['courseid']);
}



function uploadFile($myfile, $courseid)
{
    $file = new File();
    echo json_encode($file->uploadFile($myfile, $courseid));
}
function loadFiles($courseid)
{
    $file = new File();
    echo json_encode($file->loadFiles($courseid));
}
function deleteFile($courseid, $filename)
{
    $file = new File();
    echo json_encode($file->deleteFile($courseid, $filename));
}
