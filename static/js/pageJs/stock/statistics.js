(function () {
    var app = angular.module('app', ['chart.js']);
    app.controller('statisticsCtrl', function ($scope) {
        $scope.canvasStyle = {}
        var windowHeight = $(window).height() - 150;
        $scope.canvasStyle.width= windowHeight/2 *3;
        $scope.canvasStyle.height = windowHeight;

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

        $scope.queryData = function (type){
            if (type === $scope.tabType.IN) {
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
    })
})();