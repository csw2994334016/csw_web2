$(function () {
    var Table = {
        api: '',
        tableId: "mainTable",
        toolbarId: "toolbar",
        bsTable: null,
        bsModal: null
    };
    Table.initColumn = function () {
        var columns = [
            {field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%'},
            {title: '日期', field: 'stock', align: 'center', width: '10%'},
            {title: '库房', field: 'position', align: 'center', width: '10%'},
            {title: '物料名', field: 'sum', align: 'center', width: '10%'},
            {title: '型号', field: 'sum', align: 'center', width: '5%'},
            {title: '数量', field: 'sum', align: 'center', width: '5%'},
            {title: '类型', field: 'sum', align: 'center', width: '5%'},
            {title: '责任人', field: 'sum', align: 'center', width: '10%'},
            {title: '原因', field: 'sum', align: 'center', width: '20%'},
            {title: '备注', field: 'sum', align: 'center', width: '20%'},
        ];
        return columns;
    };

    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable.init();
    
    $('#search').click(function () {
        
    })
});