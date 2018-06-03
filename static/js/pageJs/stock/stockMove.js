$(function () {
    var Table = {
        api: '',
        tableId: "myTable",
        toolbarId: "toolbar",
        bsTable: null,
        bsModal: null,
    };
    Table.initColumn = function () {
        var columns = [
            {field: 'state1', checkbox: true, align: 'center', valign: 'middle'},
            {title: '物料名', field: 'name', align: 'center',},
            {title: '仓库', field: 'stock', align: 'center',},
            {title: '位置', field: 'position', align: 'center'},
            {title: '库存量', field: 'sum', align: 'center'},
            {
                title: '转移量',
                field: 'mount',
                align: 'center',
                editable: {
                    type: 'text',
                    title: '请填写转移量',
                    validate: function (v) {
                        if (v <= 0) return '转移数量不能低于1';
                    }
                }
            },
            {
                title: '目标库',
                field: 'targetStock',
                align: 'center',
                editable: {
                    type: 'select',
                    title: '请选择目标库',
                    source:[{value:"1",text:"目标库A"},{value:"2",text:"目标库B"}],
                    validate: function (v) {
                        if (!v) return '请选择目标库';
                    }
                }
            },
            {
                title: '目标位置',
                field: 'targetPos',
                align: 'center',
                editable: {
                    type: 'select',
                    title: '请选择目标位置',
                    source:[{value:"1",text:"目标位置A"},{value:"2",text:"目标位置B"}],
                    validate: function (v) {
                        if (!v) return '请选择目标位置';
                    }
                }
            }
        ];
        return columns;
    };

    function test(field, row, oldValue, $el) {
        console.log(field, row, oldValue, $el)
    }

    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable.setOnEditableSave(function (field, row, oldValue, $el) {
        console.log(field,row, oldValue, $el)
        bsTable.tbInstance.bootstrapTable("checkBy", {field:"mount", values:[row.amount]})
    });
    bsTable = bsTable.init();

    var data = [{
        name:"物料A",
        stock:'仓库A',
        position: '0001',
        sum: 100,
        mount: 0,
    }];

    bsTable.tbInstance.bootstrapTable('append',data);
});