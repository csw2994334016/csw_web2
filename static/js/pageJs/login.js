$(function () {
    $("#loginBnt").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        password = md5(password);
        var ajax = new $ax('/auth/login', function (data) {
            console.log(data);
            if (data.code === "0000") {
                window.location.href = "pages/main.html";
            } else if (data.code === "0002") {
                CSW.error("登录失败：" + data.msg);
            }
        }, function (data) {
            CSW.error(CSW.requestFail + data.msg);
        });
        ajax.set("username", username).set("password", password);
        ajax.type = "POST";
        ajax.start();
    });
});

if (window != top) top.location.href = location.href;