$(function () {

    $('div[id="showlecture"]').hide();
    $('div[id="showpractice"]').hide();
    $('div[id="showfirstzh"]').hide();
    $('div[id="showsecondzh"]').hide();


    $('input[name="lecturecheckbox"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="showlecture"]').fadeIn();
        } else {
            $('div[id="showlecture"]').hide();
        }
    });

    $('input[name="practicecheckbox"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="showpractice"]').fadeIn();
        } else {
            $('div[id="showpractice"]').hide();
        }
    });

    $('input[name="firstzhcheckbox"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="showfirstzh"]').fadeIn();
        } else {
            $('div[id="showfirstzh"]').hide();
        }
    });

    $('input[name="secondzhcheckbox"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="showsecondzh"]').fadeIn();
        } else {
            $('div[id="showsecondzh"]').hide();
        }
    });


});

function CreateCourse() {

    let formData = document.getElementsByClassName('form-data-item');
    let formDataObject = {};

    for (let i = 0; i < formData.length; i++) {
        if (formData[i].value != null && formData[i].value != "") {
            formDataObject[formData[i].name] = formData[i].value;
        }
        if (formData[i].checked) {
            formDataObject[formData[i].name] = true;
        }
    }

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'createcourse',
            data: formDataObject
        },
        success: function (data) {
            if (data == true) {
                $('#SuccesUpload').modal('show');
            }

        }
    });

}


