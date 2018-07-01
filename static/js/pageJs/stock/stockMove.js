$(function () {
    var wareHouse = [];
    var currentEditRow = {};
    var editRows = [];

    var Table = {
        api: '/api/bm/inventories',
        tableId: "myTable",
        toolbarId: "toolbar",
        bsTable: null,
        bsModal: null
    };
    Table.initColumn = function () {
        var columns = [
            {
                field: 'checked',
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    if (value) {
                        return "<input type=\"checkbox\" checked disabled>"
                    } else {
                        return "<input type=\"checkbox\" disabled>"
                    }
                }
            },
            {title: '物料名称', field: 'skuDesc', align: 'center', width: '20%', disabled: true},
            {title: '仓库名称', field: 'whName', align: 'center', width: '10%'},
            {title: '储位代码', field: 'locName', align: 'center', width: '10%'},
            {title: '库存量', field: 'skuAmount', align: 'center', width: '10%'},
            {title: '转移量',field: 'amount',align: 'center',width: '10%',},
            {title: '目标仓库',field: 'targetWareHouse', align: 'center',width: '20%',},
            {title: '目标储位',field: 'targetLoc',align: 'center', width: '10%',},
            {
                title: '操作',
                field: '',
                align: 'center',
                width: '10%',
                formatter: function () {
                    return "<a class='move' href='javascript:void(0)'>移库</a>"
                },
                events: removeAction()
            }
        ];
        return columns;
    };

    //初始化添加模态框方法
    var bsModal = new BSModal();
    bsModal.setModal('editModal',null,'saveBtn');
    bsModal.init();


    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable.setOnEditableSave(function (field, row, oldValue, $el) {
        var pageData = bsTable.tbInstance.bootstrapTable('getData');
        var index = pageData.indexOf(row);
        if (field === 'amount' && row.amount > row.skuAmount) {
            row.amount = oldValue;
            bsTable.tbInstance.bootstrapTable('updateRow', {index: index, row: row});
            toastr.warning('转移量不能超过库存量哦~');
            return;
        }
        row.checked = true;
        bsTable.tbInstance.bootstrapTable('updateRow', {index: index, row: row})
    });
    bsTable.setExport(true, {
        fileName: '移库信息',  //文件名称设置
        tableName: '移库信息',
        ignoreColumn: [0]
    });
    bsTable = bsTable.init();

    function removeAction() {
        window.events = {
            'click .move': function (e, value, row, index) {
                currentEditRow.row = row;
                currentEditRow.index = index;
                bsModal.open('移库信息')
                $("#targetWareHouse").empty();
                var wareHouseSelected = $("#targetWareHouse");
                wareHouseSelected.append("<option value='" + '' + "'>" + '' + "</option>");
                wareHouse.forEach(function (item) {
                    wareHouseSelected.append("<option value='" + item.id + "'>" + item.whName + "</option>")
                })
                wareHouseSelected.selectpicker('val', '');
                wareHouseSelected.selectpicker('refresh');
            }
        }
        return window.events;
    }

    $('#saveBtn').click(function () {
        var amount = $('#amount').val();
        var targetWareHouse = $('#targetWareHouse').find("option:selected").text();
        var targetLoc = $('#targetLoc').find("option:selected").text();
        var reg=/^([0-9]\d*)$/;
        if (!reg.test(amount)) {
            toastr.warning('转移量数据格式错误~')
            return;
        }
        if (parseInt(amount) === 0 ) {
            toastr.warning('转移量需要大于0~')
            return;
        }
        if (parseInt(amount) > currentEditRow.row.skuAmount) {
            toastr.warning('转移量不能超过库存量哦~')
            return;
        }
        if (!targetWareHouse) {
            toastr.warning('请选择目标仓库~')
            return;
        }
        if (!targetWareHouse) {
            toastr.warning('请选择目标储位~')
            return;
        }
        currentEditRow.row.amount = amount;
        currentEditRow.row.targetWareHouse = targetWareHouse;
        currentEditRow.row.targetLoc = targetLoc;
        currentEditRow.row.checked = true;
        editRows.push({
            id: currentEditRow.row.id,
            moveNumber: parseInt(amount),
            whName: targetWareHouse,
            locName: targetLoc,
        });
        bsTable.tbInstance.bootstrapTable('updateRow', {index: currentEditRow.index, row: currentEditRow.row});
        bsModal.close();
    })

    $("#targetWareHouse").change(function () {
        var whName = $('#targetWareHouse').find("option:selected").text();
        $("#targetLoc").empty();
        var ajax1 = new $ax('/api/basic/locs/warehouse', function (data) {
            if (data.code === "0000") {
                var items = data.data;
                var select = $("#targetLoc");
                for (var i = 0; i < items.length; i++) {
                    select.append("<option value='" + items[i].id + "'>" + items[i].locName + "</option>");
                }
                select.selectpicker('val', '');
                select.selectpicker('refresh');
            } else if (data.code === "0002") {
                CSW.error(CSW.getFail + data.msg);
            } else {
                CSW.error(CSW.unknowCode + data.code);
            }
        }, function (data) {
            CSW.error(CSW.requestFail + data.msg);
        });
        ajax1.set("whName", whName);
        ajax1.type = "POST";
        ajax1.start();
    })

    //库房下拉框
    $("#whId").empty();
    var ajax = new $ax('/api/basic/warehouses', function (data) {
        if (data.code === "0000") {
            var items = data.data;
            wareHouse = items;
            var select = $("#whId");
            select.append("<option value='" + '' + "'>" + '' + "</option>");
            for (var i = 0; i < items.length; i++) {
                select.append("<option value='" + items[i].id + "'>" + items[i].whName + "</option>");
            }
            select.selectpicker('val', '');
            select.selectpicker('refresh');
        } else if (data.code === "0002") {
            CSW.error(CSW.getFail + data.msg);
        } else {
            CSW.error(CSW.unknowCode + data.code);
        }
    }, function (data) {
        CSW.error(CSW.requestFail + data.msg);
    });
    ajax.type = "GET";
    ajax.start();

    //储位下拉框
    $('#whId').change(function () {
        var whName = $('#whId').find("option:selected").text();
        $("#locId").empty();
        var ajax1 = new $ax('/api/basic/locs/warehouse', function (data) {
            if (data.code === "0000") {
                var items = data.data;
                var select = $("#locId");
                select.append("<option value='" + '' + "'>" + '' + "</option>");
                for (var i = 0; i < items.length; i++) {
                    select.append("<option value='" + items[i].id + "'>" + items[i].locName + "</option>");
                }
                select.selectpicker('val', '');
                select.selectpicker('refresh');
            } else if (data.code === "0002") {
                CSW.error(CSW.getFail + data.msg);
            } else {
                CSW.error(CSW.unknowCode + data.code);
            }
        }, function (data) {
            CSW.error(CSW.requestFail + data.msg);
        });
        ajax1.set("whName", whName);
        ajax1.type = "POST";
        ajax1.start();
    });

    //物料信息下拉框
    $('#sku').empty();
    ajax = new $ax('/api/basic/products', function (data) {
        if (data.code === "0000") {
            var items = data.data;
            // console.log(items);
            var select = $("#sku");
            select.append("<option value='" + '' + "'>" + '' + "</option>");
            for (var i = 0; i < items.length; i++) {
                var skuDesc_spec = items[i].skuDesc + "-" + items[i].spec;
                select.append("<option value='" + items[i].sku + "'>" + skuDesc_spec + "</option>");
            }
            select.selectpicker('val', '');
            select.selectpicker('refresh');
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


    $('#reset').click(function () {
        $('#whId').selectpicker('val', '');
        $('#locId').selectpicker('val', '');
        $('#sku').selectpicker('val', '');
    });

    $("#search").click(function () {
        var queryData = {};
        queryData['whId'] = $('#whId').val();
        queryData['locId'] = $('#locId').val();
        queryData['sku'] = $('#sku').val();
        bsTable.refresh({query: queryData});
        bsTable.setRefreshParams({query: queryData});
    });

    $('#save').click(function () {
        ajax = new $ax('/api/bm/inventories/moveInventory', function (data) {
            if (data.code === "0000") {
                toastr.success('移库成功~');
                editRows = [];
                bsTable.refresh()
            } else if (data.code === "0002") {
                CSW.error(CSW.saveFail + data.msg);
            } else {
                CSW.error(CSW.unknowCode + data.code);
            }
        }, function (data) {
            CSW.error(CSW.requestFail + data.msg);
        });
        ajax.data = editRows;
        ajax.type = "POST";
        ajax.start();
    })
});