window.onload = function () {
    LoadAvailableCourses();
};

let dbnames = {
    'ATTENDANCE_LECTURE': 'Előadás jelenlét',
    'ATTENDANCE_PRACTICE': 'Gyakorlat jelenlét',
    'FIRST_ZH': 'I. ZH pontszám',
    'SECOND_ZH': 'II. ZH pontszám',
    'HOMEWORK': 'Féléves feladat'
};

function LoadAvailableCourses() {
    $('#courses-container').empty();
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'loadavailablecourses'

        },
        success: function (data) {

            let content = "";
            console.log(data);
            content += '<div class="card-columns">';
            data.courselist.forEach(function (item, i) {


                content += '<div class="card" >'
                    + ' <div class="card-body">'
                    + '<h5 class="card-title">' + item.course_name + ' (' + item.course_id + ')</h5>'
                    + '<p class="card-text">' + item.course_description + '</p>'
                    + '<div>';
                if (item.isRegistered) {
                    content += '<i class="fas fa-user-check btn btn-success" title = "Már jelentkeztél"></i>&nbsp;'
                }
                else {
                    content += '<i class="fas fa-user-plus btn btn-primary" title= "Jelentkezés" onclick="Register(\'' + item.course_id + '\')"/>&nbsp;'
                }
                content += '<i class="fas fa-info-circle btn btn-outline-primary" title = "Információ" onclick="ShowInfo(\'' + item.course_id + '\',\'' + item.course_name + '\')"/></div>'
                    + '</div> </div >';


            });
            content += '</div>'
            $('#courses-container').append(content);

        }
    });

}

function ShowInfo(courseid, course_name) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'showcourseinfo',
            courseid: courseid
        },
        success: function (data) {

            let content = '';
            $('.courseinfo-modal-header').empty();
            $('.courseinfo-modal-body').empty();
            let header = '<div style="display:block;">A <span id = "courseinfo-modal-course-name">' + course_name + '</span> (<span id ="mcourseid">' + courseid + '</span>) követelményei</div>'
                + '<button type="button" class="close" data-dismiss="modal">&times;</button >';
            content += '<table  class="table table-responsive ">'
                + '<thead><tr>'
                + '<th style="min-width: 33%;">Követelmények</th>'
                + '<th style="min-width: 33%;">Összes óra/pontszám</th>'
                + '<th style="min-width: 33%;">Minimum teljesítendő óra/pontszám</th>'
                + '</thead></tr><tbody>'


            if (data.infolist.length > 0) {

                data.infolist.forEach(function (item, i) {
                    content += '<tr><td>' + dbnames[item.requirement_type] + '</td><td>' + item.max_requirement + '</td><td>' + item.min_requirement + '</td></tr>';
                });
            }
            content += '</tbody></table>';
            $('.courseinfo-modal-header').append(header);
            $('.courseinfo-modal-body').append(content);
            $('#courseinfo').modal({ backdrop: 'static', keyboard: false })

        }
    });
}

function Register(courseid) {
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'registerstudent',
            courseid: courseid
        },
        success: function (data) {
            LoadAvailableCourses();
        }
    });
}