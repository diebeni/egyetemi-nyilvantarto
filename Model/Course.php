<?php

require_once('../Database/DbConnect.php');

class Course extends DbConnect
{

    public function insertCourseData($data)
    {
        session_start();
        $all_query_ok = true;
        $mysqliconnect = $this->connect();
        $mysqliconnect->autocommit(FALSE);
        if (
            isset($data['lecturecode']) && $data['lecturecode'] != ""
            && isset($data['lecturename']) && $data['lecturename'] != ""
            && isset($data['lecturedescr']) && $data['lecturedescr'] != ""
        ) {
            $insertCourseDataSql = "INSERT into course VALUES ('" . mysqli_real_escape_string($mysqliconnect, $data['lecturecode']) . "',
            '" . mysqli_real_escape_string($mysqliconnect, $data['lecturename']) . "', '" . mysqli_real_escape_string($mysqliconnect, $data['lecturedescr']) . "', '" . $_SESSION["neptun"] . "')";
            $result = $mysqliconnect->query($insertCourseDataSql);
            $result ? null : $all_query_ok = false;
        }
        if (isset($data['lecturemax']) && $data['lecturemax'] != "" && isset($data['lecturemin']) && $data['lecturemin'] != "") {
            $insertReqLectSql = "INSERT into course_requirement VALUES ('" . mysqli_real_escape_string($mysqliconnect, $data['lecturecode']) . "',
            'ATTENDANCE_LECTURE', '" . mysqli_real_escape_string($mysqliconnect, $data['lecturemax']) . "',
             '" . mysqli_real_escape_string($mysqliconnect, $data['lecturemin']) . "')";
            $result = $mysqliconnect->query($insertReqLectSql);
            $result ? null : $all_query_ok = false;
        }
        if (isset($data['practicemax']) && $data['practicemax'] != "" && isset($data['practicemin']) && $data['practicemin'] != "") {
            $insertReqPractSql = "INSERT into course_requirement VALUES ('" . mysqli_real_escape_string($mysqliconnect, $data['lecturecode']) . "',
            'ATTENDANCE_PRACTICE', '" . mysqli_real_escape_string($mysqliconnect, $data['practicemax']) . "',
             '" . mysqli_real_escape_string($mysqliconnect, $data['practicemin']) . "')";
            $result = $mysqliconnect->query($insertReqPractSql);
            $result ? null : $all_query_ok = false;
        }
        if (isset($data['firstzhmax']) && $data['firstzhmax'] != "" && isset($data['firstzhmin']) && $data['firstzhmin'] != "") {
            $insertReqFirstzhSql = "INSERT into course_requirement VALUES ('" . mysqli_real_escape_string($mysqliconnect, $data['lecturecode']) . "',
            'FIRST_ZH', '" . mysqli_real_escape_string($mysqliconnect, $data['firstzhmax']) . "',
             '" . mysqli_real_escape_string($mysqliconnect, $data['firstzhmin']) . "')";
            $result = $mysqliconnect->query($insertReqFirstzhSql);
            $result ? null : $all_query_ok = false;
        }
        if (isset($data['secondzhmax']) && $data['secondzhmax'] != "" && isset($data['secondzhmin']) && $data['secondzhmin'] != "") {
            $insertReqFirstzhSql = "INSERT into course_requirement VALUES ('" . mysqli_real_escape_string($mysqliconnect, $data['lecturecode']) . "',
            'SECOND_ZH', '" . mysqli_real_escape_string($mysqliconnect, $data['secondzhmax']) . "',
             '" . mysqli_real_escape_string($mysqliconnect, $data['secondzhmin']) . "')";
            $result = $mysqliconnect->query($insertReqFirstzhSql);
            $result ? null : $all_query_ok = false;
        }
        if (isset($data['homeworkcheckbox']) && $data['homeworkcheckbox'] != "") {
            $insertReqHomeworkSql = "INSERT into course_requirement VALUES ('" . mysqli_real_escape_string($mysqliconnect, $data['lecturecode']) . "',
            'HOMEWORK', '1','1')";
            $result = $mysqliconnect->query($insertReqHomeworkSql);
            $result ? null : $all_query_ok = false;
        }
        $all_query_ok ? $mysqliconnect->commit() : $mysqliconnect->rollback();
        return $all_query_ok;
    }

    public function loadCourseData()
    {
        session_start();
        $mysqliconnect = $this->connect();
        $selectCourseDataSql = "SELECT course_id, course_name, course_description FROM course WHERE created_by = '" . $_SESSION["neptun"] . "' ";
        $result = $mysqliconnect->query($selectCourseDataSql);

        $data = (object) [
            'courselist' => array()
        ];

        while ($courseobj = $result->fetch_object()) {
            $selectCourseReq = "SELECT requirement_type, max_requirement, min_requirement FROM course_requirement where course_id = '" . $courseobj->course_id . "'";
            $requirementresult = $mysqliconnect->query($selectCourseReq);
            $courseobj->requirement = array();

            while ($requirementobj = $requirementresult->fetch_object()) {
                array_push($courseobj->requirement, $requirementobj);
            }

            array_push($data->courselist, $courseobj);
        }
        return $data;
    }

    public function loadCourseAttendsData($courseid)
    {
        $mysqliconnect = $this->connect();
        $selectCourseAttendDataSql =
            "SELECT a.neptun_code, name FROM `attend` as a INNER JOIN student as s on a.neptun_code=s.neptun_code WHERE course_id = '" . $courseid . "' group by a.neptun_code order by name";
        $result = $mysqliconnect->query($selectCourseAttendDataSql);

        $data = (object) [
            'studentlist' => array()
        ];

        while ($studentobj = $result->fetch_object()) {
            $selectProgress = "SELECT requirement_type, progress FROM `attend` where neptun_code = '" . $studentobj->neptun_code . "' and course_id = '" . $courseid . "' ORDER BY
                CASE requirement_type WHEN 'ATTENDANCE_LECTURE' THEN 1 WHEN 'ATTENDANCE_PRACTICE' THEN 2 WHEN 'FIRSTZH' THEN 3 WHEN 'SECONDZH' THEN 4 WHEN 'HOMEWORK' THEN 5 END";
            $progressresult = $mysqliconnect->query($selectProgress);
            $studentobj->requirementprogress = array();

            while ($progressobj = $progressresult->fetch_object()) {
                array_push($studentobj->requirementprogress, $progressobj);
            }

            array_push($data->studentlist, $studentobj);
        }
        return $data;
    }

    public function updateCourseAttendsData($courseid, $updatelist)
    {
        $mysqliconnect = $this->connect();
        foreach ($updatelist as $studentitem) {
            $neptuncode = mysqli_real_escape_string($mysqliconnect, $studentitem['neptun_code']);
            foreach ($studentitem['studprogress'] as $progressitem) {
                $progress = mysqli_real_escape_string($mysqliconnect, $progressitem['progress']);
                $reqtype = mysqli_real_escape_string($mysqliconnect, $progressitem['requirement_type']);
                $updateCourseAttendDataSql =
                    "UPDATE attend set progress = '" . $progress . "' WHERE neptun_code = '" . $neptuncode . "' and course_id = '" . $courseid . "' and requirement_type = '" . $reqtype . "'";
                $result = $mysqliconnect->query($updateCourseAttendDataSql);
            }
        }
    }

    public function loadCourseDetails($courseid)
    {

        $mysqliconnect = $this->connect();
        $selectCourseDetailsSql = "SELECT course_id, course_name, course_description FROM `course` WHERE course_id = '" . $courseid . "'";
        $detailsresult = $mysqliconnect->query($selectCourseDetailsSql);
        $data = (object) [
            'coursedetails' => new stdClass()
        ];
        $data->coursedetails = $detailsresult->fetch_object();
        $selectRequirement = "SELECT requirement_type, max_requirement, min_requirement FROM `course_requirement` WHERE course_id = '" . $courseid . "' ORDER BY
                    CASE requirement_type WHEN 'ATTENDANCE_LECTURE' THEN 1 WHEN 'ATTENDANCE_PRACTICE' THEN 2 WHEN 'FIRSTZH' THEN 3 WHEN 'SECONDZH' THEN 4 WHEN 'HOMEWORK' THEN 5 END";
        $requirementsresult = $mysqliconnect->query($selectRequirement);
        $data->coursedetails->requirementlist = array();

        while ($requirementlistobj = $requirementsresult->fetch_object()) {
            array_push($data->coursedetails->requirementlist, $requirementlistobj);
        }

        return $data;
    }
}
