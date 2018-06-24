$(function () {
    var wareHouse = [];
    var selectedRows = [];
    var modifyRow = {};

    var Table = {
        api: '/api/bm/records',
        tableId: "mainTable",
        toolbarId: "toolbar",
        bsTable: null,
        bsModal: null
    };
    Table.initColumn = function () {
        var columns = [
            {field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%',},
            {title: '日期', field: 'recordDate', align: 'center', width: '20%'},
            {title: '库房', field: 'whName', align: 'center', width: '10%'},
            {title: '物料名', field: 'skuDesc', align: 'center', width: '10%'},
            {title: '型号', field: 'spec', align: 'center', width: '5%'},
            {title: '数量', field: 'recordAmount', align: 'center', width: '5%'},
            {title: '类型', field: 'recordType', align: 'center', width: '5%'},
            {title: '责任人', field: 'person', align: 'center', width: '10%'},
            {title: '原因', field: 'reason', align: 'center', width: '30%'},
        ];
        return columns;
    };

    function checkedClick() {
        console.log('hahaha');
    }

    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable.init();
    $('#mainTable').on('check.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#mainTable').on('uncheck.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#mainTable').on('check-all.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#mainTable').on('uncheck-all.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#mainTable').on('check-some.bs.table', function ($element, row) {
        setToolBarState()
    })
    $('#mainTable').on('uncheck-some.bs.table', function ($element, row) {
        setToolBarState()
    })

    function setToolBarState() {
        selectedRows = bsTable.getItemSelections();
        if (selectedRows.length === 0) {
            $('#modify').prop('disabled', true);
            $('#delete').prop('disabled', true);
            return;
        }
        if (selectedRows.length === 1) {
            $('#modify').prop('disabled', false);
            $('#delete').prop('disabled', false);
            return;
        }
        if (selectedRows.length > 1) {
            $('#modify').prop('disabled', true);
            $('#delete').prop('disabled', false);
        }
    }



    //初始化添加模态框方法
    var bsModal = new BSModal();
    bsModal.setModal('editModal', null, 'saveBtn')
    bsModal.init();

    //库房下拉框
    $("#wareHouse").empty();
    $("#wareHouseModal").empty();
    var ajax = new $ax('/api/basic/warehouses', function (data) {
        if (data.code === "0000") {
            var items = data.data;
            wareHouse = items;
            var select = $("#wareHouse");
            var whModal = $('#wareHouseModal');
            for (var i = 0; i < items.length; i++) {
                select.append("<option value='" + items[i].whCode + "'>" + items[i].whName + "</option>");
                whModal.append("<option value='" + items[i].whCode + "'>" + items[i].whName + "</option>");
            }
            select.selectpicker('val', '');
            select.selectpicker('refresh');
            whModal.selectpicker('val', '');
            whModal.selectpicker('refresh');
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

    //物料汇总信息
    $('#wareHouse').change(function () {
        var whName = $('#wareHouse').find("option:selected").text();
        getSkuInfo($("#sku"), whName);
    });
    $("#wareHouseModal").change(function () {
        var whName = $('#wareHouseModal').find("option:selected").text();
        getSkuInfo($("#skuModal"), whName);
    })

    function getSkuInfo(select, whName, callback) {
        select.empty();
        var ajax = new $ax('/api/bm/inventories/whName', function (data) {
            if (data.code === "0000") {
                var items = data.data;
                for (var i = 0; i < items.length; i++) {
                    var skuDesc_spec = items[i].skuDesc + "-" + items[i].spec;
                    var sku_value = items[i].sku;
                    select.append("<option value='" + sku_value + "'>" + skuDesc_spec + "</option>");
                }
                select.selectpicker('val', '');
                select.selectpicker('refresh');
                if (callback) {
                    callback();
                }
            } else if (data.code === "0002") {
                CSW.error(CSW.getFail + data.msg);
            } else {
                CSW.error(CSW.unknowCode + data.code);
            }
        }, function (data) {
            CSW.error(CSW.requestFail + data.msg);
        });
        ajax.set('whName', whName);
        ajax.type = "POST";
        ajax.start();
    }

    //缺失类型下拉框
    $("#type").empty();
    $("#typeModal").empty();
    var ajax = new $ax('/api/bm/records/recordTypes', function (data) {
        if (data.code === "0000") {
            var items = data.data;
            var select = $("#type");
            var selectModal = $('#typeModal');
            for (var i = 0; i < items.length; i++) {
                select.append("<option value='" + items[i].code + "'>" + items[i].desc + "</option>");
                selectModal.append("<option value='" + items[i].code + "'>" + items[i].desc + "</option>");
            }
            select.selectpicker('val', '');
            select.selectpicker('refresh');
            selectModal.selectpicker('val', '');
            selectModal.selectpicker('refresh');
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


    $('#add').click(function () {
        modifyRow = {};
        $('#wareHouseModal').selectpicker('val', '');
        $('#skuModal').selectpicker('val', '');
        $('#typeModal').selectpicker('val', '');
        $('#chargerModal').val('');
        $('#reasonModal').val('');
        $('#numberModal').val('');

        bsModal.open('添加缺失信息');
    })

    $('#modify').click(function () {
        modifyRow = selectedRows[0];

        var selectedWh = wareHouse.filter(function (item) {
            return item.whName === modifyRow.whName;
        })[0];
        getSkuInfo($("#skuModal"), modifyRow.whName, function () {
            $('#skuModal').selectpicker('val', modifyRow.sku);
        });
        $('#wareHouseModal').selectpicker('val', selectedWh.whCode);
        $('#typeModal').selectpicker('val', modifyRow.recordType);
        $('#chargerModal').val(modifyRow.person);
        $('#reasonModal').val(modifyRow.reason);
        $('#numberModal').val(modifyRow.recordAmount);

        bsModal.open('添加缺失信息');
    })

    $('#saveBtn').click(function () {
        var whName = $('#wareHouseModal').find("option:selected").text();
        var skuSelected = $('#skuModal').find("option:selected").text();
        var skuDesc = skuSelected.split('-')[0];
        var spec = skuSelected.split('-')[1];
        var sku = $('#skuModal').find("option:selected").val();
        var type = $('#typeModal').find("option:selected").val();
        var charger = $('#chargerModal').val();
        var reason = $('#reasonModal').val();
        var recordAmount = $('#numberModal').val();
        if (!whName) {
            toastr.warning('请选择仓库~')
            return;
        }
        if (!skuSelected) {
            toastr.warning('请选择物料~')
            return;
        }
        if (!charger || charger.trim().length === 0) {
            toastr.warning('请输入责任人~')
            return;
        }
        if (!type) {
            toastr.warning('请选择缺失类型~')
            return;
        }
        var reg = /^([0-9]\d*)$/;
        if (!reg.test(recordAmount)) {
            toastr.warning('缺失数量数据格式错误~')
            return;
        }
        if (parseInt(recordAmount) === 0) {
            toastr.warning('缺失数量需要大于0~')
            return;
        }

        var params = {
            whName: whName,
            sku: sku,
            skuDesc: skuDesc,
            spec: spec,
            recordType: type,
            person: charger,
            reason: reason,
            recordAmount: recordAmount,
        }

        var url = modifyRow.id ? '/api/bm/records/' + modifyRow.id : '/api/bm/records';

        var ajax = new $ax(url, function (data) {
            if (data.code === "0000") {
                toastr.success('已新增缺失信息');
                bsTable.refresh()
                bsModal.close();
                modifyRow = {};
            } else {
                toastr.warning(data.msg);
            }
        }, function (data) {
            toastr.warning(CSW.requestFail + data.msg);
        });
        ajax.setData(params);
        ajax.type = modifyRow.id ? "PUT" : "POST";
        ajax.start();
    })
    
    $('#delete').click(function () {
        var deleteIds = [];
        selectedRows.forEach(function (item) {
            deleteIds.push({id: item.id});
        })
        var ajax = new $ax('/api/bm/records/batch', function (data) {
            if (data.code === "0000") {
                toastr.success('已删除缺失信息');
                bsTable.refresh()
                bsModal.close();
                modifyRow = {};
                selectedRows = [];
                $('#modify').prop('disabled', true);
                $('#delete').prop('disabled', true);
            } else {
                toastr.warning(data.msg);
            }
        }, function (data) {
            toastr.warning(CSW.requestFail + data.msg);
        });
        ajax.setData(deleteIds);
        ajax.type = "DELETE";
        ajax.start();
    })

    $('#reset').click(function () {
        $('#wareHouse').selectpicker('val', null);
        $('#sku').selectpicker('val', null);
        $('#type').selectpicker('val', null);
        $('#startTime').val(null);
        $('#endTime').val(null);
    })
    
    $('#search').click(function () {
        var queryData = {};
        var whCode = $('#wareHouse').find("option:selected").val();
        if (whCode) {
            queryData['whName'] = $('#wareHouse').find("option:selected").text();
        }else {
            queryData['whName'] = '';
        }
        queryData['sku'] = $('#sku').find("option:selected").val();
        queryData['recordType'] = $('#type').find("option:selected").val();
        queryData['startTime'] = $('#startTime').val();
        queryData['endTime'] = $('#endTime').val();
        bsTable.refresh({query: queryData});
        bsTable.setRefreshParams({query: queryData});
        modifyRow = {};
        selectedRows = [];
        $('#modify').prop('disabled', true);
        $('#delete').prop('disabled', true);
    })
});