var wareHouse = [];
var selectedWareHouseName = null;
var wareHouseUsedInfoChart = null;
$(function () {
    var Table = {
        api: '',
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
            {title: '实际库存', field: 'amount', align: 'center', width: '20%'},
            {title: '安全库存', field: 'safeAmount', align: 'center', width: '20%'},
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
            colors: [ '#FFF263','#64E572'],
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

    var loginInfoChart = Highcharts.chart('loginInfo', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: '周登录信息'
        },
        xAxis: [{
            categories: ['周一', '周二', '周三', '周四', '周五', '周六',
                '周日'],
            crosshair: false
        }],
        yAxis: [{ // Primary yAxis
            title: {
                text: '登录用户数(人)',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
        }, { // Secondary yAxis
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
            data: [50, 35, 48, 30, 56, 70, 34],
            tooltip: {
                valueSuffix: ' 人'
            }
        }, {
            name: '登录次数',
            type: 'spline',
            yAxis: 1,
            data: [140,178,150,149,120,100,156],
            tooltip: {
                valueSuffix: '次'
            }
        }]
    });

    var notices = [];
    for (var index = 0; index < 5; index++) {
        notices.push({
            id: index,
            title: '【通知】通知公告'+index,
            time: '2016-07-21',
        })
    }
    notices.forEach(function (item) {
        $('#notices').append("<li><a href=\"javascript: void(0)\" onclick=\"goNoticeDetail('"+item.id+"')\">" + item.title + "</a><span\n" +
            "                            class=\"time\">" + item.time+ "</span></li>");
    })
    // 库房信息
    var ajax = new $ax('/api/basic/warehouses', function (data) {
        if (data.code === "0000") {
            var items = data.data;
            wareHouse = items
            var wh = $('#wareHouse');
            for (var i = 0; i < items.length; i++) {
                wh.append("<label class=\"m-r-10\" onclick=\"checkWH('"+ items[i].whName +"')\"><input id='"+ items[i].whName + "' type=\"checkbox\">"+items[i].whName+"</label>")
                if (i === 0) {
                    selectedWareHouseName = items[i].whName;
                }
            }
            setCheckBoxState()
            getWareHouseUsedInfo ()
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
    setCheckBoxState();
    getWareHouseUsedInfo ()
}

function setCheckBoxState() {
    wareHouse.forEach(function (item) {
        if (item.whName === selectedWareHouseName) {
            $('#'+item.whName).prop("checked",true)
        } else {
            $('#'+item.whName).prop("checked",false)
        }
    })
}

function getWareHouseUsedInfo() {
    var used = Math.round(Math.random() * 100)
    wareHouseUsedInfoChart.series[0].update({
        data: [
            {
                name: '已使用',
                y: used,
            }, {
                name: '未使用',
                y: 100 - used,
            },
        ]
    })
}