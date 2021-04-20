window.onload = function () {
    LoadCourse();
};


function LoadCourse() {

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'loadcourse'

        },
        success: function (data) {

            let content = "";
            console.log(data);
            data.courselist.forEach(function (item, i) {
                if (i == 0) {

                    content += '<div class="row">';
                }

                content += '<div class="card" style="width: 20rem;">'
                    + ' <div class="card-body">'
                    + '<h5 class="card-title">' + item.course_name + ' (' + item.course_id + ')</h5>'
                    + '<p class="card-text">' + item.course_description + '</p>'
                    + '<div><i class="fas fa-users btn btn-primary" title= "Hallgatók" onclick="LoadCourseAttends(' + item.course_id + ',\'' + item.course_name + '\')"/>&nbsp;'
                    + '<i class="fas fa-file-alt btn btn-outline-primary" title = "Dokumentumok" onclick="LoadDocuments(' + item.course_id + ',\'' + item.course_name + '\')"/>&nbsp;'
                    + '<i class="fas fa-edit btn btn-outline-primary" title = "Kurzus módosítása" onclick="LoadCourseDetails(' + item.course_id + ',\'' + item.course_name + '\')"/></div>'
                    + '</div> </div >';


                if (i != 0 && i % 3 == 0) {
                    content += '</div><div class="row">';
                }

            });

            content += '</div>';
            $('#courses-container').append(content);

        }
    });

}


function LoadCourseDetails(courseid, course_name) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'loadcoursedetails',
            courseid: courseid
        },
        success: function (data) {
            document.getElementById('lecturecode').value = data.coursedetails.course_id;
            document.getElementById('lecturename').value = data.coursedetails.course_name;
            document.getElementById('lecturedescr').value = data.coursedetails.course_description;

            data.coursedetails.requirementlist.forEach(function (item, i) {
                document.getElementById(item.requirement_type).getElementsByClassName('checkbox')[0].checked = true;
                if (item.requirement_type != 'HOMEWORK') {
                    document.getElementById(item.requirement_type).getElementsByClassName('max_requirement')[0].value = item.max_requirement;
                    document.getElementById(item.requirement_type).getElementsByClassName('min_requirement')[0].value = item.min_requirement;
                }
            });

        }
    });
    $('#Coursedata').modal({ backdrop: 'static', keyboard: false })

}

function updateCourseDetails() {

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

    console.log(formDataObject);

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'modifycourse',
            data: formDataObject
        },
        success: function (data) {
            if (data == true) {
                $('#SuccesUpload').modal('show');
            }

        }
    });

}