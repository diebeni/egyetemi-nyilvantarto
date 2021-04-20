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
                + '<button type="button" class="close" onclick="$(\'#fileid\').val(\'\');" data-dismiss="modal">&times;</button >';
            if (data.filelist.length > 0) {

                data.filelist.forEach(function (item, i) {
                    content += '<div><button class="btn" type="button" title="Törlés" onclick="deleteFile(\'' + courseid + '\', \'' + item.file_name + '\')"><i class="fas fa-trash-alt"></i></button>'
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

function uploadFile() {
    let file_data = $('#fileid').prop('files')[0];
    $('#fileid').val('');
    let form_data = new FormData();
    let courseid = document.getElementById('mcourseid').innerHTML;
    form_data.append('file', file_data);
    form_data.append('courseid', courseid);

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/FileHandler.php',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        success: function (data) {
            let content = '';
            if (document.getElementById('nodocs')) {
                $('.doc-modal-body').empty();
            }
            content += '<div><button class="btn" type="button" title="Törlés" onclick="deleteFile(\'' + courseid + '\', \'' + data.file_name + '\')">'
                + '< i class="fas fa-trash-alt" ></i ></button > '
                + '<a href = "../../uploads/' + courseid + '/' + data.file_name + '" download> ' + data.file_name + '</a></div> ';
            $('.doc-modal-body').append(content);
        }
    });
};

function deleteFile(courseid, filename) {
    if (confirm("Biztosan törli a " + filename + " fájlt?")) {
        let coursename = document.getElementById('doc-modal-course-name').innerHTML;

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: '../../Controller/FileHandler.php',
            data: {
                functionId: 'deletefile',
                courseid: courseid,
                filename: filename
            },
            success: function (data) {
                LoadDocuments(courseid, coursename);
            }
        });

    }

}