//执行方法
$(function () {
    var roleApiUrl = '/api/sys/roles';

    //初始化添加模态框方法
    var fields = ['id', 'username', 'realName', 'sex', 'tel', 'email', 'roleId', 'remark'];
    var bsModal = new BSModal(Table.api);
    bsModal.setFields(fields);
    bsModal.setModal('myModal', 'userForm', 'addOrEdit', 'id');
    Table.bsModal = bsModal.init();

    //初始化表格
    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    Table.bsTable = bsTable.init(); //返回的是BSTable对象

    //初始化工具条
    var toolbar = new Toolbar(Table.toolbarId);
    toolbar = toolbar.init();

    bsTable.bindEvents(toolbar, bsModal, bsTable);
    bsModal.bindEvents(bsModal, bsTable);
    // toolbar.bindEvents(toolbar, bsModal, bsTable);

    $('#' + toolbar.addBntName).click(function () {
        bsModal.clearForm();
        $("#sex").selectpicker('val', '1');
        $("#roleId").empty();
        //获取角色数据
        var ajax = new $ax(roleApiUrl, function (data) {
            if (data.code === "0000") {
                var items = data.data;
                // console.log(items);
                var select = $("#roleId");
                for (var i = 0; i < items.length; i++) {
                    select.append("<option value='" + items[i].id + "'>"
                        + items[i].name + "</option>");
                }
                // console.log(selectItem[0].sysRole.id);
                $("#roleId").selectpicker('val', '3');
                $("#roleId").selectpicker('refresh');
            } else if (data.code === "0002") {
                CSW.error(CSW.saveFail + data.msg);
            } else {
                CSW.error(CSW.unknowCode + data.code);
            }
        }, function (data) {
            CSW.error(CSW.requestFail + data.msg);
        });
        ajax.type = "GET";
        ajax.start();
        bsModal.open('添加用户');
    });
    $('#' + toolbar.deleteBntName).click(function () {
        var ids = bsTable.getIdSelections();
        // console.log("ids: " + ids);
        if (ids.length >= 1) {
            var str = ids.length > 1 ? "注意是批量删除！" : "";
            CSW.confirm(CSW.confirmInfo + str, function (result) {
                if (result) {
                    var objects = [];
                    for (var i in ids) {
                        var object = {};
                        object["id"] = parseInt(ids[i]);
                        objects.push(object);
                    }
                    var ajax = new $ax(bsModal.api + "/batch", function (data) {
                        if (data.code === "0000") {
                            CSW.success(CSW.deleteOk);
                            bsTable.refresh();
                        } else if (data.code === "0002") {
                            CSW.error(CSW.deleteFail + data.msg);
                        } else {
                            CSW.error(CSW.unknowCode + data.code);
                        }
                    }, function (data) {
                        CSW.error(CSW.requestFail + data.msg);
                    });
                    ajax.type = "DELETE";
                    ajax.data = objects;
                    ajax.start();
                }
            });
        } else {
            CSW.info(CSW.selectTip);
        }
    });
    $('#' + toolbar.editBntName).click(function () {
        var itemSelections = bsTable.getItemSelections();
        if (itemSelections.length === 1) {
            bsModal.setModalData(itemSelections[0]);
            bsModal.setForm();
            $("#roleId").empty();
            //获取角色数据
            var ajax = new $ax(roleApiUrl, function (data) {
                if (data.code === "0000") {
                    var items = data.data;
                    // console.log(items);
                    var select = $("#roleId");
                    for (var i = 0; i < items.length; i++) {
                        select.append("<option value='" + items[i].id + "'>"
                            + items[i].name + "</option>");
                    }
                    // console.log(selectItem[0].sysRole.id);
                    $("#roleId").selectpicker('val', itemSelections[0].sysRole.id);
                    $("#roleId").selectpicker('refresh');
                } else if (data.code === "0002") {
                    CSW.error(CSW.saveFail + data.msg);
                } else {
                    CSW.error(CSW.unknowCode + data.code);
                }
            }, function (data) {
                CSW.error(CSW.requestFail + data.msg);
            });
            ajax.type = "GET";
            ajax.start();
            bsModal.open("修改用户");
        } else if (itemSelections.length > 1) {
            CSW.info(CSW.selectOneTip);
        }
    });

    //工具条后续的方法。。。
    var roleBsModal = new BSModal('');
    roleBsModal.setModal("roleModal", "assignRoleForm");
    roleBsModal = roleBsModal.init();
    $("#assignRole").click(function () { //弹出分配角色模态框
        var itemSelections = bsTable.getItemSelections();
        if (itemSelections.length === 1) {
            $("#userId").val(itemSelections[0].id);
            //清空原先的数据
            $("#roleName").empty();
            //获取角色数据
            var ajax = new $ax(roleApiUrl, function (data) {
                if (data.code === "0000") {
                    var items = data.data;
                    // console.log(items);
                    var select = $("#roleName");
                    for (var i = 0; i < items.length; i++) {
                        select.append("<option value='" + items[i].id + "'>"
                            + items[i].name + "</option>");
                    }
                    // console.log(selectItem[0].sysRole.id);
                    $("#roleName").selectpicker('val', itemSelections[0].sysRole.id);
                    $("#roleName").selectpicker('refresh');
                } else if (data.code === "0002") {
                    CSW.error(CSW.saveFail + data.msg);
                } else {
                    CSW.error(CSW.unknowCode + data.code);
                }
            }, function (data) {
                CSW.error(CSW.requestFail + data.msg);
            });
            ajax.type = "GET";
            ajax.start();
            roleBsModal.open("分配角色");
        } else if (itemSelections.length > 1) {
            CSW.info(CSW.selectOneTip);
        }
    });
    $("#roleModalBnt").click(function () {
        var userId = $("#userId").val();
        var roleId = $("#roleName").val();
        if (userId === "" || roleId === null) {
            CSW.error("角色名称不能为空！")
        } else {
            //调用接口
            var obj = {};
            obj['userId'] = parseInt(userId);
            obj['roleId'] = parseInt(roleId);
            var ajax = new $ax(Table.api + "/bindRole", function (data) {
                if (data.code === "0000") {
                    CSW.success(CSW.saveOk);
                    roleBsModal.close();
                    bsTable.refresh();
                } else if (data.code === "0002") {
                    CSW.error(CSW.saveFail + data.msg);
                } else {
                    CSW.error(CSW.unknowCode + data.code);
                }
            }, function (data) {
                CSW.error(CSW.requestFail + data.msg);
            });
            ajax.setData(obj);
            ajax.type = "POST";
            ajax.start();
        }
    });
});