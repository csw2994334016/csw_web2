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
            {
                field: 'checked',
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    if(value){
                        return "<input type=\"checkbox\" checked>"
                    } else {
                        return "<input type=\"checkbox\">"
                    }
                }
            },
            {title: '物料名', field: 'name', align: 'center',width: '20%', disabled: true},
            {title: '仓库', field: 'stock', align: 'center',width: '10%'},
            {title: '位置', field: 'position', align: 'center',width: '10%'},
            {title: '库存量', field: 'sum', align: 'center',width: '10%'},
            {
                title: '转移量',
                field: 'mount',
                align: 'center',
                width: '10%',
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
                width: '20%',
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
                width: '20%',
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

    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable.setOnEditableSave(function (field, row, oldValue, $el) {
        var pageData = bsTable.tbInstance.bootstrapTable('getData');
        var index = pageData.indexOf(row);
        if (field === 'mount' && row.mount > row.sum) {
            bsTable.tbInstance.bootstrapTable
            row.mount = oldValue;
            bsTable.tbInstance.bootstrapTable('updateRow',{index: index,row:row})
            toastr.warning('转移量不能超过库存量哦~')
            return;
        }
        row.checked = true;
        bsTable.tbInstance.bootstrapTable('updateRow',{index: index,row:row})
    });
    bsTable = bsTable.init();

    var data = [{
        checked: false,
        name:"物料A",
        stock:'仓库A',
        position: '0001',
        sum: 100,
        mount: 0,
    },{
        checked: false,
        name:"物料B",
        stock:'仓库A',
        position: '0002',
        sum: 100,
        mount: 0,
    }];

    bsTable.tbInstance.bootstrapTable('append',data);
    
    $('#save').click(function () {
    })
});