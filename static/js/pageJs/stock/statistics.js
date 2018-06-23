(function () {
    var app = angular.module('app', ['chart.js']);
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

        $scope.tabType = {
            IN: 'in',
            OUT: 'out',
            BORROW: 'borrow',
        }

        $scope.changeTab = function (type) {
            if (type === $scope.tabType.IN) {

            } else if (type === $scope.tabType.OUT){

            } else if (type === $scope.tabType.BORROW) {

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
                $scope.inLabels = res.data.labelList;
                $scope.inData = [];
                $scope.inData.push(res.data.dataList);
                $scope.inSeries = ['入库'];
                $scope.$apply();
            }, function (error) {
                toastr.warning(error.msg)
            })
        }

        // 出库
        function getOutData() {
            var params = {
                sku: $scope.selectedSkuOut?$scope.selectedSkuOut.sku:'',
                banJi: $scope.selectedBanJi?$scope.selectedBanJi.banJiName:'',
                project: $scope.selectedProject?$scope.selectedProject.name:'',
                year: $scope.selectedSkuOutYear?$scope.selectedSkuOutYear.split('年')[0]:'',
                month: $scope.selectedSkuOutMonth?$scope.selectedSkuOutMonth.split('月')[0]:'',
            }
            $httpAjax.post('/api/bm/inputDetails/inputStatics',params,function (res) {
                $scope.outLabels = res.data.labelList;
                $scope.outData = [];
                $scope.outData.push(res.data.dataList);
                $scope.outSeries = ['出库'];
                $scope.$apply();
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
            $httpAjax.post('/api/bm/inputDetails/inputStatics',params,function (res) {
                $scope.borrowLabels = res.data.labelList;
                $scope.borrowData = [];
                $scope.borrowData.push(res.data.dataList);
                $scope.borrowSeries = ['借出'];
                $scope.$apply();
            }, function (error) {
                toastr.warning(error.msg)
            })
        }
    })
})();
