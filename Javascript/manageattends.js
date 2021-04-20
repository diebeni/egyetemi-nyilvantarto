let dbnames = {
    'ATTENDANCE_LECTURE': 'Előadás jelenlét',
    'ATTENDANCE_PRACTICE': 'Gyakorlat jelenlét',
    'FIRSTZH': 'I. ZH pontszám',
    'SECONDZH': 'II. ZH pontszám',
    'HOMEWORK': 'Féléves feladat'
};

function LoadCourseAttends(courseid, course_name) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'loadcourseattends',
            courseid: courseid
        },
        success: function (data) {
            let content = "";
            $('.stud-modal-header').empty();
            $('.stud-modal-body').empty();
            if (data.studentlist.length > 0) {
                let header = '<div style="display:block;">A ' + course_name + ' (<span id ="mcourseid">' + courseid + '</span>) hallgatói</div>'
                    + '<button  type="button" class="close" data-dismiss="modal">&times;</button >';
                content += '<table id="classTable" class="table  table-striped table-responsive ">'
                    + '<thead><tr>'
                    + '<th style="min-width: 25%;">Neptun kód</th>'
                    + '<th style="min-width: 25%;">Név</th>';
                data.studentlist[0].requirementprogress.forEach(function (progressitem, i) {
                    content += '<th>' + dbnames[progressitem.requirement_type] + '</th>';
                });
                content += '</tr></thead>'
                    + '<tbody>';
                data.studentlist.forEach(function (item, i) {

                    content += '<tr>'
                        + '<td id = "stdn_' + i + '">' + item.neptun_code + '</td>'
                        + '<td>' + item.name + '</td>';
                    item.requirementprogress.forEach(function (progressitem) {
                        if (progressitem.requirement_type == 'HOMEWORK') {
                            if (progressitem.progress == 1) {
                                content += '<td><input id="homework_' + i + '" onchange="setCheckboxValue(\'homework_' + i + '\')" type="checkbox" name="' + progressitem.requirement_type + '" value = "1" checked/></td>';
                            } else {
                                content += '<td><input id="homework_' + i + '" onchange="setCheckboxValue(\'homework_' + i + '\')" type="checkbox" name="' + progressitem.requirement_type + '" value = "0" /></td>';
                            }

                        } else {
                            content += '<td><input style="max-width: 35px;" name="' + progressitem.requirement_type + '" value= "' + progressitem.progress + '"/></td>';
                        }
                    });
                    + ' </tr>';

                });
                content += ' </tbody>'
                    + '</table>';

                $('.stud-modal-header').append(header);

                document.getElementById('upd').style.display = 'block';
            } else {
                content = "Ezen a kurzuson jelenleg nincs hallagtó";
                document.getElementById('upd').style.display = 'none';
            }
            $('.stud-modal-body').append(content);
            $('#StudentList').modal({ backdrop: 'static', keyboard: false })

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