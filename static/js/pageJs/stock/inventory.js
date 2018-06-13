$(function () {
    var Table = {
        api: '',
        tableId: "myTable",
        toolbarId: "toolbar",
        bsTable: null,
        bsModal: null
    };
    Table.initColumn = function () {
        var columns = [
            {title: '盘点单号', field: 'name', align: 'center', width: '20%', disabled: true},
            {title: '日期', field: 'stock', align: 'center', width: '10%'},
            {title: '盘点人', field: 'position', align: 'center', width: '10%'},
            {title: '备注', field: 'sum', align: 'center', width: '10%'},
        ];
        return columns;
    };

    var AddMoreTable = {
        api: '',
        tableId: "addMoreTable",
        toolbarId: "addMoreToolbar",
        bsTable: null,
        bsModal: null
    };
    AddMoreTable.initColumn = function () {
        var columns = [
            {title: '物料名', field: 'name', align: 'center', width: '20%', disabled: true},
            {title: '仓库', field: 'stock', align: 'center', width: '10%'},
            {title: '库存数量', field: 'position', align: 'center', width: '10%'},
            {title: '盘点数量', field: 'sum', align: 'center', width: '10%'},
            {title: '差异', field: 'mount', align: 'center', width: '10%'},
        ];
        return columns;
    };

    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable = bsTable.init();
    var addTable = new BSTable(AddMoreTable.tableId, AddMoreTable.toolbarId, CSW.getUrl(AddMoreTable.api), AddMoreTable.initColumn());
    addTable = addTable.init();

    $('#addMore').click(function () {
        $("#addMoreDiv").css("display", "block");
        setTimeout(function () {
            $("#addMoreDiv").css("transform", "translate(-100%, 0%)");
        }, 300);
    })
    $('#return').click(function () {
        $("#addMoreDiv").css("transform", "translate(0%, 0%)");
        setTimeout(function () {
            $("#addMoreDiv").addClass("display-none").removeClass('display-block');
        }, 200);
    })
});