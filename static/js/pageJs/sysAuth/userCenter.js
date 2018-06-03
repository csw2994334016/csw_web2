(function () {
    var app = angular.module('app', [])
    app.controller('userCenterCtrl', function ($scope, $httpAjax) {

        getUserInfo()

        function getUserInfo() {
            $scope.loadingPageData = true;
            $httpAjax.get('/api/sys/users/currentUser', {}, function (res) {
                $scope.userInfo = res.data;
                $scope.modifyUser = angular.copy($scope.userInfo);
                $scope.$apply()
            },function () {
                
            },function () {
                $scope.loadingPageData = false;
                $scope.$apply()
            })
        }


        $scope.dialogTitle = '信息修改';
        $scope.modifyInfo = function () {
            $scope.showModifyInfo = true;
        }

        $scope.hideModal = function () {
            $scope.showModifyInfo = false;
        }
        $scope.confirm = function () {
            $scope.showConfigLoading = true;
            $scope.dialogBgdisable = true;
            var url = '/api/sys/users/' + $scope.userInfo.id;
            var params = {
                roleId: $scope.modifyUser.sysRole.id,
                sex: $scope.modifyUser.sex,
                username: $scope.modifyUser.username,
                realName: $scope.modifyUser.realName,
                tel: $scope.modifyUser.tel,
                email: $scope.modifyUser.email,
            }
            $httpAjax.put(url, params, function (res) {
                $scope.userInfo = angular.copy($scope.modifyUser);
                $scope.$apply()
            },function () {

            },function () {
                $scope.showConfigLoading = false;
                $scope.dialogBgdisable = false;
                $scope.showModifyInfo = false;
                $scope.$apply()
            })
        }
    })
})();