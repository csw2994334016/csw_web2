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
                $scope.inData = [
                    [mockData(), mockData(), mockData(), mockData(), mockData(), mockData(), mockData()]
                ];
            } else if (type === $scope.tabType.OUT){
                $scope.outData = [
                    [mockData(), mockData(), mockData(), mockData(), mockData(), mockData(), mockData()]
                ];
            } else if (type === $scope.tabType.BORROW) {
                $scope.borrowData = [
                    [mockData(), mockData(), mockData(), mockData(), mockData(), mockData(), mockData()]
                ];
            }
        }

        function mockData() {
            return Math.round(Math.random() * 100)
        };

        // 入库
        $scope.inLabels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.inSeries = ['入库'];
        $scope.inData = [
            [mockData(), mockData(), mockData(), mockData(), mockData(), mockData(), mockData()]
        ];
        $scope.inOnClick = function (points, evt) {
            console.log(points, evt);
        };
        // 出库
        $scope.outLabels = ["2018/5/23", "2018/5/24", "2018/5/25", "2018/5/26", "2018/5/27", "2018/5/28", "2018/5/29"];
        $scope.outSeries = ['出库'];
        $scope.outData = [
            [mockData(), mockData(), mockData(), mockData(), mockData(), mockData(), mockData()]
        ];
        $scope.outOnClick = function (points, evt) {
            console.log(points, evt);
        };
        // 借出
        $scope.borrowLabels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        $scope.borrowSeries = ['借出'];
        $scope.borrowData = [
            [mockData(), mockData(), mockData(), mockData(), mockData(), mockData(), mockData()]
        ];
        $scope.borrowOnClick = function (points, evt) {
            console.log(points, evt);
        };

        getSkuInfo()
        getClassesInfo();

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
    })
})();