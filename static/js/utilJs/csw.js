/**
 * Created by csw on 2016/7/23 10:37.
 * Explain:
 */
var CSW = {
    // apiAddress : 'http://192.168.1.10:8080',
    apiAddress: 'http://localhost:8080',
    // apiAddress: 'http://10.188.60.10:8080',
    // apiAddress: 'http://47.98.251.95:8080',
    selectTip: "请选择记录！ ",
    selectOneTip: "只能选中一条记录！ ",
    getOk: "获取数据成功！ ",
    getFail: "获取数据失败！ ",
    saveOk: "保存数据成功！ ",
    saveFail: "保存数据失败！ ",
    deleteOk: "删除数据成功！ ",
    deleteFail: "删除数据失败！ ",
    unknowCode: "接口返回未知code! ",
    requestFail: "接口请求失败! ",
    confirmInfo: "确认操作已选记录吗？ ",
    batchConfirmInfo: "请注意是批量删除！",
    logoutOk: "安全退出成功！",
    logoutFail: "安全退出失败！",

    getUrl: function (url) {
        if (url.indexOf('http') >= 0) {
            return url;
        } else {
            return this.apiAddress + url;
        }
    },
    confirm: function (tip, callback) {//询问框
        bootbox.setLocale("zh_CN");
        bootbox.confirm({
            size: 'small',
            title: '确认',
            message: tip,
            buttons: {
                cancel: {label: '取消', className: 'btn-danger'},
                confirm: {label: '确定', className: 'btn-success'}
            },
            callback: callback
        });
    },
    log: function (info) {
        console.log(info);
    },
    alert: function (type, info) {
        var title = "success" === type ? "成功" : "info" === type ? "提示" : "失败";
        var className = "success" === type ? "btn-success" : "info" === type ? "btn-info" : "btn-danger";
        var alert = bootbox.alert({
            size: 'small',
            title: title,
            message: info,
            backdrop: false,
            buttons: {
                ok: {label: '确认', className: className}
            }
        });
        if ("error" !== type) {
            alert.delay(1000).hide(0);
        }
    },
    info: function (info) {
        CSW.alert("info", typeof info === "undefined" ? " " : info);
    },
    success: function (info) {
        CSW.alert("success", typeof info === "undefined" ? " " : info);
    },
    error: function (info) {
        CSW.alert("error", typeof info === "undefined" ? " " : info);
    },

    validatePositiveFloatNum: function (value) { //不可以为0
        var r = "^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$";
        var reg = new RegExp(r);
        return reg.test(value);
    },
    validateFloatNum: function (value) { //浮点数，可以为0
        var r = "^\\d+(\\.\\d+)?$";
        var reg = new RegExp(r);
        return reg.test(value);
    },
    validatePositiveIntNum: function (value) { //正整数
        var r = "^[0-9]*[1-9][0-9]*$";
        var reg = new RegExp(r);
        return reg.test(value);
    }


    // infoDetail: function (title, info) {
    //     var display = "";
    //     if (typeof info == "string") {
    //         display = info;
    //     } else {
    //         if (info instanceof Array) {
    //             for (var x in info) {
    //                 display = display + info[x] + "<br/>";
    //             }
    //         } else {
    //             display = info;
    //         }
    //     }
    //     parent.layer.open({
    //         title: title,
    //         type: 1,
    //         skin: 'layui-layer-rim', //加上边框
    //         area: ['950px', '600px'], //宽高
    //         content: '<div style="padding: 20px;">' + display + '</div>'
    //     });
    // },
    // writeObj: function (obj) {
    //     var description = "";
    //     for (var i in obj) {
    //         var property = obj[i];
    //         description += i + " = " + property + ",";
    //     }
    //     layer.alert(description, {
    //         skin: 'layui-layer-molv',
    //         closeBtn: 0
    //     });
    // },
    // showInputTree: function (inputId, inputTreeContentId, leftOffset, rightOffset) {
    //     var onBodyDown = function (event) {
    //         if (!(event.target.id == "menuBtn" || event.target.id == inputTreeContentId || $(event.target).parents("#" + inputTreeContentId).length > 0)) {
    //             $("#" + inputTreeContentId).fadeOut("fast");
    //             $("body").unbind("mousedown", onBodyDown);// mousedown当鼠标按下就可以触发，不用弹起
    //         }
    //     };
    //
    //     if(leftOffset == undefined && rightOffset == undefined){
    //         var inputDiv = $("#" + inputId);
    //         var inputDivOffset = $("#" + inputId).offset();
    //         $("#" + inputTreeContentId).css({
    //             left: inputDivOffset.left + "px",
    //             top: inputDivOffset.top + inputDiv.outerHeight() + "px"
    //         }).slideDown("fast");
    //     }else{
    //         $("#" + inputTreeContentId).css({
    //             left: leftOffset + "px",
    //             top: rightOffset + "px"
    //         }).slideDown("fast");
    //     }
    //
    //     $("body").bind("mousedown", onBodyDown);
    // },
    // changeAjax: function (url) {
    //     return CSW.baseAjax(url, "修改");
    // },
    // zTreeCheckedNodes: function (zTreeId) {
    //     var zTree = $.fn.zTree.getZTreeObj(zTreeId);
    //     var nodes = zTree.getCheckedNodes();
    //     var ids = "";
    //     for (var i = 0, l = nodes.length; i < l; i++) {
    //         ids += "," + nodes[i].id;
    //     }
    //     return ids.substring(1);
    // },
    // eventParseObject: function (event) {//获取点击事件的源对象
    //     event = event ? event : window.event;
    //     var obj = event.srcElement ? event.srcElement : event.target;
    //     return $(obj);
    // }
};
