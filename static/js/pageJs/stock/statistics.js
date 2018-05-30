(function () {
    var app = angular.module('app', []);
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
                inCanvas()
            } else if (type === $scope.tabType.OUT){
                outCanvas()
            } else if (type === $scope.tabType.BORROW) {
                borrowCanvas()
            }
        }

        inCanvas()
        outCanvas()
        borrowCanvas()

        function inCanvas() {
            var randomScalingFactor = function () {
                return Math.round(Math.random() * 100)
            };
            var lineChartData = {
                labels: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                    }
                ]
            }
            var ctx = document.getElementById("inChart").getContext("2d");
            window.myLine = new Chart(ctx).Line(lineChartData, {
                bezierCurve: false,
            });
        }
        function outCanvas() {
            var randomScalingFactor = function () {
                return Math.round(Math.random() * 100)
            };
            var lineChartData = {
                labels: ["2018/5/23", "2018/5/24", "2018/5/25", "2018/5/26", "2018/5/27", "2018/5/28", "2018/5/29"],
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                    }
                ]
            }
            var ctx = document.getElementById("outChart").getContext("2d");
            window.myLine = new Chart(ctx).Line(lineChartData, {
                bezierCurve: false,
            });
        }
        function borrowCanvas() {
            var randomScalingFactor = function () {
                return Math.round(Math.random() * 100)
            };
            var lineChartData = {
                labels: ["五月23", "五月24", "五月25", "五月26", "五月27", "五月28", "五月29"],
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                    }
                ]
            }
            var ctx = document.getElementById("borrowChart").getContext("2d");
            window.myLine = new Chart(ctx).Line(lineChartData, {
                bezierCurve: false,
            });
        }
    })
})();