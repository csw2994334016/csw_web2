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

  //盘点人信息
  $('#checkUser').empty();
  ajax = new $ax('/api/bm/checks', function (data) {
    if (data.code === "0000") {
      var items = data.data;
      debugger
      var select = $("#checkUser");
      select.append("<option value='" + '' + "'>" + '' + "</option>");
      for (var i = 0; i < items.length; i++) {
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