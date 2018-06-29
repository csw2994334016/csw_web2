$(function () {
    var checkDatas = [];
    var Table = {
        api: '/api/bm/checks',
        tableId: "myTable",
        toolbarId: "toolbar",
        bsTable: null,
        bsModal: null
    };
    Table.initColumn = function () {
        var columns = [
            {title: '盘点单号', field: 'checkNo', align: 'center', width: '20%', disabled: true},
            {title: '日期', field: 'createTime', align: 'center', width: '10%'},
            {title: '盘点人', field: 'checkUser', align: 'center', width: '10%'},
            {title: '备注', field: 'remark', align: 'center', width: '10%'}
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
            {title: '物料名', field: 'skuDesc', align: 'center', width: '20%'},
            {title: '仓库', field: 'whName', align: 'center', width: '10%'},
            {title: '库存数量', field: 'storeAmount', align: 'center', width: '10%'},
            {title: '盘点数量', field: 'checkAmount', align: 'center', width: '10%'},
            {title: '差异', field: 'difference', align: 'center', width: '10%'},
            {
                title: '', field: '', align: 'center', width: '10%',
                formatter: function () {
                    return "<a class='removeAddInfo' href='javascript:void(0)'>删除</a>"
                },
                events: deleteAction(),
            },
        ];
        return columns;
    };

    var DetailTable = {
        api: '/api/bm/checks/details',
        tableId: "detailTable",
        toolbarId: "detailToolbar",
        bsTable: null,
        bsModal: null
    };
    DetailTable.initColumn = function () {
        var columns = [
            {title: '物料名', field: 'skuDesc', align: 'center', width: '20%', disabled: true},
            {title: '仓库', field: 'whName', align: 'center', width: '10%'},
            {title: '库存数量', field: 'storeAmount', align: 'center', width: '10%'},
            {title: '盘点数量', field: 'checkAmount', align: 'center', width: '10%'},
            {title: '差异', field: 'difference', align: 'center', width: '10%'},
        ];
        return columns;
    };

    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable = bsTable.init();
    var addTable = new BSTable(AddMoreTable.tableId, AddMoreTable.toolbarId, CSW.getUrl(AddMoreTable.api), AddMoreTable.initColumn());
    addTable = addTable.init();
    var detailTable = new BSTable(DetailTable.tableId, DetailTable.toolbarId, CSW.getUrl(DetailTable.api), DetailTable.initColumn());
    detailTable = detailTable.init();
    $('#myTable').on('dbl-click-row.bs.table', function ($element, row, field) {
        var queryData = {};
        queryData['id'] = parseInt(row.id);
        detailTable.refresh({query: queryData});
        detailTable.setRefreshParams({query: queryData});

        $("#detailDiv").css("display", "block");
        setTimeout(function () {
            $("#detailDiv").css("transform", "translate(-100%, 0%)");
        }, 300);
    })

  //盘点人信息
  $('#checkUser').empty();
  ajax = new $ax('/api/sys/users', function (data) {
    if (data.code === "0000") {
      var items = data.data;
      var select = $("#checkUser");
      select.append("<option value='" + '' + "'>" + '' + "</option>");
      for (var i = 0; i < items.length; i++) {
        select.append("<option value='" + items[i].username + "'>" + items[i].username + "</option>");
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

  //库房下拉框
  $("#whId").empty();
  var ajax = new $ax('/api/basic/warehouses', function (data) {
    if (data.code === "0000") {
      var items = data.data;
      wareHouse = items;
      var select = $("#whId");
      select.append("<option value='" + '' + "'>" + '' + "</option>");
      for (var i = 0; i < items.length; i++) {
        select.append("<option value='" + items[i].whCode + "'>" + items[i].whName + "</option>");
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

  //物料汇总信息
  $('#whId').change(function () {
    var whName = $('#whId').find("option:selected").text();
    $("#sku").empty();
    var ajax = new $ax('/api/bm/inventories/whName', function (data) {
      if (data.code === "0000") {
        var items = data.data;
        var select = $("#sku");
        for (var i = 0; i < items.length; i++) {
          var skuDesc_spec = items[i].skuDesc + "-" + items[i].spec;
          var sku_skuAmount = items[i].sku + "-" + items[i].skuAmount;
          select.append("<option value='" + sku_skuAmount + "'>" + skuDesc_spec + "</option>");
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
    ajax.set('whName', whName);
    ajax.type = "POST";
    ajax.start();
  });

  function deleteAction() {
      window.events = {
          'click .removeAddInfo': function (e, value, row, index) {
              checkDatas.splice(index, 1);
              addTable.tbInstance.bootstrapTable('removeAll');
              addTable.tbInstance.bootstrapTable('append', checkDatas);
          }
      }
      return window.events;
  }

    $('#addMore').click(function () {
        $("#addMoreDiv").css("display", "block");
        setTimeout(function () {
            $("#addMoreDiv").css("transform", "translate(-100%, 0%)");
        }, 300);
    })
    $('#return').click(function () {
        checkDatas = [];
        $("#addMoreDiv").css("transform", "translate(0%, 0%)");
        setTimeout(function () {
            $("#addMoreDiv").addClass("display-none").removeClass('display-block');
            addTable.tbInstance.bootstrapTable('removeAll');
        }, 200);
    })
    $('#detailToolbar').click(function () {
        $("#detailDiv").css("transform", "translate(0%, 0%)");
        setTimeout(function () {
            $("#detailDiv").addClass("display-none").removeClass('display-block');
        }, 200);
    })
    
    $('#addToTable').click(function () {
      var selectedSku = $('#sku').find("option:selected").val();
      var selectedSkuDesc = $('#sku').find("option:selected").text();
      var selectedWareHouseId = $('#whId').find("option:selected").val();
      var selectedWareHouseName = $('#whId').find("option:selected").text();
      var numberInput = $('#checkNumber').val();
      if (!selectedSku) {
        toastr.warning('请选择需要盘点的物料');
        return;
      }
      if (!selectedWareHouseId) {
        toastr.warning('请选择需要盘点的物料仓库');
        return;
      }
      var reg=/^([0-9]\d*)$/;
      if (!reg.test(numberInput)) {
        toastr.warning('盘点数量为整数，请检查后重新填写~')
        return;
      }

      var sku_skuAmount = selectedSku.split('-')[1];
      var sku = selectedSku.split('-')[0];
      var hasItem = false;
      checkDatas.forEach(function (item) {
        if (item.whCode === selectedWareHouseId && item.sku === sku) {
          hasItem = true;
        }
      })
      if (hasItem) {
        toastr.warning('该物料已经存在盘点信息~');
        return;
      }

      var checkData = {
        whCode: selectedWareHouseId,
        skuDesc: selectedSkuDesc,
        sku: sku,
        storeAmount: sku_skuAmount,
        whName: selectedWareHouseName,
        checkAmount: parseInt(numberInput),
        difference: sku_skuAmount - parseInt(numberInput),
      }

      checkDatas.push(checkData);
      addTable.tbInstance.bootstrapTable('append', checkData);

        $('#sku').selectpicker('val', null);
        $('#whId').selectpicker('val', null);
        $('#checkNumber').val(null);
    })

    $('#save').click(function () {
      var ajax = new $ax('/api/bm/checks', function (data) {
        if (data.code === "0000") {
          toastr.success('已新增盘点信息')
          bsTable.refresh()

          checkDatas = [];
          addTable.tbInstance.bootstrapTable('removeAll');
          // 回退
          $("#addMoreDiv").css("transform", "translate(0%, 0%)");
          setTimeout(function () {
            $("#addMoreDiv").addClass("display-none").removeClass('display-block');
          }, 200);
        } else{
          toastr.warning(data.msg);
        }
      }, function (data) {
        toastr.warning(CSW.requestFail + data.msg);
      });
      ajax.set('checkDetailParamList', checkDatas);
      ajax.type = "POST";
      ajax.start();
    })

    $('#search').click(function () {
        var queryData = {};
        queryData['checkUser'] = $('#checkUser').find("option:selected").val()
        queryData['startTime'] = $('#startTime').val();
        queryData['endTime'] = $('#endTime').val();
        bsTable.refresh({query: queryData});
        bsTable.setRefreshParams({query: queryData});
    })
    $('#reset').click(function () {
        $('#checkUser').selectpicker('val', null)
        $('#startTime').val(null);
        $('#endTime').val(null);
    })
});