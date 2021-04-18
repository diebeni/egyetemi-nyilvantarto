window.onload = function () {
    LoadCourse();
};

let dbnames = {
    'ATTENDANCE_LECTURE': 'Előadás jelenlét',
    'ATTENDANCE_PRACTICE': 'Gyakorlat jelenlét',
    'FIRSTZH': 'I. ZH pontszám',
    'SECONDZH': 'II. ZH pontszám',
    'HOMEWORK': 'Féléves feladat'
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
                    + '<input type="button" value="Módosítás" class="btn btn-primary" onclick="LoadCourseData(' + item.course_id + ',\'' + item.course_name + '\')"/>'
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



function updateAttends() {

    let studentlist = [];
    $('table tbody').find('tr').each(function (i) {
        let studprogress = [];
        let studentobj = {};
        studentobj.neptun_code = document.getElementById('stdn_' + i).innerHTML;
        let elements = $(this).find('input')

        if (elements.length > 0) {
            let serialized = $(this).find('input').serialize();
            //a serialize nem dolgozza fel a false checkboxot ezér ez van :
            if (!serialized.includes('HOMEWORK')) {
                serialized += '&HOMEWORK=0';
            }
            studprogress = toDictionary(serialized);
        }
        studentobj.studprogress = studprogress;
        studentlist.push(studentobj);
    });

    let courseid = document.getElementById('mcourseid').innerHTML;
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'updatecourseattends',
            courseid: courseid,
            updatelist: studentlist
        },
        success: function (data) {
            console.log(data);
        }
    });


}
function toDictionary(query) {
    let progresslist = [];
    let items = query.split("&"); // split
    for (let i = 0; i < items.length; i++) {
        let progressitem = {};
        let values = items[i].split("=");
        progressitem.requirement_type = values[0];
        progressitem.progress = values[1];
        progresslist.push(progressitem);
    }
    return progresslist;
}

function setCheckboxValue(checkboxId) {
    let checkbox = document.getElementById(checkboxId);
    if (checkbox.value == 1) {
        checkbox.value = 0;
    } else {
        checkbox.value = 1;
    }
}


