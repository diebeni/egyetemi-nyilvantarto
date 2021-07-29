<?php

require_once '../Model/Message.php';

if ($_POST['functionId'] == 'loadcontacts') {
    LoadContacts();
}
if ($_POST['functionId'] == 'loadmessage') {
    LoadMessage($_POST['messageid']);
}
if ($_POST['functionId'] == 'sendmessage') {
    SendMessage($_POST['messageid'], $_POST['messagetext'], $_POST['contactid']);
}
if ($_POST['functionId'] == 'searchcontact') {
    SearchContact($_POST['search']);
}
if ($_POST['functionId'] == 'checkcontact') {
    CheckContact($_POST['neptuncode']);
}
if ($_POST['functionId'] == 'checknewmessage') {
    CheckNewMessage();
}
if ($_POST['functionId'] == 'updatemessagestatus') {
    UpdateIsSeenStatus($_POST['messageid']);
}
if ($_POST['functionId'] == 'getnewmessages') {
    GetNewMessages($_POST['messageid']);
}


function LoadContacts()
{
    $message = new Message();
    echo json_encode($message->LoadContactsData());
}

function LoadMessage($messageid)
{
    $message = new Message();
    echo json_encode($message->LoadMessageData($messageid));
}

function SendMessage($messageid, $messagetext, $contactid)
{
    $message = new Message();
    echo json_encode($message->InsertMessageData($messageid, $messagetext, $contactid));
}

function SearchContact($searchvalue)
{
    $message = new Message();
    echo json_encode($message->SearchContactData($searchvalue));
}

function CheckContact($neptuncode)
{
    $message = new Message();
    echo json_encode($message->CheckContactData($neptuncode));
}

function CheckNewMessage()
{
    $message = new Message();
    echo json_encode($message->CheckNewMessageData());
}

function UpdateIsSeenStatus($messageid)
{
    $message = new Message();
    $message->UpdateIsSeenStatusData($messageid);
}

function GetNewMessages($messageid)
{
    $message = new Message();
    echo json_encode($message->GetNewMessagesData($messageid));
}
