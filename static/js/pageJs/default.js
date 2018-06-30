var whUsedRatio = [];
var selectedWareHouseName = null;
var wareHouseUsedInfoChart = null;
var loginInfoChart = null;
$(function () {
    var Table = {
        api: '/api/bm/inventories/inventoryWarning',
        tableId: "myTable",
        toolbarId: "",
        bsTable: null,
        bsModal: null
    };
    Table.initColumn = function () {
        var columns = [
            {title: '物料名', field: 'skuDesc', align: 'center', width: '20%'},
            {title: '型号', field: 'spec', align: 'center', width: '20%'},
            {title: '库房', field: 'whName', align: 'center', width: '20%'},
            {title: '实际库存', field: 'skuAmount', align: 'center', width: '20%'},
            {title: '安全库存', field: 'safeNumber', align: 'center', width: '20%'},
        ];
        return columns;
    };
    var bsTable = new BSTable(Table.tableId, Table.toolbarId, CSW.getUrl(Table.api), Table.initColumn());
    bsTable.setStyle(260, false, false, false, false, false);
    bsTable.init();

    wareHouseUsedInfoChart = Highcharts.chart('wareHouseUsedInfo', {
        title: {
            text: ''
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,  // 可以被选择
                cursor: 'pointer',       // 鼠标样式
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                }
            }
        },
        series: [{
            type: 'pie',
            name: '库房使用占比',
            colors: [ '#F29503','#44B6AE'],
            data: [
                {
                    name: '已使用',
                    y: 0,
                }, {
                    name: '未使用',
                    y: 0,
                },
            ]
        }]
    });

    loginInfoChart = Highcharts.chart('loginInfo', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        xAxis: [{
            categories:[],
            crosshair: false,
        }],
        yAxis: [{ // Primary yAxis
            min: 0,
            title: {
                text: '登录用户数(人)',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                step: 2,
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
        }, { // Secondary yAxis
            min: 0,
            title: {
                text: '登录次数(次)',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            verticalAlign: 'bottom',
            floating: false,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: '登录用户数',
            type: 'column',
            data: [],
            tooltip: {
                valueSuffix: ' 人'
            }
        }, {
            name: '登录次数',
            type: 'spline',
            yAxis: 1,
            data:[],
            tooltip: {
                valueSuffix: '次'
            }
        }]
    });

    var ajax = new $ax( '/api/sys/notices' , function (data) {
        if (data.code === "0000") {
            var notices = data.data;
            notices.forEach(function (item) {
                var type = item.noticeType?item.noticeType:'通知';
                $('#notices').append("<li><a href=\"javascript: void(0)\" onclick=\"goNoticeDetail('"+item.id+"')\">【" + type +"】"+ item.title + "</a><span\n" +
                    "                            class=\"time\">" + item.createTime + "</span></li>");
            })
        } else{
            toastr.warning(data.msg);
        }
    }, function (data) {
        toastr.warning(CSW.requestFail + data.msg);
    });
    ajax.set();
    ajax.type = "GET";
    ajax.start();

    var ajax = new $ax('/api/basic/warehouses/warehouseUses', function (data) {
        if (data.code === "0000") {
            whUsedRatio = data.data;
            whUsedRatio.forEach(function (item, index) {
                $('#wareHouse').append("<label class=\"m-r-10\" onclick=\"checkWH('"+ item.whName +"')\"><input id='"+ item.whName + "' type=\"checkbox\">"+item.whName+"</label>")
                if (index === 0) {
                    selectedWareHouseName = item.whName;
                }
            })
            setChartInfo()
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

    var ajax = new $ax('/api/sys/users/loginStatics', function (data) {
        if (data.code === "0000") {
            setLoginInfo(data.data)
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
});

function goNoticeDetail(id) {
    window.location.href = '/pages/default/noticeDetail.html?id='+id;
}

function checkWH(item) {
    selectedWareHouseName = item;
    setChartInfo();
}

function setChartInfo() {
    whUsedRatio.forEach(function (item) {
        if (item.whName === selectedWareHouseName) {
            $('#'+item.whName).prop("checked",true)
            wareHouseUsedInfoChart.series[0].update({
                data: [
                    {
                        name: '已使用',
                        y: item.usedRatio * 100,
                    }, {
                        name: '未使用',
                        y: item.unUsedRatio * 100,
                    },
                ]
            })
        } else {
            $('#'+item.whName).prop("checked",false)
        }
    })
}

function setLoginInfo(data) {
    loginInfoChart.update({
        xAxis: [{
            categories:data.labelList,
        }],
        series: [{
            data: data.loginRenShuList,
        }, {
            data: data.loginCiShuList,
        }]
    })
}