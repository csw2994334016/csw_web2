/**
 * Created by csw on 2016/11/10 17:24.
 * Explain:
 */

(function () {

    var BSModal = function (api) {
        this.api = api;
        this.modalId = "myModal";
        this.formId = "myForm";
        this.fields = [];
        this.modalBnt = 'addOrEdit';
        this.idName = 'id';
        this.pId = '';
        this.mdInstance = null;
        this.modalData = {};
    };

    BSModal.prototype = {

        setModal: function (modalId, formId, modalBnt, idName) {
            this.modalId = modalId;
            this.formId = formId;
            this.modalBnt = modalBnt;
            this.idName = idName;
        },

        setPId: function (pId) {
            this.pId = pId;
        },

        setFields: function (fields) {
            this.fields = fields;
        },

        init: function () {
            this.mdInstance = $("#" + this.modalId);
            return this;
        },

        close: function () {
            this.mdInstance.modal('hide');
        },

        open: function (title) {
            if (typeof title !== "undefined") {
                this.mdInstance.on('show.bs.modal', function () {
                    var modal = $(this);
                    modal.find('.modal-title').text(title);
                });
            } else {
                this.mdInstance.on('show.bs.modal', function () {
                    var modal = $(this);
                    modal.find('.modal-title').text("添加信息");
                });
            }
            this.mdInstance.modal('show');
            this.mdInstance.draggable({
                handle: ".modal-header",
                cursor: 'move',
                refreshPositions: true
            });
        },

        clearForm: function () {
            $(':input', '#' + this.formId).not(':button, :submit').val('').removeAttr('checked').removeAttr('selected');
        },

        setForm: function () {
            for (var key in this.modalData) {
                $('#' + key).val(this.modalData[key]);
            }
        },

        setModalData: function (data) {
            this.modalData = data;
            // console.log("setModalData: " + JSON.stringify(this.modalData));
            return this;
        },

        clearModalData: function () {
            this.modalData = {};
            return this;
        },

        collectModalData: function () {
            for (var i in this.fields) {
                this.set(this.fields[i], this.getValue(this.fields[i]));
            }
            if (this.pId !== '') {
                this.modalData[this.pId] = this.getValue(this.pId);
            }
            // console.log("collectModalData: " + JSON.stringify(this.modalData));
        },

        set: function (key, value) {
            if (typeof key === "object") {
                for (var i in key) {
                    if (typeof i === "function")
                        continue;
                    this.modalData[i] = key[i];
                }
            } else {
                this.modalData[key] = (typeof value === "undefined") ? $("#" + key).val() : value;
            }
            return this;
        },

        getValue: function (key) {
            return $("#" + key).val();
        },

        bindEvents: function (bsModal, bsTable) {
            // 添加或修改按钮操作
            $("#" + bsModal.modalBnt).click(function () {

                bsModal.clearModalData();
                bsModal.collectModalData();

                var url = bsModal.api;
                var type = "POST";
                if (bsModal.modalData !== null && bsModal.modalData[bsModal.idName] !== '') {
                    url = url + "/" + bsModal.modalData[bsModal.idName];
                    type = "PUT";
                }
                var ajax = new $ax(url, function (data) {
                    if (data.code === "0000") {
                        CSW.success(CSW.saveOk);
                        bsModal.close();
                        bsTable.refresh();
                    } else if (data.code === "0002") {
                        CSW.error(CSW.saveFail + data.msg);
                    } else {
                        CSW.error(CSW.unknowCode + data.code);
                    }
                }, function (data) {
                    CSW.error(CSW.requestFail + data.msg);
                });
                ajax.setData(bsModal.modalData); //提交的Json数据对象
                ajax.type = type;
                ajax.start();
            });
        }
    };

    window.BSModal = BSModal;

}());

