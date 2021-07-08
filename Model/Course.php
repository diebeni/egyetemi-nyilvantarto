<?php

require_once('../Database/DbConnect.php');

class Course extends DbConnect
{

    public function validateRequirement($min, $max)
    {
        if (!is_numeric($min) || !is_numeric($max) || $min < 0 || $max < 0) {
            throw new Exception('A követelmények csak 0-tól nagyobb számok lehetnek !');
        }
        if ($min == "" || $max == "") {
            throw new Exception('Hiányzik a minimum vagy maximum érték!');
        }
        if ($min > $max) {
            throw new Exception('A minimum óraszám/pontszám nagyobb mint az összes!');
        }
    }

    public function insertCourseData($course)
    {
        session_start();
        $all_query_ok = true;
        $mysqliconnect = $this->connect();
        $mysqliconnect->autocommit(FALSE);

        $coursename = mysqli_real_escape_string($mysqliconnect, $course['coursename']);
        $coursedesc = mysqli_real_escape_string($mysqliconnect, $course['coursedesc']);
        $courseid = mysqli_real_escape_string($mysqliconnect, $course['courseid']);
        $response = (object) [
            'msg' => new stdClass(),
            'success' => new stdClass()
        ];
        $response->success = true;

        try {
            if ($courseid == "" || $coursename == "" || $coursedesc == "") {
                throw new Exception("A tárgyadatokat kötelező kitölteni!");
            }
            $createdby = $_SESSION["neptun"];
            $checkIfDuplicateSql = "SELECT count(1) as counter from course WHERE course_id = '" . $courseid . "' ";
            if ($mysqliconnect->query($checkIfDuplicateSql)->fetch_array()['counter'] > 0) {
                throw new Exception("Ez a tárgy már létezik!");
            }
            $insertNewCourseDataSql = "INSERT into course VALUES ('" . $courseid . "', '" . $coursename . "', '" . $coursedesc . "', '" . $createdby . "')";
            $result = $mysqliconnect->query($insertNewCourseDataSql);
            $result ? null : $all_query_ok = false;

            foreach ($course['courselist'] as $insertlist) {
                $requirementtype = mysqli_real_escape_string($mysqliconnect, $insertlist['requirementtype']);

                if ($requirementtype != 'HOMEWORK') {
                    $min = mysqli_real_escape_string($mysqliconnect, $insertlist['min_requirement']);
                    $max = mysqli_real_escape_string($mysqliconnect, $insertlist['max_requirement']);
                    $this->validateRequirement($min, $max);
                } else {
                    $min = 1;
                    $max = 1;
                }
                $insertNewCourseReqDataSql = "INSERT into course_requirement VALUES ('" . $courseid . "', '" . $requirementtype . "', '" . $max . "', '" . $min . "')";
                $result = $mysqliconnect->query($insertNewCourseReqDataSql);
                $result ? null : $all_query_ok = false;
            }
        } catch (Exception $e) {
            $response->msg = $e->getMessage();
            $response->success = false;
            $all_query_ok = false;
        }
        $all_query_ok ? $mysqliconnect->commit() : $mysqliconnect->rollback();
        return $response;
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
            /* $selectCourseReq = "SELECT requirement_type, max_requirement, min_requirement FROM course_requirement where course_id = '" . $courseobj->course_id . "'";
            $requirementresult = $mysqliconnect->query($selectCourseReq);
            $courseobj->requirement = array();

            while ($requirementobj = $requirementresult->fetch_object()) {
                array_push($courseobj->requirement, $requirementobj);
            } */

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
        $all_query_ok = true;
        $mysqliconnect = $this->connect();
        $mysqliconnect->autocommit(FALSE);

        $response = (object) [
            'msg' => new stdClass(),
            'success' => new stdClass()
        ];
        $response->success = true;
        try {
            foreach ($updatelist as $studentitem) {
                $neptuncode = mysqli_real_escape_string($mysqliconnect, $studentitem['neptun_code']);
                foreach ($studentitem['studprogress'] as $progressitem) {
                    $progress = mysqli_real_escape_string($mysqliconnect, $progressitem['progress']);
                    if (!is_numeric($progress)) {
                        throw new Exception("Csak számokkal lehet kitölteni !");
                    }
                    $reqtype = mysqli_real_escape_string($mysqliconnect, $progressitem['requirement_type']);
                    $updateCourseAttendDataSql =
                        "UPDATE attend set progress = '" . $progress . "' WHERE neptun_code = '" . $neptuncode . "' and course_id = '" . $courseid . "' and requirement_type = '" . $reqtype . "'";
                    $mysqliconnect->query($updateCourseAttendDataSql);
                }
            }
        } catch (Exception $e) {
            $response->msg = $e->getMessage();
            $response->success = false;
            $all_query_ok = false;
        }
        $all_query_ok ? $mysqliconnect->commit() : $mysqliconnect->rollback();
        return $response;
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

    public function updateCourseDetailsData($coursedetails)
    {

        $all_query_ok = true;
        $mysqliconnect = $this->connect();
        $mysqliconnect->autocommit(FALSE);

        $response = (object) [
            'msg' => new stdClass(),
            'success' => new stdClass()
        ];
        $response->success = true;

        $coursename = mysqli_real_escape_string($mysqliconnect, $coursedetails['coursename']);
        $coursedesc = mysqli_real_escape_string($mysqliconnect, $coursedetails['coursedesc']);
        $courseid = mysqli_real_escape_string($mysqliconnect, $coursedetails['courseid']);
        $updateCourse = "UPDATE course set course_name = '" . $coursename . "', course_description = '" . $coursedesc . "' WHERE course_id = '" . $courseid . "'";
        $result = $mysqliconnect->query($updateCourse);
        $result ? null : $all_query_ok = false;
        try {
            if ($coursename == "" || $coursedesc == "") {
                throw new Exception("A tárgyadatokat kötelező kitölteni!");
            }
            foreach ($coursedetails['detailslist'] as $detailsitem) {
                $requirementtype = mysqli_real_escape_string($mysqliconnect, $detailsitem['requirementtype']);
                $todo = mysqli_real_escape_string($mysqliconnect, $detailsitem['todo']);

                if ($requirementtype != 'HOMEWORK' && $todo != 'delete') {
                    $min = mysqli_real_escape_string($mysqliconnect, $detailsitem['min_requirement']);
                    $max = mysqli_real_escape_string($mysqliconnect, $detailsitem['max_requirement']);
                } else {
                    $min = 1;
                    $max = 1;
                }
                if ($todo == 'update') {
                    $this->validateRequirement($min, $max);
                    $updateCourseReqSql = "UPDATE course_requirement set min_requirement = '" . $min . "', max_requirement = '" . $max . "' WHERE course_id = '" . $courseid . "' and
                 requirement_type = '" . $requirementtype . "'";
                    $updateresult = $mysqliconnect->query($updateCourseReqSql);
                    $updateresult ? null : $all_query_ok = false;
                } else if ($todo == 'insert') {
                    $this->validateRequirement($min, $max);
                    $insertCourseReqSql = "INSERT into course_requirement VALUES ('" . $courseid . "', '" . $requirementtype . "', '" . $max . "', '" . $min . "') ";
                    $insertcoursereqresult = $mysqliconnect->query($insertCourseReqSql);
                    $insertcoursereqresult ? null : $all_query_ok = false;

                    $selectCourseAttendantsSql = "SELECT neptun_code FROM attend WHERE course_id = '" . $courseid . "' GROUP BY neptun_code";
                    $result = $mysqliconnect->query($selectCourseAttendantsSql);
                    while ($row = $result->fetch_object()) {
                        $insertCourseAttendSql = "INSERT into attend VALUES ('" . $row->neptun_code . "','" . $courseid . "','" . $requirementtype . "', 0)";
                        $insertcourseattandresult = $mysqliconnect->query($insertCourseAttendSql);
                        $insertcourseattandresult ? null : $all_query_ok = false;
                    }
                } else if ($todo == 'delete') {
                    $deleteCourseAttendSql = "DELETE from attend WHERE course_id = '" . $courseid . "' and requirement_type = '" . $requirementtype . "'";
                    $deletecourseattandresult = $mysqliconnect->query($deleteCourseAttendSql);
                    $deletecourseattandresult ? null : $all_query_ok = false;

                    $deleteCourseReqSql = "DELETE from course_requirement WHERE course_id = '" . $courseid . "' and requirement_type = '" . $requirementtype . "'";
                    $deletecoursereqresult = $mysqliconnect->query($deleteCourseReqSql);
                    $deletecoursereqresult ? null : $all_query_ok = false;
                }
            }
        } catch (Exception $e) {
            $response->msg = $e->getMessage();
            $response->success = false;
            $all_query_ok = false;
        }
        $all_query_ok ? $mysqliconnect->commit() : $mysqliconnect->rollback();
        return $response;
    }

    public function deleteCourseData($courseid)
    {
        $all_query_ok = true;
        $mysqliconnect = $this->connect();
        $mysqliconnect->autocommit(FALSE);

        $response = (object) [
            'msg' => new stdClass(),
            'success' => new stdClass()
        ];
        $response->success = true;
        $courseid = mysqli_real_escape_string($mysqliconnect, $courseid);

        $deleteCourseAttendSql = "DELETE FROM attend WHERE course_id = '" . $courseid . "'";
        $deleteresult = $mysqliconnect->query($deleteCourseAttendSql);
        $deleteresult ? null : $all_query_ok = false;

        $deleteCourseReqSql = "DELETE FROM course_requirement WHERE course_id = '" . $courseid . "'";
        $deleteresult = $mysqliconnect->query($deleteCourseReqSql);
        $deleteresult ? null : $all_query_ok = false;

        $deleteCourseDoc = "DELETE FROM course_document WHERE course_id = '" . $courseid . "'";
        $result = $mysqliconnect->query($deleteCourseDoc);
        $result ? null : $all_query_ok = false;


        $deleteCourse = "DELETE FROM course WHERE course_id = '" . $courseid . "'";
        $result = $mysqliconnect->query($deleteCourse);
        $result ? null : $all_query_ok = false;

        $all_query_ok ? $mysqliconnect->commit() : $mysqliconnect->rollback();
        return $response;
    }

    public function loadStudentMyCourseData()
    {
        session_start();
        $mysqliconnect = $this->connect();
        $selectMyCourseDataSql = "SELECT course_id, course_name, course_description FROM course WHERE course_id in ( SELECT course_id FROM attend WHERE neptun_code = '" . $_SESSION["neptun"] . "' )";
        $result = $mysqliconnect->query($selectMyCourseDataSql);

        $data = (object) [
            'courselist' => array()
        ];

        while ($courseobj = $result->fetch_object()) {
            $selectProgressFlag = "SELECT count(1) as attendflag from attend where course_id = '" . $courseobj->course_id . "' and neptun_code = '" . $_SESSION["neptun"] . "' and progress > 0";
            $flagresult = $mysqliconnect->query($selectProgressFlag);
            $row = $flagresult->fetch_assoc();
            $courseobj->isProgressed = $row['attendflag'] > 0 ? true : false;
            array_push($data->courselist, $courseobj);
        }
        return $data;
    }

    public function loadAvailableCoursesData()
    {
        session_start();
        $mysqliconnect = $this->connect();
        $selectMyCourseDataSql = "SELECT course_id, course_name, course_description  FROM course";
        $result = $mysqliconnect->query($selectMyCourseDataSql);

        $data = (object) [
            'courselist' => array()
        ];

        while ($courseobj = $result->fetch_object()) {
            $selectRegisteredFlag = "SELECT count(1) as flag from attend where course_id = '" . $courseobj->course_id . "' and neptun_code = '" . $_SESSION["neptun"] . "'";
            $flagresult = $mysqliconnect->query($selectRegisteredFlag);
            $row = $flagresult->fetch_assoc();
            $courseobj->isRegistered = $row['flag'] > 0 ? true : false;
            array_push($data->courselist, $courseobj);
        }
        return $data;
    }

    public function showCourseInfoData($courseid)
    {
        $mysqliconnect = $this->connect();
        $selectCourseReqInfoSql = "SELECT requirement_type, max_requirement, min_requirement FROM `course_requirement` WHERE course_id ='" . $courseid . "'";

        $result = $mysqliconnect->query($selectCourseReqInfoSql);

        $data = (object) [
            'infolist' => array()
        ];

        while ($courseobj = $result->fetch_object()) {

            array_push($data->infolist, $courseobj);
        }
        return $data;
    }

    public function registerStudentData($courseid)
    {
        session_start();
        $mysqliconnect = $this->connect();
        $courseid = mysqli_real_escape_string($mysqliconnect, $courseid);
        $insertStudentSql = "INSERT into attend (neptun_code, course_id, requirement_type, progress) (select '" . $_SESSION["neptun"] . "', '" . $courseid . "', requirement_type, 0 from course_requirement where course_id = '" . $courseid . "')";

        $result = $mysqliconnect->query($insertStudentSql);
    }

    public function deleteCourseAttendData($courseid)
    {
        session_start();
        $mysqliconnect = $this->connect();

        $response = (object) [
            'success' => new stdClass()
        ];
        $response->success = true;
        $courseid = mysqli_real_escape_string($mysqliconnect, $courseid);

        $deleteCourseAttendSql = "DELETE FROM attend WHERE neptun_code = '" . $_SESSION["neptun"] . "' and course_id = '" . $courseid . "'";
        $deleteresult = $mysqliconnect->query($deleteCourseAttendSql);
        $deleteresult ? $response->success = true : $response->success = false;

        return $response;
    }

    public function showMyProgressData($courseid)
    {
        session_start();
        $mysqliconnect = $this->connect();

        $response = (object) [
            'success' => new stdClass(),
            'requirementprogress' => array()
        ];
        $response->success = true;
        $courseid = mysqli_real_escape_string($mysqliconnect, $courseid);

        $progressSql = "SELECT a.requirement_type, a.progress, cr.min_requirement, cr.max_requirement FROM attend a, course_requirement cr WHERE a.neptun_code = '" . $_SESSION["neptun"] . "' AND cr.course_id = '" . $courseid . "' AND a.requirement_type = cr.requirement_type";
        $progressresult = $mysqliconnect->query($progressSql);

        while ($progressobj = $progressresult->fetch_object()) {
            array_push($response->requirementprogress, $progressobj);
        }

        return $response;
    }
}
