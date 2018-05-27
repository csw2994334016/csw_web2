(function () {
    var app = angular.module('app', []);
    app.controller('stockVirtualCtrl', function($scope, $httpAjax) {
        $scope.stocks = []

        getMockData()
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
                            usedPercent: 16/18,
                        }
                        for (var l = 0; l< 10; l++) {
                            id: l+1,
                            var loc = {
                                locName: "单元格" +(i+1)+'-'+(j+1)+'-'+(k+1)+'-'+(l+1),
                                hasUsed: l%2 === 0
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

    })
})();