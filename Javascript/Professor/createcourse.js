$(function () {

    $('div[id="showlecture"]').hide();
    $('div[id="showpractice"]').hide();
    $('div[id="showfirstzh"]').hide();
    $('div[id="showsecondzh"]').hide();


    $('input[name="requirementtype_attendance_lecture"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="showlecture"]').fadeIn();
        } else {
            $('div[id="showlecture"]').hide();
        }
    });

    $('input[name="requirementtype_attendance_practice"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="showpractice"]').fadeIn();
        } else {
            $('div[id="showpractice"]').hide();
        }
    });

    $('input[name="requirementtype_first_zh"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="showfirstzh"]').fadeIn();
        } else {
            $('div[id="showfirstzh"]').hide();
        }
    });

    $('input[name="requirementtype_second_zh"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('div[id="showsecondzh"]').fadeIn();
        } else {
            $('div[id="showsecondzh"]').hide();
        }
    });


});

let requirementtypes = [
    'ATTENDANCE_LECTURE',
    'ATTENDANCE_PRACTICE',
    'FIRST_ZH',
    'SECOND_ZH',
    'HOMEWORK'
];

let dbnames = {
    'ATTENDANCE_LECTURE': 'Előadás jelenlét',
    'ATTENDANCE_PRACTICE': 'Gyakorlat jelenlét',
    'FIRST_ZH': 'I. ZH pontszám',
    'SECOND_ZH': 'II. ZH pontszám',
    'HOMEWORK': 'Féléves feladat'
};

function CreateCourse() {

    let courseid = document.getElementById('lecturecode').value;
    let coursename = document.getElementById('lecturename').value;
    let coursedesc = document.getElementById('lecturedescr').value;

    if (courseid == "" || coursename == "" || coursedesc == "") {
        alert('A tárgyadatokat kötelező kitölteni!');
        return;
    }

    let reqlist = [];

    try {
        $('#course-formdata').each(function (i) {
            let requirements = [];
            let elements = $(this).find('input')

            if (elements.length > 0) {
                let serialized = $(this).find('input').serialize();

                requirements = courseToDictionary(serialized);
            }
            let result = new Map(requirements.map(i => [i.key, i.value]));
            requirementtypes.forEach(function (item) {
                let requirementobject = {};
                if (result.get('requirementtype_' + item.toLowerCase())) {
                    requirementobject = {
                        requirementtype: item,
                        max_requirement: result.get('maxrequirement_' + item.toLowerCase()),
                        min_requirement: result.get('minrequirement_' + item.toLowerCase())
                    };
                    if (!isValid(requirementobject)) throw BreakException;
                    reqlist.push(requirementobject);
                }
            });

        });
    } catch (e) {
        // try catch a ciklusból való kiugrásra, return helyett
        return;
    }
    let course = {
        courseid: courseid,
        coursename: coursename,
        coursedesc: coursedesc,
        courselist: reqlist
    };

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/CourseHandler.php',
        data: {
            functionId: 'createcourse',
            data: course
        },
        success: function (data) {
            if (data.success == true) {
                $('#SuccesUpload').modal('show');
            } else {
                alert(data.msg);
            }

        }
    });

}


function courseToDictionary(query) {
    let courselist = [];
    let items = query.split("&");
    for (let i = 0; i < items.length; i++) {
        let courseitem = {};
        let values = items[i].split("=");
        courseitem.key = values[0];
        courseitem.value = values[1];
        courselist.push(courseitem);

    }
    return courselist;
}


function isValid(requirementobject) {
    if (requirementobject.requirementtype != 'HOMEWORK') {
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