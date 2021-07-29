function LoginAdmin() {
    let adminid = document.getElementById("adminid").value;
    let admindpswd = document.getElementById("admindpswd").value;

    if (adminid == '' || admindpswd == '') {
        alert('Töltse ki a mezőket!')
    } else {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'Controller/AdminHandler.php',
            data: {
                functionId: 'login',
                adminid: adminid,
                admindpswd: admindpswd
            },
            success: function (data) {
                if (data == true) {
                    window.location.href = "View/Admin/Home.html"
                }
            }
        });

    }

}
