(function () {
    var app = angular.module('app', [])
    app.controller('userCenterCtrl', function ($scope) {

        $scope.userInfo = {
            name: '测试用户名',
            realName: '测试用户真实姓名',
            sex: '男',
            tel: '18000000000',
            email: '1553877174@qq.com',
            remark: '腹黑人回复而客户方可如今恢复',
            role: '角色A',
            permission: '权限A、权限B',
            stock: '仓库A',
        }
        $scope.modifyUser = angular.copy($scope.userInfo);
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
            setTimeout(function () {
                $scope.showConfigLoading = false;
                $scope.dialogBgdisable = false;
                $scope.userInfo = angular.copy($scope.modifyUser);
                $scope.showModifyInfo = false;
                $scope.$apply()
            },5000)
        }
    })
})();