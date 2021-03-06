(function () {
    var app = angular.module('app', []);
    app.controller('stockInquiryCtrl', function($scope, $httpAjax) {

      $scope.size = []   //料号
      $scope.cangqu = []  //仓区
      $scope.chuqu = []  //储区
      $scope.chuwei = []  //储位
      $scope.data = []  // 表格数据

      $scope.selectedSize = 1
      $scope.selectedCangqu = 1
      $scope.selectedChuqu = 1
      $scope.selectedChuwei = 1

        $scope.showLoading = true
        setTimeout(function () {
            $scope.showLoading = false
            $scope.$apply()
        },2000)
      getMockData()

      function getMockData() {

        for (var index = 0; index < 5; index++) {
          $scope.size.push({
            id: index + 1,
            name: '料号' + (index + 1),
          })
        }
        for (var index = 0; index < 2; index++) {
          $scope.cangqu.push({
            id: index + 1,
            name: '仓区' + (index + 1),
          })
        }
        for (var index = 0; index < 6; index++) {
          $scope.chuqu.push({
            id: index + 1,
            name: '储区' + (index + 1),
          })
        }
        for (var index = 0; index < 7; index++) {
          $scope.chuwei.push({
            id: index + 1,
            name: '储位' + (index + 1),
          })
        }
        for (var index = 0; index < 7; index++) {
          $scope.data.push({
            liaoHao: index + 1,
            pinMing: '品名' + (index + 1),
            xingHao: '',
            zaiKu: 25,
            pinZhi: '',
            danWei: '件',
            cangKu: 1,
            cangQu: 1,
            chuQu: 1,
            chuWei: 1,
          })
        }
      }

      $scope.$watch('selectedSize', function () {
        console.log($scope.selectedSize)
      })
      $scope.$watch('selectedCangqu', function () {
        console.log($scope.selectedCangqu)
      })
      $scope.$watch('selectedChuqu', function () {
        console.log($scope.selectedChuqu)
      })
      $scope.$watch('selectedChuwei', function () {
        console.log($scope.selectedChuwei)
      })

      apiTest()
      function apiTest() {
        var roleApi = 'http://47.98.251.95:8080/api/sys/roles';
        $httpAjax.get(roleApi,null,function (success) {
          console.log(success)
        },function (error) {

        })
      }
    })
})();