<?php

require_once '../Database/DbConnect.php';

class Message extends DbConnect
{

    public function LoadContactsData()
    {
        session_start();
        $mysqliconnect = $this->connect();
        $neptuncode = $_SESSION["neptun"];
        $sql = "SELECT 	message_id,	contactid, name, date from
            (SELECT	message_id,	if(message_from = '" . $neptuncode . "', message_to, message_from) as contactid, max(sending_date) as date
            from message where 	message_from = '" . $neptuncode . "' or message_to = '" . $neptuncode . "' group by	message_id) as a
        inner join
            (SELECT	neptun_code , name from	student	union select neptun_code , name from professor) as b 
            on b.neptun_code = a.contactid order by	date desc";
        $result = $mysqliconnect->query($sql);

        $data = (object) [
            'contactlist' => array()
        ];

        while ($contactobj = $result->fetch_object()) {

            array_push($data->contactlist, $contactobj);
        }
        return $data;
    }

    public function LoadMessageData($messageid)
    {
        session_start();
        $mysqliconnect = $this->connect();
        $clearmessageid = mysqli_real_escape_string($mysqliconnect, $messageid);
        $sql = "SELECT 	* from message where message_id = '" . $clearmessageid . "' order by sending_date";
        $result = $mysqliconnect->query($sql);

        $data = (object) [
            'messagelist' => array(),
            'neptuncode' => new stdClass()
        ];
        $data->neptuncode = $_SESSION["neptun"];
        while ($messageobj = $result->fetch_object()) {

            array_push($data->messagelist, $messageobj);
        }

        return $data;
    }

    public function InsertMessageData($messageid, $messagetext, $contactid)
    {
        session_start();
        $mysqliconnect = $this->connect();
        $clearmessageid = $messageid == "null" ? 'select max(message_id)+1' : mysqli_real_escape_string($mysqliconnect, $messageid);
        $clearmessagetext = mysqli_real_escape_string($mysqliconnect, $messagetext);
        $clearcontactid = mysqli_real_escape_string($mysqliconnect, $contactid);
        if ($messageid == "null") {
            $sql = "INSERT INTO MESSAGE (MESSAGE_ID, MESSAGE_FROM, MESSAGE_TO, MESSAGE_CONTENT, SENDING_DATE)  (" .  $clearmessageid . ",'" . $_SESSION["neptun"] . "','" . $clearcontactid . "','" . $clearmessagetext . "',CURRENT_TIMESTAMP() from message);";
        } else {
            $sql = "INSERT INTO MESSAGE (MESSAGE_ID, MESSAGE_FROM, MESSAGE_TO, MESSAGE_CONTENT, SENDING_DATE) VALUES (" .  $clearmessageid . ",'" . $_SESSION["neptun"] . "','" . $clearcontactid . "','" . $clearmessagetext . "',CURRENT_TIMESTAMP());";
        }
        $mysqliconnect->query($sql);

        return true;
    }

    public function SearchContactData($searchvalue)
    {
        session_start();
        $mysqliconnect = $this->connect();
        $clearsearchinput = mysqli_real_escape_string($mysqliconnect, $searchvalue);

        $sql = "SELECT a.name, a.neptun_code from (SELECT neptun_code , name from	student	union select neptun_code , name from professor) as a
        where a.name like '%" . $clearsearchinput . "%' or a.neptun_code like '%" . $clearsearchinput . "%' LIMIT 10";
        $result = $mysqliconnect->query($sql);

        $data = (object) [
            'contactlist' => array()
        ];
        while ($contactsobj = $result->fetch_object()) {

            array_push($data->contactlist, $contactsobj);
        }

        return $data;
    }

    public function CheckContactData($neptuncode)
    {
        session_start();
        $mysqliconnect = $this->connect();
        $clearcheckinput = mysqli_real_escape_string($mysqliconnect, $neptuncode);

        $sql = "SELECT distinct message_id from message where (message_from = '" . $clearcheckinput . "' and message_to = '" . $_SESSION["neptun"] . "') or (message_from = '" .  $_SESSION["neptun"] . "' and message_to = '" . $clearcheckinput . "')";
        $result = $mysqliconnect->query($sql);

        return $result->fetch_object();;
    }
}
