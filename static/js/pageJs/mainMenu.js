/**
 * Created by csw on 2018/3/22.
 */
var currentUser = {};
$(function () {
    //进入主页面，查找当前用户，检查是否登录
    var ajax = new $ax("/api/sys/users/currentUser", function (data) {
        if (data.code === "0000") {
            currentUser = data.data;
            // console.log(currentUser);
            $('.username').text(currentUser.username);
            $('.whCodes').text(currentUser.whCodes);
        } else if (data.code === "0002") {
            CSW.error(CSW.getFail + data.msg);
        } else {
            CSW.error(CSW.unknowCode + data.code);
        }
    }, function (data) {
        CSW.error(CSW.requestFail + data.msg);
    });
    ajax.start();

    //修改密码
    var pdModal = new BSModal('');
    pdModal.setModal("pdModal", "changePdForm");
    pdModal = pdModal.init();
    $(".changePd").click(function () {
        $('#username').val(currentUser.username);
        pdModal.open("修改密码");
    });
    pdModal.mdInstance.on('show.bs.modal', function () {
        var $this = $(this);
        var $modal_dialog = $this.find('.modal-dialog');
        // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
        $this.css('display', 'block');
        $modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2)});
    });
    $('#changePdBnt').click(function () {
        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var suePassword = $('#suePassword').val();
        if (oldPassword === '') {
            CSW.error("旧密码不可以为空")
        } else if (newPassword === '') {
            CSW.error("新密码不可以为空")
        } else if (suePassword === '') {
            CSW.error("确认密码不可以为空")
        } else {
            oldPassword = md5(oldPassword);
            newPassword = md5(newPassword);
            suePassword = md5(suePassword);
            if (newPassword !== suePassword) {
                CSW.error("新密码与确认密码不一致，请重新输入！")
            } else {
                var ajax = new $ax("/api/sys/users/password", function (data) {
                    if (data.code === "0000") {
                        CSW.success(CSW.saveOk);
                        pdModal.close();
                    } else if (data.code === "0002") {
                        CSW.error(CSW.saveFail + data.msg);
                    } else {
                        CSW.error(CSW.unknowCode + data.code);
                    }
                }, function (data) {
                    CSW.error(CSW.requestFail + data.msg);
                });
                ajax.set('oldPassword', oldPassword).set('newPassword', newPassword).set('suePassword', suePassword);
                ajax.type = "POST";
                ajax.start();
            }
        }
    });

    //退出登陆
    $(".safeLogout").click(function () {
        var ajax = new $ax("/auth/logout", function (data) {
            if (data.code === "0000") {
                window.location.href = "/index.html";
            } else if (data.code === "0002") {
                CSW.error(CSW.logoutFail + data.msg);
            } else {
                CSW.error(CSW.unknowCode + data.code);
            }
        }, function (data) {
            CSW.error(CSW.requestFail + data.msg);
        });
        ajax.start();
    });

});