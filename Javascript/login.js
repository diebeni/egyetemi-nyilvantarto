function LoginStudent() {
    let neptun = document.getElementById("sneptun").value;
    let pswd = document.getElementById("spswd").value;

    if (neptun == '' || pswd == '') {
        alert('A neptun kód és jelszó mező kitöltése kötelező!')
    } else {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'Controller/LoginHandler.php',
            data: {
                functionId: 'studentlogin',
                neptun: neptun,
                pswd: pswd
            },
            success: function (data) {
                if (data == true) {
                    window.location.href = "View/Student/Home.html"
                } else {
                    $('#LoginFailedDb').modal('show');
                }

            }
        });

    }

}

function LoginProfessor() {
    let neptun = document.getElementById("pneptun").value;
    let pswd = document.getElementById("ppswd").value;

    if (neptun == '' || pswd == '') {
        $('#LoginFailed').modal('show');
    } else {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'Controller/LoginHandler.php',
            data: {
                functionId: 'professorlogin',
                neptun: neptun,
                pswd: pswd
            },
            success: function (data) {
                if (data == true) {
                    window.location.href = "View/Professor/Home.html"
                } else {
                    $('#LoginFailedDb').modal('show');
                }
            }
        });

    }

}