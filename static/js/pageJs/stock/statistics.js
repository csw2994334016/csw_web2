(function () {
    var app = angular.module('app', []);
    app.controller('statisticsCtrl', function ($scope, $httpAjax) {
        $scope.canvasStyle = {}
        var windowHeight = $(window).height() - 150;
        $scope.canvasStyle.width= windowHeight/2 *3;
        $scope.canvasStyle.height = windowHeight;

        $scope.years = [];
        var nowDate = new Date();
        var nowYear = nowDate.getFullYear()
        for (var year = 2018; year <= nowYear; year++){
            $scope.years.push(year);
        }
        $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];

        var options = {
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: [{
                categories:[],
                crosshair: false,
                title: {
                    text: '日期(号)'
                }
            }],
            yAxis: [{ // Primary yAxis
                min: 0,
                title: {
                    text: '数量',
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
            }],
            tooltip: {
                headerFormat: '日期: {point.x}号<br>',
                pointFormat: '数量: {point.y}',
                shared: true
            },
            legend: {
                verticalAlign: 'bottom',
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                data: [],
            }]
        }

        var inStatisticsChart = Highcharts.chart('inStatistics', options);
        var outStatisticsChart = Highcharts.chart('outStatistics', options);
        var borrowStatistics = Highcharts.chart('borrowStatistics', options);


        $scope.tabType = {
            IN: 'in',
            OUT: 'out',
            BORROW: 'borrow',
        }

        $scope.changeTab = function (type) {
            if (type === $scope.tabType.IN) {
                queryInData()
            } else if (type === $scope.tabType.OUT){
                getOutData()
            } else if (type === $scope.tabType.BORROW) {
                getBorrowData()
            }
        }
        $scope.resetQuery = function (type) {
            if (type === $scope.tabType.IN) {
                $scope.selectedSkuIn = null;
                $scope.inDepartmentInput = '';
                $scope.selectedSkuInYear = null;
                $scope.selectedSkuInMonth = null;
            } else if (type === $scope.tabType.OUT){
                $scope.selectedSkuOut = null;
                $scope.selectedBanJi = null;
                $scope.projectInput = '';
                $scope.selectedSkuOutYear = null;
                $scope.selectedSkuOutMonth = null;
            } else if (type === $scope.tabType.BORROW) {
                $scope.selectedSkuBorrow = null;
                $scope.selectedSkuBorrowYear = null;
                $scope.selectedSkuBorrowMonth = null;
            }
        }

        $scope.queryData = function (type){
            if (type === $scope.tabType.IN) {
                if ($scope.selectedSkuInYear && !$scope.selectedSkuInMonth) {
                    toastr.warning('请选择要查询的月份');
                    return;
                }
                if (!$scope.selectedSkuInYear && $scope.selectedSkuInMonth) {
                    toastr.warning('请选择要查询的年份');
                    return;
                }
                queryInData();
            } else if (type === $scope.tabType.OUT){
                if ($scope.selectedSkuOutYear && !$scope.selectedSkuOutMonth) {
                    toastr.warning('请选择要查询的月份');
                    return;
                }
                if (!$scope.selectedSkuOutYear && $scope.selectedSkuOutMonth) {
                    toastr.warning('请选择要查询的年份');
                    return;
                }
                getOutData();
            } else if (type === $scope.tabType.BORROW) {
                if ($scope.selectedSkuBorrowYear && !$scope.selectedSkuBorrowMonth) {
                    toastr.warning('请选择要查询的月份');
                    return;
                }
                if (!$scope.selectedSkuBorrowYear && $scope.selectedSkuBorrowMonth) {
                    toastr.warning('请选择要查询的年份');
                    return;
                }
                getBorrowData();
            }
        }

        getSkuInfo()
        getClassesInfo();
        getProjectInfo();
        queryInData();

        function getSkuInfo() {
            $httpAjax.get('/api/basic/products',null, function (res) {
                $scope.sku = res.data;
                $scope.$apply()
            },function (error) {
                toastr.warning(error.msg)
            })
        }

        function getClassesInfo() {
            $httpAjax.get('/api/basic/banJis',null,function (res) {
                $scope.banJis = res.data;
                $scope.$apply();
            }, function (error) {
                toastr.warning(error.msg)
            })
        }

        function getProjectInfo() {
            //项目
            $httpAjax.get('/api/basic/projects',null,function (res) {
                $scope.projects = res.data;
                $scope.$apply();
            }, function (error) {
                toastr.warning(error.msg)
            })
        }

        // 入库
        function queryInData() {
            var params = {
                sku: $scope.selectedSkuIn?$scope.selectedSkuIn.sku:'',
                purchaseDept:  $scope.inDepartmentInput?$scope.inDepartmentInput:'',
                year: $scope.selectedSkuInYear?$scope.selectedSkuInYear.split('年')[0]:'',
                month: $scope.selectedSkuInMonth?$scope.selectedSkuInMonth.split('月')[0]:'',
            }
            $httpAjax.post('/api/bm/inputDetails/inputStatics',params,function (res) {
                inStatisticsChart.update({
                    xAxis: [{
                        categories:res.data.labelList,
                    }],
                    series: [{
                        name: '入库统计',
                        data: res.data.dataList,
                    }]
                })
            }, function (error) {
                toastr.warning(error.msg)
            })
        }

        // 出库
        function getOutData() {
            var params = {
                sku: $scope.selectedSkuOut?$scope.selectedSkuOut.sku:'',
                banJiName: $scope.selectedBanJi?$scope.selectedBanJi.banJiName:'',
                projectName: $scope.selectedProject?$scope.selectedProject.name:'',
                year: $scope.selectedSkuOutYear?$scope.selectedSkuOutYear.split('年')[0]:'',
                month: $scope.selectedSkuOutMonth?$scope.selectedSkuOutMonth.split('月')[0]:'',
            }
            $httpAjax.post('/api/bm/outputs/outputStatics',params,function (res) {
                outStatisticsChart.update({
                    xAxis: [{
                        categories:res.data.labelList,
                    }],
                    series: [{
                        name: '出库统计',
                        data: res.data.dataList,
                    }]
                })
            }, function (error) {
                toastr.warning(error.msg)
            })
        }

        // 借用
        function getBorrowData() {
            var params = {
                sku: $scope.selectedSkuBorrow?$scope.selectedSkuBorrow.sku:'',
                year: $scope.selectedSkuBorrowYear?$scope.selectedSkuBorrowYear.split('年')[0]:'',
                month: $scope.selectedSkuBorrowMonth?$scope.selectedSkuBorrowMonth.split('月')[0]:'',
            }
            $httpAjax.post('/api/bm/borrows/borrowStatics',params,function (res) {
                borrowStatistics.update({
                    xAxis: [{
                        categories:res.data.labelList,
                    }],
                    series: [{
                        name: '借出统计',
                        data: res.data.dataList,
                    }]
                })
            }, function (error) {
                toastr.warning(error.msg)
            })
        }
    })
})();
