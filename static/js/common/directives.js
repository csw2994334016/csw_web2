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
                console.log(value)
                if (value) {
                    el.addClass('loading-data').removeClass('hide')
                } else {
                    el.addClass('hide').removeClass('loading-data')
                }
            })
          }
        };
    })