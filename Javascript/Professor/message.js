window.onload = function () {
    LoadContacts();
};

function LoadContacts() {
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/MessageHandler.php',
        data: {
            functionId: 'loadcontacts'
        },
        success: function (data) {
            let content = '';
            let isFirstItem = true;
            let messageid = '';
            let contactname = '';
            let contactid = '';
            data.contactlist.forEach(function (item, i) {
                content += '<li id = "message_' + item.message_id + '" ' + (isFirstItem ? ' class="active_message" ' : '') + '>'
                    + '<div onclick="loadMessage(\'' + item.message_id + '\', \'' + item.name + '\', \'' + item.contactid + '\')" class="d-flex bd-highlight">'
                    + '<div class="img_cont"><img src="../../CSS/images/chatuser.png" class="rounded-circle user_img"></div>'
                    + '<div class="user_info">'
                    + '<span>' + item.name + ' (' + item.contactid + ')</span>'
                    + '<p>' + item.date.slice(0, -3) + '</p>'
                    + '</div>'
                    + '</div>'
                    + '</li>';
                if (isFirstItem) {
                    messageid = item.message_id;
                    contactname = item.name;
                    contactid = item.contactid;
                }
                isFirstItem = false;
            });
            $('.contacts').append(content);
            loadMessage(messageid, contactname, contactid);
        }
    });
}

function loadMessage(messageid, contactname, contactid) {
    if (messageid != null) {
        document.getElementsByClassName("active_message")[0].classList.remove("active_message");
        document.getElementById("message_" + messageid).classList.add("active_message");
        document.getElementById('message-content').value = "";
    }
    $(".display").empty();
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/MessageHandler.php',
        data: {
            functionId: 'loadmessage',
            messageid: messageid
        },
        success: function (data) {
            $('.chat_message_container').empty();
            $('.chat_box_user').empty();
            let content = '';
            $('.chat_box_user').append('<span>' + contactname + ' (<span id="message-contact-id">' + contactid + '</span>)</span><span hidden id="message-id">' + messageid + '</span>');

            data.messagelist.forEach(function (item, i) {
                if (data.neptuncode == item.message_from) {
                    content += '<div class="d-flex justify-content-end mb-4">'
                        + '<div class="msg_cotainer_send">'
                        + item.message_content
                        + '<span class="msg_time_send">' + item.sending_date.slice(0, -3) + '</span>'
                        + '</div>'
                        + '</div>';
                } else {
                    content += '<div class="d-flex justify-content-start mb-4">'
                        + '<div class="msg_cotainer">'
                        + item.message_content
                        + '<span class="msg_time">' + item.sending_date.slice(0, -3) + '</span>'
                        + '</div>'
                        + '</div>';
                }
            });

            $('.chat_message_container').append(content);
            $('.chat_message_container')[0].scrollTop = $('.chat_message_container')[0].scrollHeight;
            console.log(data);
        }
    });
}

function sendMessage() {
    let messagetext = document.getElementById('message-content').value;
    let contactid = document.getElementById('message-contact-id').innerHTML;
    let messageid = document.getElementById('message-id').innerHTML;


    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/MessageHandler.php',
        data: {
            functionId: 'sendmessage',
            messagetext: messagetext,
            contactid: contactid,
            messageid: messageid
        },
        success: function (data) {
            let senttime = new Date().toLocaleString('sv-SE').slice(0, -3);
            if (data) {
                document.getElementById('message-content').value = "";
                let content = '<div class="d-flex justify-content-end mb-4">'
                    + '<div class="msg_cotainer_send">'
                    + messagetext
                    + '<span class="msg_time_send">' + senttime + '</span>'
                    + '</div>'
                    + '</div>';

                $('.chat_message_container').append(content);
                $('.chat_message_container')[0].scrollTop = $('.chat_message_container')[0].scrollHeight;
            }
            console.log(data);
        }
    });
}

function checkContacts(neptuncode, contactname) {
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/MessageHandler.php',
        data: {
            functionId: 'checkcontact',
            neptuncode: neptuncode
        },
        success: function (data) {
            loadMessage(data.message_id, neptuncode, contactname);
        }
    });
}

$(document).ready(function () {

    $("#search").keyup(function () {

        let searchvalue = $('#search').val();
        if (searchvalue.length < 3) {
            $(".display").empty();
        }
        else if (searchvalue.length >= 3) {
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: '../../Controller/MessageHandler.php',
                data: {
                    functionId: 'searchcontact',
                    search: searchvalue
                },
                success: function (data) {
                    $(".display").empty();
                    let content = '';
                    data.contactlist.forEach(function (item, i) {
                        content += '<div class="searchcontacts" onclick="checkContacts(\'' + item.neptun_code + '\', \'' + item.name + '\')"><span>' + item.name + ' (' + item.neptun_code + ')</span></div>';
                    });
                    $(".display").append(content);

                }
            });
        }
    });
});