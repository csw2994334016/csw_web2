/**
 * 工具栏按钮方法
 * Created by csw on 2018/3/21.
 */
(function () {

    var Toolbar = function (toolbarId) {
        this.toolbarId = toolbarId;
        this.addBntName = 'add';
        this.editBntName = 'edit';
        this.deleteBntName = 'delete';

    };

    Toolbar.prototype = {

        setBntName: function (addBntName, deleteBntName, editBntName) {
            this.addBntName = addBntName;
            this.editBntName = editBntName;
            this.deleteBntName = deleteBntName;
        },

        init: function () {
            return this;
        },

        bindEvents: function (toolbar, bsModal, bsTable) {

            //'添加'按钮操作
            $("#" + toolbar.addBntName).click(function () {
                bsModal.clearForm();
                bsModal.open();
            });

            //'删除'按钮操作
            $("#" + toolbar.deleteBntName).click(function () {
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
                            // console.log("ids: " + objects);
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

            //'编辑'按钮操作
            $("#" + toolbar.editBntName).click(function () {
                var itemSelections = bsTable.getItemSelections();
                if (itemSelections.length === 1) {
                    bsModal.setModalData(itemSelections[0]);
                    bsModal.setForm();
                    bsModal.open("编辑信息");
                } else if (itemSelections.length > 1) {
                    CSW.info(CSW.selectOneTip);
                }
            });
        }
    };

    window.Toolbar = Toolbar;

}());

