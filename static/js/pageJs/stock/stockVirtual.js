(function () {
    var app = angular.module('app', []);
    app.controller('stockVirtualCtrl', function($scope, $httpAjax) {
        $scope.stocks = []

        //getMockData()
      getWarehouses()
      function getWarehouses() {
        $scope.loadingWarehourse = true;
        $httpAjax.get('/api/basic/warehouses',null,function (res) {
          console.log('===>',res);
          $scope.wareHourse = res.data;
          if ($scope.wareHourse.length > 0) {
            $scope.displayWareHourse = $scope.wareHourse[0]
            getWarehousesInfo($scope.displayWareHourse)
          }
          $scope.$apply();
        }, function (error) {
          console.log('===>error',error);
          toastr.warning(error.msg)
        },function () {
          $scope.loadingWarehourse = false;
          $scope.$apply();
        });
      }
      
      function getWarehousesInfo(warehouses) {
        $scope.loadingWarehourse = true;
        $httpAjax.get('/api/basic/warehouses/virtualWarehouses/'+warehouses.id,null,function (res) {
          console.log('===>irtualWarehouses',res)
          warehouses.houseInfo = res.data;
          handleHouseInfoData(warehouses.houseInfo);
          $scope.$apply();
        },function (error) {
          toastr.warning(error.msg)
        },function () {
          $scope.loadingWarehourse = false;
          $scope.$apply();
        })
      }

        $scope.selectedStock = function (item) {
            $scope.displayWareHourse = item
            getWarehousesInfo($scope.displayWareHourse)
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
            area.virtualLocList.forEach(function (item) {
                if (item.useFlag) {
                    $scope.displayArea.usedLocCount ++
                }
            })
        }

        function handleHouseInfoData(houseInfo) {
          houseInfo.forEach(function (item) {
            item.virtualAreaList.forEach(function (e) {
              e.usedPercent = e.usedNum === e.totalNum ? 100 : (e.usedNum/e.totalNum *100);
            });
          })
        }
    })
})();