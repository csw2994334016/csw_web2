'use strict';

angular.module('app')
    .directive("loadingData", function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div><img src="/static/img/ajax-loader.gif"> </div>',
            scope: {
            showloading: '='
        },
        link: function (scope, el, attr) {
            scope.$watch('showloading', function (value) {
                if (value) {
                    el.addClass('loading-data').removeClass('hide')
                } else {
                    el.addClass('hide').removeClass('loading-data')
                }
            })
          }
        };
    })
.directive("modalDialog", function () {
    return {
        restrict: 'E',
        replace: true, // Replace with the template below
        templateUrl: '/pages/dialog.html' ,
        transclude: true, // we want to insert custom content inside the directive
        scope: {
            show: '='
        },
        link: function(scope, el, attrs) {
            scope.dialogStyle = {};

            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function() {
                scope.show = false;
            };
        },
    };
})