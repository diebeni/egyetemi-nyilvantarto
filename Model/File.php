<?php


require_once '../Database/DbConnect.php';

class File extends DbConnect
{

    function uploadFile($myfile, $courseid)
    {
        $name = $myfile['name'];
        $type = $myfile['type'];
        $size = $myfile['size'];
        $file = $myfile['tmp_name'];
        $mysqliconnect = $this->connect();
        $dir = '../uploads/' . $courseid . '/';

        if (!file_exists($dir) && !is_dir($dir)) {
            mkdir($dir);
        }

        $destination = $dir . $name;

        move_uploaded_file($file, $destination);
        $date = date('Y-m-d H:i:s');
        $sql = "INSERT INTO course_document (course_id, file_name, file_type, file_size, file_uploaddate) VALUES ('" . $courseid . "', '" . $name . "', '" . $type . "', " . $size . ", '" . $date . "')";
        $mysqliconnect->query($sql);

        $sql2 = "SELECT file_name FROM course_document WHERE course_id = '" . $courseid . "' ORDER BY file_uploaddate desc LIMIT 1";
        $uploadresult = $mysqliconnect->query($sql2);

        return $uploadresult->fetch_assoc();
    }

    function loadFiles($courseid)
    {
        $mysqliconnect = $this->connect();

        $sql = "SELECT file_name FROM course_document WHERE course_id = '" . $courseid . "'";
        $result = $mysqliconnect->query($sql);

        $data = (object) [
            'filelist' => array()
        ];

        while ($fileobj = $result->fetch_object()) {

            array_push($data->filelist, $fileobj);
        }
        return $data;
    }

    function deleteFile($courseid, $filename)
    {
        $mysqliconnect = $this->connect();
        $sql = "DELETE FROM course_document where course_id = '" . $courseid . "' and file_name = '" . $filename . "'";
        $mysqliconnect->query($sql);

        $deletedfiles = '../uploads/' . $courseid . '/';

        unlink($deletedfiles . $filename);
    }
}
