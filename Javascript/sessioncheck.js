
window.onclick = function () {
    sessioncheck();
};

function sessioncheck() {
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: '../../Controller/SessionCheck.php',
        data: {

        },
        success: function (data) {
            if (data == false) {
                window.location.href = "../../index.html"
            }

        }
    });
}