window.onload = function () {
    LoadCourse();
};

$(function () {

    $('input[name="requirementtype_attendance_lecture"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="attendace_lecture_div"]').fadeIn();
        } else {
            $('div[id="attendace_lecture_div"]').hide();
        }
    });

    $('input[name="requirementtype_attendance_practice"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="attendance_practice_div"]').fadeIn();
        } else {
            $('div[id="attendance_practice_div"]').hide();
        }
    });

    $('input[name="requirementtype_first_zh"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="first_zh_div"]').fadeIn();
        } else {
            $('div[id="first_zh_div"]').hide();
        }
    });

    $('input[name="requirementtype_second_zh"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="second_zh_div"]').fadeIn();
        } else {
            $('div[id="second_zh_div"]').hide();
        }
    });


});

let originalrequirements = [];

let requirementtypes = [
    'ATTENDANCE_LECTURE',
    'ATTENDANCE_PRACTICE',
    'FIRST_ZH',
    'SECOND_ZH',
    'HOMEWORK'
];

function LoadCourse() {
    $('#courses-container').empty();
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../../Controller/CourseHandler.php',
        data: {
            functionId: 'loadcourse'

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
                    + '<div><i class="fas fa-users btn btn-primary" title= "Hallgatók" onclick="LoadCourseAttends(\'' + item.course_id + '\',\'' + item.course_name + '\')"/>&nbsp;'
                    + '<i class="fas fa-file-alt btn btn-outline-primary" title = "Dokumentumok" onclick="LoadDocuments(\'' + item.course_id + '\',\'' + item.course_name + '\')"/>&nbsp;'
                    + '<i class="fas fa-edit btn btn-outline-primary" title = "Kurzus módosítása" onclick="LoadCourseDetails(\'' + item.course_id + '\')"/>&nbsp;'
                    + '<i class="fas fa-trash btn btn-outline-danger" title = "Kurzus törlése" onclick="DeleteCourse(\'' + item.course_id + '\')"/></div>'
                    + '</div> </div >';




            });
            content += '</div>'
            $('#courses-container').append(content);

        }
    });

}


function LoadCourseDetails(courseid) {
    $('#succes-modify-div').empty();
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../../Controller/CourseHandler.php',
        data: {
            functionId: 'loadcoursedetails',
            courseid: courseid
        },
        success: function (data) {

            $('.form-data-item').each(function (i, item) {
                item.value = "";
            });
            $('.checkbox').each(function (i, item) {
                item.checked = false;
            });

            $('div[id="attendace_lecture_div"]').hide();
            $('div[id="attendance_practice_div"]').hide();
            $('div[id="first_zh_div"]').hide();
            $('div[id="second_zh_div"]').hide();


            document.getElementById('lecturecode').value = data.coursedetails.course_id;
            document.getElementById('lecturename').value = data.coursedetails.course_name;
            document.getElementById('lecturedescr').value = data.coursedetails.course_description;

            data.coursedetails.requirementlist.forEach(function (item, i) {
                originalrequirements.push(item.requirement_type);
                document.getElementById(item.requirement_type).getElementsByClassName('checkbox')[0].checked = true;
                if (item.requirement_type != 'HOMEWORK') {
                    document.getElementById(item.requirement_type).getElementsByClassName('max_requirement')[0].value = item.max_requirement;
                    document.getElementById(item.requirement_type).getElementsByClassName('min_requirement')[0].value = item.min_requirement;

                    $('div[id="' + item.requirement_type.toLowerCase() + '_div"]').show();

                }
            });

        }
    });
    $('#Coursedata').modal({ backdrop: 'static', keyboard: false })

}

function updateCourseDetails() {

    let courseid = document.getElementById('lecturecode').value;
    let coursename = document.getElementById('lecturename').value;
    let coursedesc = document.getElementById('lecturedescr').value;
    let reqlist = [];

    if (coursename == "" || coursedesc == "") {
        alert('A tárgyadatokat kötelező kitölteni!');
        return;
    }
    try {
        $('#requirement-formdata').each(function (i) {
            let requirements = [];
            let elements = $(this).find('input')

            if (elements.length > 0) {
                let serialized = $(this).find('input').serialize();

                requirements = detailsToDictionary(serialized);
            }
            let result = new Map(requirements.map(i => [i.key, i.value]));
            requirementtypes.forEach(function (item) {
                let requirementobject = {};
                let isnewitem = false;
                if (originalrequirements.indexOf(item) === -1 && result.get('requirementtype_' + item.toLowerCase()) == 'on') {
                    isnewitem = true;
                }
                if (result.get('requirementtype_' + item.toLowerCase())) {
                    requirementobject = {
                        requirementtype: item,
                        max_requirement: result.get('maxrequirement_' + item.toLowerCase()),
                        min_requirement: result.get('minrequirement_' + item.toLowerCase()),
                        todo: isnewitem ? 'insert' : 'update'

                    };
                } else {
                    requirementobject = {
                        requirementtype: item,
                        todo: 'delete'
                    };
                }

                if (!isValid(requirementobject)) throw BreakException;
                reqlist.push(requirementobject);
            });

        });
    } catch (e) {
        // try catch a ciklusból való kiugrásra, return helyett
        return;
    }
    let details = {
        courseid: courseid,
        coursename: coursename,
        coursedesc: coursedesc,
        detailslist: reqlist
    };

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../../Controller/CourseHandler.php',
        data: {
            functionId: 'modifycourse',
            coursedetails: details
        },
        success: function (data) {
            if (data.success == true) {

                $('#succes-modify-div').append('Sikeres módosítás!');
            } else {
                alert(data.msg);
            }

        }
    });

}

function detailsToDictionary(query) {
    let detailslist = [];
    let items = query.split("&");
    for (let i = 0; i < items.length; i++) {
        let detailssitem = {};
        let values = items[i].split("=");
        detailssitem.key = values[0];
        detailssitem.value = values[1];
        detailslist.push(detailssitem);
    }
    return detailslist;
}

function isValid(requirementobject) {
    if (requirementobject.requirementtype != 'HOMEWORK' && requirementobject.todo != 'delete') {
        if (isNaN(requirementobject.min_requirement) || isNaN(requirementobject.max_requirement) || requirementobject.min_requirement < 0 || requirementobject.max_requirement < 0) {
            alert('A követelmények csak 0-tól nagyobb számok lehetnek !');
            return false;
        }
        if (requirementobject.min_requirement == "" || requirementobject.max_requirement == "") {
            alert('Hiányzik a minimum vagy maximum érték itt: ' + dbnames[requirementobject.requirementtype]);
            return false;
        }
        if (requirementobject.max_requirement < requirementobject.min_requirement) {
            alert('A minimum óraszám/pontszám nagyobb mint az összes! (' + dbnames[requirementobject.requirementtype] + ')');
            return false;
        }
    }
    return true;
}

function DeleteCourse(courseid) {
    if (confirm("Biztosan törli a " + courseid + " kurzust?")) {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: '../../../Controller/CourseHandler.php',
            data: {
                functionId: 'deletecourse',
                courseid: courseid
            },
            success: function (data) {
                LoadCourse();

            }
        });

    }
}
