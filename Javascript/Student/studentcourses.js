window.onload = function () {
    LoadMyCourses();
};

let dbnames = {
    'ATTENDANCE_LECTURE': 'Előadás jelenlét',
    'ATTENDANCE_PRACTICE': 'Gyakorlat jelenlét',
    'FIRST_ZH': 'I. ZH pontszám',
    'SECOND_ZH': 'II. ZH pontszám',
    'HOMEWORK': 'Féléves feladat'
};

function LoadMyCourses() {
    $('#courses-container').empty();
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'loadstudentmycourse'

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
                    + '<div><i class="fas fa-tasks btn btn-primary" title= "Teljesítés" onclick="LoadCourseProgress(\'' + item.course_id + '\',\'' + item.course_name + '\')"/>&nbsp;'
                    + '<i class="far fa-envelope btn btn-outline-primary" title = "Üzenet az oktatónak" onclick="Message(\'' + item.course_id + '\',\'' + item.course_name + '\')"/>&nbsp;'
                    + '<i class="fas fa-file-alt btn btn-outline-primary" title = "Dokumentumok" onclick="LoadDocuments(\'' + item.course_id + '\',\'' + item.course_name + '\')"/>&nbsp;'
                if (item.isProgressed) {
                    content += '<i class="fas fa-trash btn btn-outline-secondary" title = "Kurzus csak a félév elején adható le"/></div>'
                }
                else {
                    content += '<i class="fas fa-trash btn btn-outline-danger" title = "Kurzus törlése" onclick="DeleteCourseAttend(\'' + item.course_id + '\')"/></div>'
                }
                content += '</div> </div >';




            });
            content += '</div>'
            $('#courses-container').append(content);

        }
    });

}

function LoadDocuments(courseid, course_name) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/FileHandler.php',
        data: {
            functionId: 'loaddocs',
            courseid: courseid
        },
        success: function (data) {
            let content = '';


            $('.doc-modal-header').empty();
            $('.doc-modal-body').empty();
            let header = '<div style="display:block;">A <span id = "doc-modal-course-name">' + course_name + '</span> (<span id ="mcourseid">' + courseid + '</span>) feltöltött dokumentumai</div>'
                + '<button type="button" class="close" " data-dismiss="modal">&times;</button >';
            if (data.filelist.length > 0) {

                data.filelist.forEach(function (item, i) {
                    content += '<div><i class="fas fa-book"></i>'
                        + '<a href = "../../uploads/' + courseid + '/' + item.file_name + '" download > ' + item.file_name + '</a></div>';

                });
            } else {
                content = "<span id = 'nodocs'>Ehhez a kurzushoz még nem töltöttek fel dokumentumot</span>";
            }
            $('.doc-modal-header').append(header);
            $('.doc-modal-body').append(content);

            $('#Documents').modal({ backdrop: 'static', keyboard: false })

        }
    });
}

function DeleteCourseAttend(courseid) {

    if (confirm("Biztosan leadod a " + courseid + " kurzust?")) {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: '../../Controller/CourseHandler.php',
            data: {
                functionId: 'deletecourseattend',
                courseid: courseid
            },
            success: function (data) {
                if (data.success) {
                    LoadMyCourses();
                } else {
                    alert('nem sikerült a tárgyleadás, próbáld újra később');
                }
            }
        });

    }

}

function LoadCourseProgress(courseid, course_name) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'showmyprogress',
            courseid: courseid
        },
        success: function (data) {
            let content = '';

            $('.prog-modal-header').empty();
            $('.prog-modal-body').empty();
            let header = '<div style="display:block;">A <span id = "prog-modal-course-name">' + course_name + '</span> (<span id ="mcourseid">' + courseid + '</span>) tárgy teljesítése</div>'
                + '<button type="button" class="close" " data-dismiss="modal">&times;</button >';

            data.requirementprogress.forEach(function (item, i) {
                let progressbartype = parseInt(item.progress) == parseInt(item.max_requirement) ? 'success' : parseInt(item.progress) >= parseInt(item.min_requirement) ? 'warning' : 'danger';
                let progresspercent = parseInt(item.progress) > 0 ? Math.round(parseInt(item.progress) / parseInt(item.max_requirement) * 100) : 0;
                content += '<label>' + dbnames[item.requirement_type] + '</label><div class="progress">'
                    + '<div class="progress-bar bg-' + progressbartype + '" role="progressbar" style="width: ' + progresspercent + '%" aria-valuenow="' + progresspercent + '" aria-valuemin="0" aria-valuemax="100">' + progresspercent + '%</div>'
                    + '</div>';

            });

            $('.prog-modal-header').append(header);
            $('.prog-modal-body').append(content);

            $('#Progress').modal({ backdrop: 'static', keyboard: false })

        }
    });

}