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
    bsTable.setStyle(260, true, false, false, false, false);
    bsTable.init();

    var wareHouseUsedInfoChart = Highcharts.chart('wareHouseUsedInfo', {
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
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '库房使用占比',
            data: [
                {
                    name: '已使用',
                    y: 56.4,
                }, {
                    name: '未使用',
                    y: 44.6,
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
            crosshair: true
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
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
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
});