(function () {
    var app = angular.module('app', []);
    app.controller('stockVirtualCtrl', function($scope, $httpAjax) {
        $scope.stocks = []

        getMockData()
        $scope.displayStock = $scope.stocks[0]
        function getMockData() {
            for (var i = 0; i < 2; i++) {
                var stock = {
                    id: i+1,
                    name: '测试仓库'+ (i+1),
                    zones:[]
                }
                for (var j = 0; j< 5; j++) {
                    var zone = {
                        id: j+1,
                        zoneName: '货架'+ (i+1)+'-'+(j+1),
                        areas: []
                    }

                    for (var k = 0; k < 4 ;k++) {
                        var area = {
                            id: k+1,
                            areaName: '层'+(i+1)+'-'+(j+1)+'-'+(k+1),
                            locs: [],
                            total: 18,
                            used: 16,
                            usedPercent:   `${k*10}%`,
                        }

                        for (var l = 0; l< 20; l++) {
                            var loc = {
                                id: l+1,
                                locName: "单元格" +(i+1)+'-'+(j+1)+'-'+(k+1)+'-'+(l+1),
                                hasUsed: l%2 === 0,
                                things: []
                            }
                            for (var n=0;n< 3;n++){
                                var thing = {
                                    id: n+1,
                                    thingName: "物品"+(n+1),
                                    thingSize: "规格",
                                    mount: (n+ 1)*3
                                }
                                loc.things.push(thing)
                            }
                            area.locs.push(loc)
                        }

                        zone.areas.push(area)
                    }

                    stock.zones.push(zone)
                }
                $scope.stocks.push(stock)
            }
        }

        $scope.selectedStock = function (item) {
            $scope.displayStock = item
        }

        $scope.showArea = function (area) {
            $scope.showDialog = true
            $scope.displayArea = area
            $scope.displayArea.usedLocCount = 0
            getDisplayAreaUsedLoc(area)
        }
        $scope.showLocation = function (loc) {
            $scope.showLoc = true
            $scope.displayLoc = loc
        }

        function getDisplayAreaUsedLoc(area) {
            area.locs.forEach(function (item) {
                if (item.hasUsed) {
                    $scope.displayArea.usedLocCount ++
                }
            })
        }
    })
})();