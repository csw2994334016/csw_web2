/**
 * Created by csw on 2018/3/22.
 */

$(function () {

    var pdModal = new BSModal('');
    pdModal.setModal("pdModal", "changePdForm");
    pdModal = pdModal.init();

    var skinModal = new BSModal('');
    skinModal.setModal("skinModal", "changeSkinForm");
    skinModal = skinModal.init();

    $(".changePd").click(function () {
        pdModal.open("修改密码");
    });
    pdModal.mdInstance.on('show.bs.modal', function(){
        var $this = $(this);
        var $modal_dialog = $this.find('.modal-dialog');
        // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
        $this.css('display', 'block');
        $modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2) });
    });


    $(".changeSkin").click(function () {
        skinModal.open("设置皮肤");
    });
    skinModal.mdInstance.on('show.bs.modal', function(){
        var $this = $(this);
        var $modal_dialog = $this.find('.modal-dialog');
        // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
        $this.css('display', 'block');
        $modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2) });
    });

    // 默认主题
    $('.default-skin').click(function () {
        $("body").removeClass("skin-green");
        $("body").removeClass("skin-red");
        $("body").removeClass("skin-yellow");
        return false;
    });

    // 绿色主题
    $('.green-skin').click(function () {
        $("body").removeClass("skin-blue");
        $("body").removeClass("skin-red");
        $("body").addClass("skin-yellow");
        return false;
    });

    // 红色主题
    $('.red-skin').click(function () {
        $("body").removeClass("skin-blue");
        $("body").removeClass("skin-green");
        $("body").addClass("skin-yellow");
        return false;
    });

    // 黄色主题
    $('.yellow-skin').click(function () {
        $("body").removeClass("skin-blue");
        $("body").removeClass("skin-green");
        $("body").addClass("skin-red");
        return false;
    });

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
    })

});